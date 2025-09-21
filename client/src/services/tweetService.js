import axios from 'axios';

// Tweet service to handle S3 bucket connection and tweet retrieval
class TweetService {
  constructor() {
    // These will be configured from environment variables
    this.s3Config = {
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      bucketName: import.meta.env.VITE_S3_BUCKET_NAME || '',
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
      tweetsKey: import.meta.env.VITE_S3_TWEETS_KEY || 'x/basiccheck/',
    };
    
    this.tweetsCache = [];
    this.lastFetchTime = null;
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
  }

  // Initialize S3 connection using direct HTTP calls with credentials
  async initializeS3() {
    try {
      // Check if we have the required S3 configuration
      if (!this.s3Config.bucketName || !this.s3Config.region) {
        console.warn('S3 configuration incomplete, using mock data');
        return false;
      }
      
      console.log('S3 Configuration:', {
        bucket: this.s3Config.bucketName,
        region: this.s3Config.region,
        key: this.s3Config.tweetsKey,
        hasCredentials: !!(this.s3Config.accessKeyId && this.s3Config.secretAccessKey)
      });
      
      return true;
    } catch (error) {
      console.error('Failed to initialize S3 connection:', error);
      return false;
    }
  }



  // Fetch tweets from S3 using direct HTTP calls to data.json
  async fetchTweetsFromS3Direct() {
    try {
      if (!this.s3Config.bucketName) {
        console.warn('S3 bucket name not configured');
        return [];
      }

      // Direct fetch of data.json file
      const s3Url = `https://${this.s3Config.bucketName}.s3.${this.s3Config.region}.amazonaws.com/${this.s3Config.tweetsKey}data.json`;
      
      const response = await axios.get(s3Url, {
        timeout: 60000,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.data && response.data.results) {
        return this.processS3Data(response.data.results);
      }
      
      console.warn('No results found in data.json');
      return [];
      
    } catch (error) {
      console.error('Error fetching data.json from S3:', error);
      return [];
    }
  }

  // Process and convert S3 data to tweet format
  processS3Data(results) {
    try {
      if (!Array.isArray(results) || results.length === 0) {
        console.warn('No valid results array found');
        return [];
      }

      console.log(`Processing ${results.length} tweets from S3 data`);
      
      // Convert to tweet format
      const tweets = results.map((item, index) => this.convertToTweetFormat(item, index)).filter(Boolean);
      
      console.log(`Successfully converted ${tweets.length} tweets`);
      return tweets;
      
    } catch (error) {
      console.error('Error processing S3 data:', error);
      return [];
    }
  }

  // Convert bucket data format to standardized tweet format
  convertToTweetFormat(item, index) {
    try {
      // Use the exact format from your bucket data
      const tweet = {
        id: `tweet_${index}`,
        username: item.name || 'Unknown User',
        handle: item.handle || '@unknown',
        content: item.text || 'No content available',
        timestamp: new Date().toISOString(), // You can add timestamp to your bucket data if needed
        avatar: item.profile_image_url || 'https://via.placeholder.com/40/6B7280/FFFFFF?text=👤',
        verified: false,
        retweets: item.retweet_count || 0,
        likes: item.like_count || 0,
        replies: 0, // Add to bucket data if needed
        quotes: 0,  // Add to bucket data if needed
        hashtags: this.extractHashtags(item.text || ''),
        media: [],
        hasMedia: false
      };

      // Validate required fields
      if (!tweet.content || tweet.content === 'No content available') {
        return null;
      }

      return tweet;
      
    } catch (error) {
      console.warn('Error converting item to tweet format:', error, item);
      return null;
    }
  }

  // Extract hashtags from text content
  extractHashtags(text) {
    if (!text) return [];
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    return text.match(hashtagRegex) || [];
  }


  // Check if cache is valid
  isCacheValid() {
    return this.lastFetchTime && 
           (Date.now() - this.lastFetchTime) < this.cacheExpiry &&
           this.tweetsCache.length > 0;
  }

  // Fetch tweets with caching
  async getTweets(count = 10, refresh = false) {
    try {
      // Return cached data if valid and not refreshing
      if (!refresh && this.isCacheValid()) {
        return this.tweetsCache.slice(0, count);
      }

      // Fetch new data
      const tweets = await this.fetchTweetsFromS3Direct();
      
      // Update cache
      this.tweetsCache = tweets;
      this.lastFetchTime = Date.now();
      
      // Return requested number of tweets
      return tweets.slice(0, count);
      
    } catch (error) {
      console.error('Error getting tweets:', error);
      
      // Return cached data as fallback
      if (this.tweetsCache.length > 0) {
        return this.tweetsCache.slice(0, count);
      }
      
      // Return empty array if no data available
      return [];
    }
  }

  // Get more tweets (for pagination)
  async getMoreTweets(currentCount = 10, additionalCount = 10) {
    try {
      // Ensure we have data
      if (!this.isCacheValid()) {
        await this.getTweets(currentCount + additionalCount, true);
      }
      
      // Return the additional tweets
      return this.tweetsCache.slice(currentCount, currentCount + additionalCount);
    } catch (error) {
      console.error('Error getting more tweets:', error);
      return [];
    }
  }

  // Format timestamp for display
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    return date.toLocaleDateString();
  }

  // Validate tweet data structure
  validateTweetData(tweets) {
    if (!Array.isArray(tweets)) {
      return false;
    }
    
    return tweets.length > 0 && tweets.some(tweet => {
      return tweet && tweet.id && tweet.content && tweet.username;
    });
  }



  // Get processing statistics
  getStats() {
    return {
      bucketName: this.s3Config.bucketName,
      bucketPath: this.s3Config.tweetsKey,
      cachedTweets: this.tweetsCache.length,
      lastFetchTime: this.lastFetchTime ? new Date(this.lastFetchTime).toISOString() : null,
      cacheValid: this.isCacheValid(),
      cacheAge: this.lastFetchTime ? Math.round((Date.now() - this.lastFetchTime) / 1000) + 's' : null
    };
  }

  // Get file information for debugging (data.json only)
  async getFileInfo() {
    try {
      const filePath = `${this.s3Config.tweetsKey}data.json`;
      return [{
        name: 'data.json',
        path: filePath,
        url: `https://${this.s3Config.bucketName}.s3.${this.s3Config.region}.amazonaws.com/${filePath}`,
        configured: !!(this.s3Config.bucketName && this.s3Config.tweetsKey)
      }];
    } catch (error) {
      return { error: error.message };
    }
  }

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
export default new TweetService();
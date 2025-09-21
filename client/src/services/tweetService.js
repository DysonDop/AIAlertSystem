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
    this.rawDataCache = null;
    this.lastFetchTime = null;
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
    this.processedCount = 0;
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

      console.log(`Fetching tweets from S3 bucket: ${this.s3Config.bucketName}/${this.s3Config.tweetsKey}data.json`);

      // Direct fetch of data.json file
      const s3Url = `https://${this.s3Config.bucketName}.s3.${this.s3Config.region}.amazonaws.com/${this.s3Config.tweetsKey}data.json`;
      console.log(`Fetching data.json file: ${s3Url}`);
      
      const response = await axios.get(s3Url, {
        timeout: 60000, // 60 second timeout for large files
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.data) {
        console.log('Successfully fetched data.json from S3');
        return this.processS3Data(response.data, 'data.json');
      }
      
      console.warn('No data found in data.json');
      return [];
      
    } catch (error) {
      console.error('Error fetching data.json from S3:', error);
      return [];
    }
  }

  // Process and convert S3 data to tweet format
  processS3Data(rawData, fileName) {
    try {
      console.log('Processing S3 data from:', fileName, 'Data type:', typeof rawData);
      
      // Store raw data for debugging
      this.rawDataCache = rawData;
      
      let dataArray = [];
      
      // Handle JSONL format (JSON Lines) - common for social media exports
      if (typeof rawData === 'string' && fileName.endsWith('.jsonl')) {
        console.log('Processing JSONL format');
        const lines = rawData.split('\n').filter(line => line.trim());
        dataArray = lines.map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            console.warn('Invalid JSON line:', line.substring(0, 100));
            return null;
          }
        }).filter(Boolean);
      }
      // Handle regular JSON formats
      else if (Array.isArray(rawData)) {
        console.log('Processing direct array format');
        dataArray = rawData;
      } else if (rawData.data && Array.isArray(rawData.data)) {
        console.log('Processing data.data array format');
        dataArray = rawData.data;
      } else if (rawData.tweets && Array.isArray(rawData.tweets)) {
        console.log('Processing data.tweets array format');
        dataArray = rawData.tweets;
      } else if (rawData.results && Array.isArray(rawData.results)) {
        console.log('Processing data.results array format');
        dataArray = rawData.results;
      } else if (typeof rawData === 'object') {
        // If it's an object, try to find arrays within it
        console.log('Searching for arrays in object, keys:', Object.keys(rawData));
        const keys = Object.keys(rawData);
        for (const key of keys) {
          if (Array.isArray(rawData[key]) && rawData[key].length > 0) {
            console.log(`Found array in key: ${key} with ${rawData[key].length} items`);
            dataArray = rawData[key];
            break;
          }
        }
        
        // If still no array found, maybe it's a single object that should be in an array
        if (dataArray.length === 0 && Object.keys(rawData).length > 0) {
          console.log('Converting single object to array');
          dataArray = [rawData];
        }
      }

      if (!Array.isArray(dataArray) || dataArray.length === 0) {
        console.warn('No valid array data found in S3 response. Data structure:', Object.keys(rawData || {}));
        return [];
      }

      console.log(`Found ${dataArray.length} items in S3 data`);
      
      // Convert to tweet format (limit to first 1000 for performance)
      const tweets = dataArray.slice(0, 1000).map((item, index) => this.convertToTweetFormat(item, index)).filter(Boolean);
      
      console.log(`Successfully converted ${tweets.length} tweets from ${dataArray.length} items`);
      this.processedCount = tweets.length;
      return tweets;
      
    } catch (error) {
      console.error('Error processing S3 data:', error);
      return [];
    }
  }

  // Convert various data formats to standardized tweet format
  convertToTweetFormat(item, index) {
    try {
      // Generate anonymous username and handle
      const anonymousNames = [
        'Anonymous User', 'Social Observer', 'Community Member', 'Local Resident',
        'Concerned Citizen', 'News Watcher', 'Alert Monitor', 'Safety Advocate',
        'Weather Observer', 'Traffic Reporter', 'Emergency Watcher', 'City Observer'
      ];
      
      const randomName = anonymousNames[index % anonymousNames.length];
      const anonymousHandle = `user${(index + 1).toString().padStart(3, '0')}`;

      // Extract media/photos from various possible fields
      let media = [];
      
      // Handle different media field structures
      if (item.media && Array.isArray(item.media)) {
        media = item.media.map(m => ({
          url: m.url || m.media_url || m.media_url_https || m.preview_image_url,
          type: m.type || 'photo'
        }));
      } else if (item.photos && Array.isArray(item.photos)) {
        media = item.photos.map(photo => ({
          url: photo.url || photo,
          type: 'photo'
        }));
      } else if (item.images && Array.isArray(item.images)) {
        media = item.images.map(img => ({
          url: img.url || img,
          type: 'photo'
        }));
      } else if (item.attachments && Array.isArray(item.attachments)) {
        media = item.attachments.filter(att => att.type === 'photo' || att.media_url).map(att => ({
          url: att.media_url || att.url,
          type: att.type || 'photo'
        }));
      } else if (item.entities && item.entities.media && Array.isArray(item.entities.media)) {
        media = item.entities.media.map(m => ({
          url: m.media_url_https || m.media_url || m.url,
          type: m.type || 'photo'
        }));
      }

      // Filter out invalid URLs and limit to first 4 images
      media = media.filter(m => m.url && typeof m.url === 'string').slice(0, 4);

      // Handle different possible data structures
      const tweet = {
        id: item.id || item.tweet_id || item._id || `s3_${index}`,
        username: randomName,
        handle: anonymousHandle,
        content: item.content || item.text || item.tweet_text || item.message || 'No content available',
        timestamp: item.timestamp || item.created_at || item.date || new Date().toISOString(),
        avatar: 'https://via.placeholder.com/40/6B7280/FFFFFF?text=👤',
        verified: false,
        retweets: item.retweets || item.retweet_count || item.public_metrics?.retweet_count || item.quote_count || 0,
        likes: item.likes || item.favorite_count || item.public_metrics?.like_count || item.favorited_count || 0,
        replies: item.replies || item.reply_count || item.public_metrics?.reply_count || 0,
        quotes: item.quotes || item.quote_count || item.public_metrics?.quote_count || 0,
        hashtags: item.hashtags || this.extractHashtags(item.content || item.text || ''),
        media: media,
        hasMedia: media.length > 0
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

  // Get empty array when no data is available
  getMockTweets() {
    return [];
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
      
      // Return mock data as last resort
      return this.getMockTweets().slice(0, count);
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

  // Debug method to inspect raw S3 data
  getRawData() {
    return this.rawDataCache;
  }

  // Get processing statistics
  getStats() {
    return {
      bucketName: this.s3Config.bucketName,
      bucketPath: this.s3Config.tweetsKey,
      cachedTweets: this.tweetsCache.length,
      lastFetchTime: this.lastFetchTime ? new Date(this.lastFetchTime).toISOString() : null,
      processedCount: this.processedCount,
      cacheValid: this.isCacheValid(),
      cacheAge: this.lastFetchTime ? Math.round((Date.now() - this.lastFetchTime) / 1000) + 's' : null,
      hasRawData: !!this.rawDataCache,
      rawDataKeys: this.rawDataCache ? Object.keys(this.rawDataCache).slice(0, 10) : []
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
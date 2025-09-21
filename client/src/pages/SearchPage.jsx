import React, { useState, useEffect } from 'react';
import { Search, Twitter, TrendingUp, MapPin, Clock, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import DisasterMap from '../components/maps/DisasterMap';
import Tweet from '../components/social/Tweet';
import tweetService from '../services/tweetService';
import { alertService, twitterService, weatherService } from '../services/api.js';
import '../styles/pages/search.css';

const SearchPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState('social');
  const [selectedDisasterType, setSelectedDisasterType] = useState('all');
  const [tweetCount, setTweetCount] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch tweets from S3 bucket using tweet service
        const tweetsData = await tweetService.getTweets(10);
        setTweets(tweetsData || []);
        
        // Fetch alerts (keeping existing logic for now)
        try {
          const alertsData = await alertService.getActiveAlerts();
          setAlerts(alertsData || []);
        } catch (alertError) {
          console.warn('Alert service not available:', alertError);
          setAlerts([]);
        }
        
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setTweets([]);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load more tweets function
  const loadMoreTweets = async () => {
    try {
      setLoadingMore(true);
      const moreTweets = await tweetService.getMoreTweets(tweetCount, 10);
      setTweets(prev => [...prev, ...moreTweets]);
      setTweetCount(prev => prev + 10);
    } catch (error) {
      console.error('Failed to load more tweets:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Refresh tweets function
  const refreshTweets = async () => {
    try {
      setLoading(true);
      const freshTweets = await tweetService.getTweets(10, true);
      setTweets(freshTweets);
      setTweetCount(10);
    } catch (error) {
      console.error('Failed to refresh tweets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debug function to check S3 connection
  const debugS3Connection = async () => {
    try {
      const stats = tweetService.getStats();
      const fileInfo = await tweetService.getFileInfo();
      
      console.log('Tweet Service Stats:', stats);
      console.log('S3 Files Info:', fileInfo);
      
      const debugInfo = {
        connection: stats,
        files: fileInfo,
        cachedTweets: stats.cachedTweets,
        cacheValid: stats.cacheValid
      };
      
      alert(`Debug Info:\n${JSON.stringify(debugInfo, null, 2)}`);
    } catch (error) {
      console.error('Debug failed:', error);
      alert(`Debug failed: ${error.message}`);
    }
  };

  const disasterTypes = ['all', 'earthquake', 'flood', 'wildfire', 'storm'];

  const filteredTweets = tweets.filter(tweet => {
    const matchesSearch = searchTerm === '' || 
      tweet.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tweet.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tweet.hashtags && tweet.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesType = selectedDisasterType === 'all' || 
      (tweet.hashtags && tweet.hashtags.some(tag => 
        tag.toLowerCase().includes(selectedDisasterType.toLowerCase())
      ));
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading social media monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">🐦 Social Media Monitor</h1>
          <p className="page-subtitle">
            Monitor social media for disaster-related posts and cross-reference with official data
          </p>
        </div>

        {/* Search Bar */}
        <div className="content-card mb-8">
          <div className="search-filters-row">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search social media posts, keywords, or locations..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Disaster Type Filter */}
            <div className="filter-dropdown">
              <select 
                value={selectedDisasterType}
                onChange={(e) => setSelectedDisasterType(e.target.value)}
                className="filter-select"
              >
                {disasterTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs mb-8">
          <button
            className={`tab ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            <Twitter size={16} />
            Social Media Posts ({filteredTweets.length})
          </button>
          <button
            className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <AlertTriangle size={16} />
            Validated Alerts ({alerts.length})
          </button>
        </div>

        {/* Content */}
        <div className="content">
          {activeTab === 'social' ? (
            <div className="social-media-section">
              {/* Social Media Posts Header */}
              <div className="section-header">
                <h2 className="section-title">Social Media Posts</h2>
                <div className="header-controls">
                  <button 
                    onClick={debugS3Connection}
                    className="debug-btn"
                    title="Debug S3 Connection"
                  >
                    Debug S3
                  </button>
                  <button 
                    onClick={refreshTweets}
                    className="refresh-btn"
                    disabled={loading}
                  >
                    <RefreshCw size={16} className={loading ? 'spinning' : ''} />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Tweets Grid */}
              <div className="tweets-grid">
                {filteredTweets.length === 0 ? (
                  <div className="empty-state">
                    <Twitter size={48} className="empty-icon" />
                    <h3>No social media posts found</h3>
                    <p>Try adjusting your search filters</p>
                  </div>
                ) : (
                  <>
                    {filteredTweets.slice(0, 10).map(tweet => (
                      <div key={tweet.id} className="tweet-wrapper">
                        <Tweet tweet={tweet} />
                      </div>
                    ))}
                    
                    {/* Load More Button */}
                    {tweets.length >= 10 && (
                      <div className="load-more-section">
                        <button 
                          onClick={loadMoreTweets}
                          className="load-more-btn"
                          disabled={loadingMore}
                        >
                          {loadingMore ? (
                            <>
                              <RefreshCw size={16} className="spinning" />
                              Loading...
                            </>
                          ) : (
                            'Load More Posts'
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="alerts-grid">
              {alerts.length === 0 ? (
                <div className="empty-state">
                  <AlertTriangle size={48} className="empty-icon" />
                  <h3>No validated alerts</h3>
                  <p>Alerts will appear here after social media validation</p>
                </div>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="alert-card content-card">
                    <div className="alert-header">
                      <div className={`alert-severity ${alert.severity}`}>
                        <AlertTriangle size={16} />
                        {alert.severity.toUpperCase()}
                      </div>
                      <span className="alert-timestamp">{alert.timestamp}</span>
                    </div>
                    
                    <h3 className="alert-title">{alert.title}</h3>
                    <p className="alert-description">{alert.description}</p>
                    
                    <div className="alert-location">
                      <MapPin size={14} />
                      {alert.location}
                    </div>
                    
                    <div className="validation-info">
                      <span className="validation-sources">
                        Verified by {alert.sources} social media posts
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
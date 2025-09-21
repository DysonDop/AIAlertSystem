import React, { useState, useEffect } from 'react';
import { Search, Twitter, TrendingUp, MapPin, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import DisasterMap from '../components/maps/DisasterMap';
import { alertService, twitterService, weatherService } from '../services/api.js';
import '../styles/pages/search.css';

const SearchPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tweets');
  const [selectedDisasterType, setSelectedDisasterType] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const alertsData = await alertService.getActiveAlerts();
        setAlerts(alertsData || []);
        
        // Mock social media monitoring data for development
        const mockTweets = [
          {
            id: '1',
            author: {
              name: 'WeatherAlert_MY',
              handle: 'weatheralert_my',
              avatar: '/api/placeholder/32/32'
            },
            content: 'URGENT: Flash flood warning issued for Kuala Lumpur area. Heavy rainfall expected in next 2 hours. Avoid low-lying areas! #FlashFlood #KL',
            timestamp: '2 minutes ago',
            validationStatus: 'verified',
            location: 'Kuala Lumpur',
            relevanceScore: 95,
            disasterTypes: ['flood'],
            media: [
              { url: '/api/placeholder/300/200', type: 'image' }
            ],
            keywords: ['flood', 'rainfall', 'warning']
          },
          {
            id: '2',
            author: {
              name: 'CitizenReporter',
              handle: 'citizen_news',
              avatar: '/api/placeholder/32/32'
            },
            content: 'Water level rising rapidly near my house in Taman Desa. Cars starting to get stuck. Need assistance! #Flood #Emergency',
            timestamp: '5 minutes ago',
            validationStatus: 'pending',
            location: 'Taman Desa, KL',
            relevanceScore: 88,
            disasterTypes: ['flood'],
            media: [
              { url: '/api/placeholder/300/200', type: 'image' }
            ],
            keywords: ['flood', 'water', 'emergency']
          },
          {
            id: '3',
            author: {
              name: 'JohnDoe',
              handle: 'johndoe123',
              avatar: '/api/placeholder/32/32'
            },
            content: 'Major earthquake just hit downtown! Buildings shaking, people running to streets. Stay safe everyone! #earthquake #emergency',
            timestamp: '15 minutes ago',
            validationStatus: 'verified',
            location: 'Downtown KL',
            relevanceScore: 92,
            disasterTypes: ['earthquake'],
            media: [],
            keywords: ['earthquake', 'emergency', 'downtown']
          },
          {
            id: '4',
            author: {
              name: 'LocalNews_KL',
              handle: 'localnews_kl',
              avatar: '/api/placeholder/32/32'
            },
            content: 'Wildfire smoke visible from city center. Air quality deteriorating. Health advisory issued - stay indoors. #wildfire #airquality',
            timestamp: '30 minutes ago',
            validationStatus: 'conflicting',
            location: 'Kuala Lumpur',
            relevanceScore: 75,
            disasterTypes: ['wildfire'],
            media: [
              { url: '/api/placeholder/300/200', type: 'image' }
            ],
            keywords: ['wildfire', 'smoke', 'air quality']
          }
        ];
        setTweets(mockTweets);

        // Mock validated alerts
        const mockAlerts = [
          {
            id: 1,
            title: 'Flash Flood Alert - Kuala Lumpur',
            description: 'Official flood warning confirmed by meteorological data and cross-referenced with social media reports',
            severity: 'high',
            location: 'Kuala Lumpur Metropolitan Area',
            timestamp: '1 minute ago',
            sources: 12
          },
          {
            id: 2,
            title: 'Earthquake Alert - Downtown KL',
            description: 'Seismic activity detected and verified through multiple social media reports',
            severity: 'medium',
            location: 'Downtown Kuala Lumpur',
            timestamp: '10 minutes ago',
            sources: 8
          }
        ];
        setAlerts(mockAlerts);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const disasterTypes = ['all', 'earthquake', 'flood', 'wildfire', 'storm'];

  const filteredTweets = selectedDisasterType === 'all' 
    ? tweets.filter(tweet => 
        tweet.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tweet.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : tweets.filter(tweet => 
        tweet.disasterTypes.includes(selectedDisasterType) &&
        (tweet.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
         tweet.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())))
      );

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
            className={`tab ${activeTab === 'tweets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tweets')}
          >
            <Twitter size={16} />
            Social Posts ({filteredTweets.length})
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
          {activeTab === 'tweets' ? (
            <div className="tweets-grid">
              {filteredTweets.length === 0 ? (
                <div className="empty-state">
                  <Twitter size={48} className="empty-icon" />
                  <h3>No social media posts found</h3>
                  <p>Try adjusting your search filters</p>
                </div>
              ) : (
                filteredTweets.map(tweet => (
                  <div key={tweet.id} className="tweet-card content-card">
                    <div className="tweet-header">
                      <div className="user-info">
                        <img src={tweet.author.avatar} alt={tweet.author.name} className="avatar" />
                        <div>
                          <div className="username">{tweet.author.name}</div>
                          <div className="handle">@{tweet.author.handle}</div>
                        </div>
                      </div>
                      <div className="tweet-meta">
                        <span className="timestamp">{tweet.timestamp}</span>
                        <span className={`validation-badge ${tweet.validationStatus}`}>
                          {tweet.validationStatus === 'verified' && <CheckCircle size={14} />}
                          {tweet.validationStatus === 'pending' && <Clock size={14} />}
                          {tweet.validationStatus === 'conflicting' && <AlertTriangle size={14} />}
                          {tweet.validationStatus.charAt(0).toUpperCase() + tweet.validationStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="tweet-content">
                      <p>{tweet.content}</p>
                      {tweet.media && tweet.media.length > 0 && (
                        <div className="tweet-media">
                          {tweet.media.map((media, index) => (
                            <img key={index} src={media.url} alt="Social media content" className="media-image" />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="tweet-footer">
                      <div className="engagement-stats">
                        <span className="stat">
                          <MapPin size={14} />
                          {tweet.location}
                        </span>
                        <span className="stat">
                          <TrendingUp size={14} />
                          Relevance: {tweet.relevanceScore}%
                        </span>
                      </div>
                      
                      <div className="disaster-tags">
                        {tweet.disasterTypes.map(type => (
                          <span key={type} className={`disaster-tag ${type}`}>
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
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
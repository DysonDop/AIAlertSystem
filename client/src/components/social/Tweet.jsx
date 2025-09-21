import React from 'react';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, CheckCircle } from 'lucide-react';
import '../../styles/components/tweet.css';

const Tweet = ({ tweet }) => {
  const {
    id,
    username,
    handle,
    content,
    timestamp,
    avatar,
    verified = false,
    retweets = 0,
    likes = 0,
    hashtags = []
  } = tweet;

  // Format numbers for display (e.g., 1200 -> 1.2K)
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
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
  };

  // Parse content and highlight hashtags
  const renderContent = (text) => {
    const words = text.split(' ');
    return words.map((word, index) => {
      if (word.startsWith('#')) {
        return (
          <span key={index} className="hashtag">
            {word}
          </span>
        );
      }
      return word + ' ';
    });
  };

  return (
    <div className="tweet" data-tweet-id={id}>
      <div className="tweet-header">
        <div className="tweet-avatar">
          <img 
            src={avatar || 'https://via.placeholder.com/40'} 
            alt={`${username} avatar`}
            className="avatar-image"
          />
        </div>
        
        <div className="tweet-author">
          <div className="author-info">
            <span className="username">{username}</span>
            {verified && (
              <CheckCircle className="verified-badge" size={16} />
            )}
          </div>
          <span className="handle">{handle}</span>
        </div>
        
        <div className="tweet-meta">
          <span className="timestamp">{formatTimestamp(timestamp)}</span>
          <button className="more-options" aria-label="More options">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      
      <div className="tweet-content">
        <p className="tweet-text">
          {renderContent(content)}
        </p>
        
        {/* Media Gallery */}
        {tweet.media && tweet.media.length > 0 && (
          <div className={`tweet-media media-count-${tweet.media.length}`}>
            {tweet.media.map((mediaItem, index) => (
              <div key={index} className="media-item">
                <img 
                  src={mediaItem.url} 
                  alt={`Media ${index + 1}`}
                  className="media-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="tweet-actions">
        <button className="action-btn reply-btn" aria-label="Reply">
          <MessageCircle size={16} />
        </button>
        
        <button className="action-btn retweet-btn" aria-label="Retweet">
          <Repeat2 size={16} />
          {retweets > 0 && <span className="action-count">{formatNumber(retweets)}</span>}
        </button>
        
        <button className="action-btn like-btn" aria-label="Like">
          <Heart size={16} />
          {likes > 0 && <span className="action-count">{formatNumber(likes)}</span>}
        </button>
        
        <button className="action-btn share-btn" aria-label="Share">
          <Share size={16} />
        </button>
      </div>
    </div>
  );
};

export default Tweet;
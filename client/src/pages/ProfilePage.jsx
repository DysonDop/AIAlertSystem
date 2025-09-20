import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    joinedDate: user?.joinedDate || new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      joinedDate: user?.joinedDate || new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Profile</h1>
          <div className="profile-actions">
            {!isEditing ? (
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  <X size={16} />
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleSave}
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-content">
          {/* Profile Avatar Section */}
          <div className="profile-avatar-section">
            <div className="profile-avatar-container">
              <div className="profile-avatar">
                <User size={48} />
              </div>
              {isEditing && (
                <button className="avatar-edit-btn">
                  <Camera size={16} />
                </button>
              )}
            </div>
            <div className="profile-basic-info">
              {!isEditing ? (
                <>
                  <h2 className="profile-name">{profileData.name}</h2>
                  <p className="profile-email">{profileData.email}</p>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    className="profile-input profile-name-input"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your name"
                  />
                  <input
                    type="email"
                    className="profile-input profile-email-input"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="profile-details">
            <div className="profile-section">
              <h3 className="section-title">Personal Information</h3>
              <div className="profile-fields">
                
                <div className="profile-field">
                  <div className="field-icon">
                    <Phone size={20} />
                  </div>
                  <div className="field-content">
                    <label className="field-label">Phone</label>
                    {!isEditing ? (
                      <p className="field-value">{profileData.phone || 'Not provided'}</p>
                    ) : (
                      <input
                        type="tel"
                        className="profile-input"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    )}
                  </div>
                </div>

                <div className="profile-field">
                  <div className="field-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="field-content">
                    <label className="field-label">Location</label>
                    {!isEditing ? (
                      <p className="field-value">{profileData.location || 'Not provided'}</p>
                    ) : (
                      <input
                        type="text"
                        className="profile-input"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Enter your location"
                      />
                    )}
                  </div>
                </div>

                <div className="profile-field">
                  <div className="field-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="field-content">
                    <label className="field-label">Member Since</label>
                    <p className="field-value">
                      {new Date(profileData.joinedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="profile-section">
              <h3 className="section-title">About</h3>
              <div className="profile-bio">
                {!isEditing ? (
                  <p className="bio-text">
                    {profileData.bio || 'Tell us a bit about yourself...'}
                  </p>
                ) : (
                  <textarea
                    className="profile-textarea"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us a bit about yourself..."
                    rows={4}
                  />
                )}
              </div>
            </div>

            {/* Account Statistics */}
            <div className="profile-section">
              <h3 className="section-title">Activity</h3>
              <div className="profile-stats">
                <div className="stat-card">
                  <div className="stat-number">12</div>
                  <div className="stat-label">Alerts Received</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">3</div>
                  <div className="stat-label">Emergency Reports</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">7</div>
                  <div className="stat-label">Days Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
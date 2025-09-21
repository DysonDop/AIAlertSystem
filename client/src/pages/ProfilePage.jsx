import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  confirmSignUp,
  resendSignUpCode,
} from "aws-amplify/auth";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    bio: user?.bio || "",
    joinedDate: user?.joinedDate || new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validatePhoneNumber = (phone) => {
    if (!phone || phone.trim() === "") return true; // Allow empty phone numbers
    
    // Check if phone starts with + (country code)
    if (!phone.trim().startsWith("+")) {
      return false;
    }
    
    // Check if it has at least country code + some digits (minimum +1234567890 format)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.trim());
  };

  const handleSave = async () => {
    try {
      // Validate phone number if provided
      if (profileData.phone && !validatePhoneNumber(profileData.phone)) {
        alert("Please enter a valid phone number with country code (e.g., +1234567890)");
        return;
      }

      await updateProfile(profileData);
      setIsEditing(false);
      // You could add a success message here if you have a notification system
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      // You could add an error message here if you have a notification system
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      bio: user?.bio || "",
      joinedDate: user?.joinedDate || new Date().toISOString().split("T")[0],
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
                <button className="btn btn-secondary" onClick={handleCancel}>
                  <X size={16} />
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
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
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your name"
                  />
                  <input
                    type="email"
                    className="profile-input profile-email-input"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                      <p className="field-value">
                        {profileData.phone || "Not provided"}
                      </p>
                    ) : (
                      <input
                        type="tel"
                        className="profile-input"
                        value={profileData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="Enter phone with country code (e.g., +1234567890)"
                      />
                    )}
                  </div>
                </div>

                <div className="profile-field">
                  <div className="field-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="field-content">
                    <label className="field-label">Address</label>
                    {!isEditing ? (
                      <p className="field-value">
                        {profileData.address || "Not provided"}
                      </p>
                    ) : (
                      <input
                        type="text"
                        className="profile-input"
                        value={profileData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Enter your address"
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
                      {new Date(profileData.joinedDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
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
                    {profileData.bio || "Tell us a bit about yourself..."}
                  </p>
                ) : (
                  <textarea
                    className="profile-textarea"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
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

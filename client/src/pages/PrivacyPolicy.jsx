import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/pages/legal.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Header */}
        <div className="legal-header">
          <Link to="/" className="legal-brand">
            <AlertTriangle className="brand-icon" />
            <span className="brand-name">Disaster Alert System</span>
          </Link>
          
          <Link to="/register" className="back-button">
            <ArrowLeft size={16} />
            Back to Registration
          </Link>
        </div>

        {/* Content */}
        <div className="legal-content">
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-subtitle">Last updated: September 20, 2025</p>

          <div className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              The Disaster Alert System ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our emergency alert service.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Information We Collect</h2>
            
            <h3>Personal Information</h3>
            <p>We may collect the following types of personal information:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, phone number</li>
              <li><strong>Profile Data:</strong> Emergency contacts, medical information (optional)</li>
              <li><strong>Location Data:</strong> GPS coordinates, address information</li>
              <li><strong>Communication Preferences:</strong> Notification settings, alert preferences</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you use our Service, we automatically collect:</p>
            <ul>
              <li><strong>Device Information:</strong> Device type, operating system, browser information</li>
              <li><strong>Usage Data:</strong> App interactions, feature usage, session duration</li>
              <li><strong>Log Data:</strong> IP address, access times, error logs</li>
              <li><strong>Location Data:</strong> Real-time location for emergency services (when enabled)</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li><strong>Emergency Services:</strong> Provide real-time alerts and emergency assistance</li>
              <li><strong>Location-Based Alerts:</strong> Send relevant disaster warnings based on your location</li>
              <li><strong>Service Improvement:</strong> Analyze usage patterns to enhance our service</li>
              <li><strong>Communication:</strong> Send service updates and emergency notifications</li>
              <li><strong>Safety Features:</strong> Enable search and rescue coordination when needed</li>
              <li><strong>Account Management:</strong> Maintain your account and preferences</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Location Data</h2>
            <div className="legal-highlight">
              <AlertTriangle size={16} />
              <p><strong>Critical for Emergency Response:</strong> Your location data is essential for providing relevant alerts and emergency assistance.</p>
            </div>
            <p>We collect and use location data to:</p>
            <ul>
              <li>Send location-specific emergency alerts</li>
              <li>Coordinate emergency response and rescue efforts</li>
              <li>Display relevant disaster information on maps</li>
              <li>Connect you with local emergency services</li>
            </ul>
            <p>
              <strong>You can control location sharing</strong> through your device settings and our app preferences. However, disabling location services may limit the effectiveness of emergency features.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Information Sharing</h2>
            <p>We may share your information with:</p>
            
            <h3>Emergency Services</h3>
            <p>
              In emergency situations, we may share your location and contact information with:
            </p>
            <ul>
              <li>Local emergency responders (fire, police, medical)</li>
              <li>Search and rescue organizations</li>
              <li>Government emergency management agencies</li>
              <li>Authorized emergency personnel</li>
            </ul>

            <h3>Service Providers</h3>
            <p>We work with trusted third parties who help us provide our service:</p>
            <ul>
              <li>Cloud hosting and data storage providers</li>
              <li>Communication service providers</li>
              <li>Analytics and monitoring services</li>
              <li>Map and location services</li>
            </ul>

            <h3>Legal Requirements</h3>
            <p>We may disclose your information when required by law or to:</p>
            <ul>
              <li>Comply with legal processes or government requests</li>
              <li>Protect public safety during emergencies</li>
              <li>Enforce our terms of service</li>
              <li>Protect our rights and property</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul>
              <li><strong>Encryption:</strong> Data is encrypted in transit and at rest</li>
              <li><strong>Access Controls:</strong> Limited access to authorized personnel only</li>
              <li><strong>Monitoring:</strong> Continuous monitoring for security threats</li>
              <li><strong>Regular Updates:</strong> Security measures are regularly reviewed and updated</li>
            </ul>
            <p>
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Data Retention</h2>
            <p>We retain your information:</p>
            <ul>
              <li><strong>Account Data:</strong> Until you delete your account</li>
              <li><strong>Emergency Records:</strong> As required by law (typically 7 years)</li>
              <li><strong>Usage Data:</strong> For up to 2 years for service improvement</li>
              <li><strong>Location History:</strong> For 30 days unless longer retention is required for safety</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>8. Your Rights and Choices</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> View the personal information we have about you</li>
              <li><strong>Correction:</strong> Update or correct your personal information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Export your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from non-emergency communications</li>
            </ul>
            <p>
              <strong>Note:</strong> Some emergency-related data may need to be retained for legal compliance and public safety reasons.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Children's Privacy</h2>
            <p>
              Our Service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. International Users</h2>
            <p>
              If you are using our Service from outside your country, please be aware that your information may be transferred to, stored, and processed in countries where our servers are located. By using our Service, you consent to such transfers.
            </p>
          </div>

          <div className="legal-section">
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. For significant changes, we may provide additional notice.
            </p>
          </div>

          <div className="legal-section">
            <h2>12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="contact-info">
              <p>Email: privacy@disasteralertsystem.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Safety Street, Emergency City, EC 12345</p>
            </div>
          </div>

          <div className="legal-footer">
            <p>
              By using our Service, you acknowledge that you have read and understood this Privacy Policy and agree to the collection and use of information in accordance with this policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
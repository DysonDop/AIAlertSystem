import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/pages/legal.css';

const TermsOfService = () => {
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
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-subtitle">Last updated: September 20, 2025</p>

          <div className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Disaster Alert System ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Description of Service</h2>
            <p>
              Our Disaster Alert System provides real-time emergency notifications, disaster monitoring, and safety information to help users stay informed during emergency situations. The Service includes:
            </p>
            <ul>
              <li>Real-time disaster alerts and notifications</li>
              <li>Interactive emergency maps and tracking</li>
              <li>Search and rescue coordination tools</li>
              <li>Personal safety settings and preferences</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Emergency Disclaimer</h2>
            <div className="legal-warning">
              <AlertTriangle size={20} />
              <div>
                <p><strong>IMPORTANT:</strong> This Service is designed to supplement, not replace, official emergency services and communications.</p>
                <p><strong>In case of immediate danger or life-threatening emergency, always call your local emergency services (911, 112, etc.) first.</strong></p>
              </div>
            </div>
            <p>
              While we strive to provide accurate and timely information, we cannot guarantee the completeness, accuracy, or timeliness of emergency information. Users should always verify critical information through official emergency channels.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul>
              <li>Provide accurate and current information when creating your account</li>
              <li>Use the Service responsibly and not abuse emergency features</li>
              <li>Not create false emergency reports or spam the system</li>
              <li>Respect other users and emergency personnel</li>
              <li>Keep your login credentials secure and confidential</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Location Services</h2>
            <p>
              Our Service may request access to your location to provide relevant emergency alerts and assistance. By enabling location services, you consent to the collection and use of your location data as described in our Privacy Policy.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Service Availability</h2>
            <p>
              We strive to maintain service availability 24/7, but cannot guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, technical issues, or circumstances beyond our control. We are not liable for any consequences resulting from service interruptions.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Prohibited Uses</h2>
            <p>You may not use our Service:</p>
            <ul>
              <li>For any unlawful purpose or to solicit others to unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
              <li>To impersonate or attempt to impersonate emergency personnel or officials</li>
              <li>To create false emergency reports or alarms</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>8. Limitation of Liability</h2>
            <p>
              In no event shall the Disaster Alert System, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Data and Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </div>

          <div className="legal-section">
            <h2>11. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="contact-info">
              <p>Email: legal@disasteralertsystem.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Safety Street, Emergency City, EC 12345</p>
            </div>
          </div>

          <div className="legal-footer">
            <p>
              By using our Service, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
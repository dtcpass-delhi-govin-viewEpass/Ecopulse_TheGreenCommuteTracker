import React from 'react';
import { Leaf, Heart, Users, Target, Mail, ExternalLink } from 'lucide-react';
import LinearGradient from '../components/LinearGradient';
import { useApp } from '../contexts/AppContext';
import Colors from '../constants/colors';

const About: React.FC = () => {
  const { user, logout } = useApp();

  const handleEmailPress = () => {
    window.open('mailto:hello@ecopulse.app?subject=EcoPulse Feedback', '_blank');
  };

  const handleWebsitePress = () => {
    window.open('https://ecopulse.app', '_blank');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={styles.container}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.secondary]}
        style={styles.header}
      >
        <Leaf size={60} color={Colors.light.card} />
        <h1 style={styles.headerTitle}>EcoPulse</h1>
        <p style={styles.headerSubtitle}>Smart Green Commute Tracker</p>
      </LinearGradient>

      <div style={styles.content}>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Target size={24} color={Colors.light.primary} />
            <h2 style={styles.sectionTitle}>Our Mission</h2>
          </div>
          <p style={styles.sectionText}>
            EcoPulse empowers individuals to make a positive environmental impact through sustainable commuting choices. 
            We believe that small daily actions can create significant change when multiplied across communities.
          </p>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Heart size={24} color={Colors.light.primary} />
            <h2 style={styles.sectionTitle}>Why Green Commuting Matters</h2>
          </div>
          <div style={styles.benefitsList}>
            <div style={styles.benefitItem}>
              <span style={styles.benefitIcon}>🌍</span>
              <span style={styles.benefitText}>Reduces carbon emissions and air pollution</span>
            </div>
            <div style={styles.benefitItem}>
              <span style={styles.benefitIcon}>💪</span>
              <span style={styles.benefitText}>Improves personal health and fitness</span>
            </div>
            <div style={styles.benefitItem}>
              <span style={styles.benefitIcon}>💰</span>
              <span style={styles.benefitText}>Saves money on fuel and parking</span>
            </div>
            <div style={styles.benefitItem}>
              <span style={styles.benefitIcon}>🚗</span>
              <span style={styles.benefitText}>Reduces traffic congestion</span>
            </div>
            <div style={styles.benefitItem}>
              <span style={styles.benefitIcon}>🧘</span>
              <span style={styles.benefitText}>Reduces stress and improves mental health</span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Users size={24} color={Colors.light.primary} />
            <h2 style={styles.sectionTitle}>Tips for Sustainable Travel</h2>
          </div>
          <div style={styles.tipsList}>
            <div style={styles.tipItem}>
              <span style={styles.tipNumber}>1</span>
              <p style={styles.tipText}>
                <strong style={styles.tipTitle}>Walk or Bike:</strong> For short distances under 5km, 
                walking or cycling is often faster and always greener.
              </p>
            </div>
            <div style={styles.tipItem}>
              <span style={styles.tipNumber}>2</span>
              <p style={styles.tipText}>
                <strong style={styles.tipTitle}>Public Transport:</strong> Buses and trains can carry 
                many people efficiently, reducing per-person emissions.
              </p>
            </div>
            <div style={styles.tipItem}>
              <span style={styles.tipNumber}>3</span>
              <p style={styles.tipText}>
                <strong style={styles.tipTitle}>Carpool:</strong> Share rides with colleagues or 
                neighbors to split emissions and costs.
              </p>
            </div>
            <div style={styles.tipItem}>
              <span style={styles.tipNumber}>4</span>
              <p style={styles.tipText}>
                <strong style={styles.tipTitle}>Electric Vehicles:</strong> If you must drive, 
                consider switching to an electric or hybrid vehicle.
              </p>
            </div>
            <div style={styles.tipItem}>
              <span style={styles.tipNumber}>5</span>
              <p style={styles.tipText}>
                <strong style={styles.tipTitle}>Combine Trips:</strong> Plan your route to combine 
                multiple errands in one journey.
              </p>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Leaf size={24} color={Colors.light.primary} />
            <h2 style={styles.sectionTitle}>How We Calculate CO₂ Savings</h2>
          </div>
          <p style={styles.sectionText}>
            Our calculations are based on average emission factors from transportation studies:
          </p>
          <div style={styles.emissionsList}>
            <p style={styles.emissionItem}>🚗 Car (Petrol): 171g CO₂/km</p>
            <p style={styles.emissionItem}>🚌 Public Bus: 89g CO₂/km</p>
            <p style={styles.emissionItem}>🚊 Metro/Train: 41g CO₂/km</p>
            <p style={styles.emissionItem}>⚡ Electric Vehicle: 53g CO₂/km</p>
            <p style={styles.emissionItem}>🚶 Walking/Biking: 0g CO₂/km</p>
          </div>
          <p style={styles.sectionText}>
            We compare your chosen transport method against the average car to calculate your CO₂ savings.
          </p>
        </div>

        <div style={styles.contactSection}>
          <h3 style={styles.contactTitle}>Get in Touch</h3>
          <button style={styles.contactButton} onClick={handleEmailPress}>
            <Mail size={20} color={Colors.light.primary} />
            <span style={styles.contactButtonText}>Send Feedback</span>
          </button>
          <button style={styles.contactButton} onClick={handleWebsitePress}>
            <ExternalLink size={20} color={Colors.light.primary} />
            <span style={styles.contactButtonText}>Visit Website</span>
          </button>
        </div>

        {user && (
          <div style={styles.userSection}>
            <h3 style={styles.userTitle}>Account</h3>
            <div style={styles.userInfo}>
              <p style={styles.userInfoText}>Logged in as: {user.name}</p>
              {user.email && <p style={styles.userInfoText}>Email: {user.email}</p>}
              <p style={styles.userInfoText}>
                Account Type: {user.isAnonymous ? 'Anonymous' : 'Registered'}
              </p>
            </div>
            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Made with 💚 for a greener planet
          </p>
          <p style={styles.versionText}>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: Colors.light.background,
    minHeight: '100vh',
  },
  header: {
    padding: '50px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: Colors.light.card,
    marginTop: '16px',
    margin: '16px 0 0 0',
  },
  headerSubtitle: {
    fontSize: '1rem',
    color: Colors.light.card,
    opacity: 0.9,
    marginTop: '4px',
    margin: '4px 0 0 0',
  },
  content: {
    padding: '20px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    marginLeft: '12px',
    margin: '0 0 0 12px',
  },
  sectionText: {
    fontSize: '1rem',
    color: Colors.light.text,
    lineHeight: '1.5',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  benefitsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
  },
  benefitIcon: {
    fontSize: '1.25rem',
    marginRight: '12px',
    width: '32px',
  },
  benefitText: {
    fontSize: '1rem',
    color: Colors.light.text,
    lineHeight: '1.5',
  },
  tipsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  tipItem: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  tipNumber: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: Colors.light.card,
    backgroundColor: Colors.light.primary,
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
    marginTop: '2px',
    flexShrink: 0,
  },
  tipText: {
    fontSize: '1rem',
    color: Colors.light.text,
    lineHeight: '1.5',
    margin: '0',
  },
  tipTitle: {
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  emissionsList: {
    backgroundColor: Colors.light.surface,
    padding: '16px',
    borderRadius: '12px',
    margin: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  emissionItem: {
    fontSize: '0.875rem',
    color: Colors.light.text,
    fontFamily: 'monospace',
    margin: '0',
  },
  contactSection: {
    backgroundColor: Colors.light.card,
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '32px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  contactTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: '16px',
    textAlign: 'center',
    margin: '0 0 16px 0',
  },
  contactButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 20px',
    borderRadius: '8px',
    border: `1px solid ${Colors.light.border}`,
    backgroundColor: 'transparent',
    marginBottom: '12px',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s',
  },
  contactButtonText: {
    fontSize: '1rem',
    color: Colors.light.primary,
    marginLeft: '8px',
    fontWeight: '600',
  },
  userSection: {
    backgroundColor: Colors.light.card,
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '32px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  userTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  userInfo: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  userInfoText: {
    fontSize: '0.875rem',
    color: Colors.light.muted,
    margin: '0',
  },
  logoutButton: {
    backgroundColor: Colors.light.error,
    color: Colors.light.card,
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
  },
  footerText: {
    fontSize: '1rem',
    color: Colors.light.muted,
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  versionText: {
    fontSize: '0.75rem',
    color: Colors.light.muted,
    margin: '0',
  },
};

export default About;

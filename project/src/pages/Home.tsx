import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Plus, BarChart3, Trophy, TrendingUp } from 'lucide-react';
import LinearGradient from '../components/LinearGradient';
import { useApp } from '../contexts/AppContext';
import Colors from '../constants/colors';
import { CommuteLog } from '../types';

const Home: React.FC = () => {
  const { user, commuteLogs, communityStats } = useApp();

  const userLogs = commuteLogs.filter((log: CommuteLog) => log.userId === user?.id);
  const userTotalCO2 = userLogs.reduce((sum: number, log: CommuteLog) => sum + log.co2Saved, 0);
  
  const thisWeekLogs = userLogs.filter((log: CommuteLog) => {
    const logDate = new Date(log.createdAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return logDate > weekAgo;
  });
  const thisWeekCO2 = thisWeekLogs.reduce((sum: number, log: CommuteLog) => sum + log.co2Saved, 0);

  const quickActions = [
    {
      title: 'Log New Trip',
      description: 'Record your latest commute',
      icon: Plus,
      link: '/log-commute',
      color: Colors.light.primary,
    },
    {
      title: 'View Impact',
      description: 'See your environmental impact',
      icon: BarChart3,
      link: '/dashboard',
      color: Colors.light.accent,
    },
    {
      title: 'Leaderboard',
      description: 'Check your ranking',
      icon: Trophy,
      link: '/leaderboard',
      color: Colors.light.warning,
    },
  ];

  return (
    <div style={styles.container}>
      {/* Welcome Section */}
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.secondary]}
        style={styles.welcomeSection}
      >
        <div style={styles.welcomeContent}>
          <Leaf size={40} color="white" />
          <h2 style={styles.welcomeTitle}>Welcome back, {user?.name}!</h2>
          <p style={styles.welcomeSubtitle}>Ready to make a green impact today?</p>
        </div>
      </LinearGradient>

      {/* Stats Overview */}
      <div style={styles.statsSection}>
        <h3 style={styles.sectionTitle}>Your Green Impact</h3>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <Leaf size={32} color={Colors.light.primary} />
            <div style={styles.statContent}>
              <span style={styles.statValue}>{userTotalCO2.toFixed(1)} kg</span>
              <span style={styles.statLabel}>Total CO₂ Saved</span>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <TrendingUp size={32} color={Colors.light.accent} />
            <div style={styles.statContent}>
              <span style={styles.statValue}>{thisWeekCO2.toFixed(1)} kg</span>
              <span style={styles.statLabel}>This Week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.actionsSection}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              style={styles.actionCard}
            >
              <action.icon size={24} color={action.color} />
              <div style={styles.actionContent}>
                <h4 style={styles.actionTitle}>{action.title}</h4>
                <p style={styles.actionDescription}>{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Community Stats */}
      <div style={styles.communitySection}>
        <h3 style={styles.sectionTitle}>Community Impact</h3>
        <div style={styles.communityCard}>
          <LinearGradient
            colors={[Colors.light.accent, Colors.light.primary]}
            style={styles.communityGradient}
          >
            <div style={styles.communityStats}>
              <div style={styles.communityStat}>
                <span style={styles.communityValue}>{communityStats?.totalUsers || 0}</span>
                <span style={styles.communityLabel}>Green Heroes</span>
              </div>
              
              <div style={styles.communityStat}>
                <span style={styles.communityValue}>
                  {(communityStats?.totalCO2Saved || 0).toFixed(1)} kg
                </span>
                <span style={styles.communityLabel}>CO₂ Saved Together</span>
              </div>
            </div>
          </LinearGradient>
        </div>
      </div>

      {/* Recent Activity */}
      {userLogs.length > 0 && (
        <div style={styles.recentSection}>
          <h3 style={styles.sectionTitle}>Recent Activity</h3>
          <div style={styles.recentList}>
            {userLogs.slice(-3).reverse().map((log: CommuteLog) => (
              <div key={log.id} style={styles.recentItem}>
                <div style={styles.recentDate}>
                  {new Date(log.createdAt).toLocaleDateString()}
                </div>
                <div style={styles.recentDetails}>
                  <span style={styles.recentModes}>
                    {log.modes.map((modeId: string) => {
                      const commuteConstants = require('../constants/commute');
                      const mode = commuteConstants.COMMUTE_MODES.find((m: any) => m.id === modeId);
                      return mode?.icon || '🚶';
                    }).join(' ')}
                  </span>
                  <span style={styles.recentCO2}>{log.co2Saved.toFixed(1)} kg CO₂ saved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '0',
    backgroundColor: Colors.light.background,
    minHeight: '100vh',
  },
  welcomeSection: {
    padding: '2rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    margin: '0.5rem 0 0 0',
  },
  welcomeSubtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.9)',
    margin: '0.5rem 0 0 0',
  },
  statsSection: {
    padding: '1.5rem 1rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: '1rem',
    margin: '0 0 1rem 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  statCard: {
    backgroundColor: Colors.light.card,
    padding: '1.5rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: '0.875rem',
    color: Colors.light.muted,
  },
  actionsSection: {
    padding: '1.5rem 1rem',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  actionCard: {
    backgroundColor: Colors.light.card,
    padding: '1.5rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    textDecoration: 'none',
    color: 'inherit',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  actionContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  actionTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    margin: '0 0 0.25rem 0',
  },
  actionDescription: {
    fontSize: '0.875rem',
    color: Colors.light.muted,
    margin: '0',
  },
  communitySection: {
    padding: '1.5rem 1rem',
  },
  communityCard: {
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  communityGradient: {
    padding: '1.5rem',
  },
  communityStats: {
    display: 'flex',
    justifyContent: 'space-around',
    textAlign: 'center',
  },
  communityStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  communityValue: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'white',
  },
  communityLabel: {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: '0.25rem',
  },
  recentSection: {
    padding: '1.5rem 1rem',
  },
  recentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  recentItem: {
    backgroundColor: Colors.light.card,
    padding: '1rem',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  recentDate: {
    fontSize: '0.875rem',
    color: Colors.light.muted,
  },
  recentDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  recentModes: {
    fontSize: '1rem',
  },
  recentCO2: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: Colors.light.primary,
  },
};

export default Home;

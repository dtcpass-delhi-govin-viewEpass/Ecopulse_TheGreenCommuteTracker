import React, { useState } from 'react';
import { Leaf, Users, TrendingUp, Calendar, Award, Settings, X } from 'lucide-react';
import LinearGradient from '../components/LinearGradient';
import { useApp } from '../contexts/AppContext';
import { COMMUTE_MODES } from '../constants/commute';
import Colors from '../constants/colors';
import { CommuteLog } from '../types';

const Dashboard: React.FC = () => {
  const { user, userSettings, communityStats, commuteLogs, updateSettings } = useApp();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState(userSettings.monthlyGoal.toString());

  const userLogs = commuteLogs.filter((log: CommuteLog) => log.userId === user?.id);
  const userTotalCO2 = userLogs.reduce((sum: number, log: CommuteLog) => sum + log.co2Saved, 0);
  
  const thisWeekLogs = userLogs.filter((log: CommuteLog) => {
    const logDate = new Date(log.createdAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return logDate > weekAgo;
  });
  const thisWeekCO2 = thisWeekLogs.reduce((sum: number, log: CommuteLog) => sum + log.co2Saved, 0);

  const thisMonthLogs = userLogs.filter((log: CommuteLog) => {
    const logDate = new Date(log.createdAt);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return logDate > monthAgo;
  });
  const thisMonthCO2 = thisMonthLogs.reduce((sum: number, log: CommuteLog) => sum + log.co2Saved, 0);

  // Calculate most used mode
  const modeUsage = userLogs.reduce((acc: Record<string, number>, log: CommuteLog) => {
    log.modes.forEach((mode: string) => {
      acc[mode] = (acc[mode] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const mostUsedModeId = Object.entries(modeUsage).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];
  const mostUsedMode = COMMUTE_MODES.find(mode => mode.id === mostUsedModeId);

  // Calculate streak
  const sortedLogs = userLogs
    .sort((a: CommuteLog, b: CommuteLog) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let currentStreak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const log of sortedLogs) {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === currentStreak) {
      currentStreak++;
    } else if (daysDiff === currentStreak + 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  return (
    <div style={styles.container}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.secondary]}
        style={styles.header}
      >
        <h2 style={styles.headerTitle}>Your Green Impact</h2>
        <p style={styles.headerSubtitle}>Making a difference, one trip at a time</p>
      </LinearGradient>

      <div style={styles.statsSection}>
        <h3 style={styles.sectionTitle}>Personal Stats</h3>
        
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <Leaf size={32} color={Colors.light.primary} />
            <span style={styles.statValue}>{userTotalCO2.toFixed(1)} kg</span>
            <span style={styles.statLabel}>Total CO₂ Saved</span>
          </div>
          
          <div style={styles.statCard}>
            <Calendar size={32} color={Colors.light.primary} />
            <span style={styles.statValue}>{userLogs.length}</span>
            <span style={styles.statLabel}>Total Trips</span>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <TrendingUp size={32} color={Colors.light.primary} />
            <span style={styles.statValue}>{thisWeekCO2.toFixed(1)} kg</span>
            <span style={styles.statLabel}>This Week</span>
          </div>
          
          <div style={styles.statCard}>
            <Award size={32} color={Colors.light.primary} />
            <span style={styles.statValue}>{currentStreak}</span>
            <span style={styles.statLabel}>Day Streak</span>
          </div>
        </div>
      </div>

      <div style={styles.insightsSection}>
        <h3 style={styles.sectionTitle}>Your Insights</h3>
        
        <div style={styles.insightCard}>
          <h4 style={styles.insightTitle}>Favorite Green Mode</h4>
          <div style={styles.insightContent}>
            <span style={styles.insightIcon}>{mostUsedMode?.icon || '🚶'}</span>
            <span style={styles.insightText}>
              {mostUsedMode?.label || 'Start logging to see your favorite mode!'}
            </span>
          </div>
        </div>

        <div style={styles.insightCard}>
          <div style={styles.insightHeader}>
            <h4 style={styles.insightTitle}>Monthly Progress</h4>
            <button 
              style={styles.settingsButton}
              onClick={() => {
                setGoalInput(userSettings.monthlyGoal.toString());
                setShowGoalModal(true);
              }}
            >
              <Settings size={16} color={Colors.light.primary} />
            </button>
          </div>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill, 
                width: `${Math.min((thisMonthCO2 / userSettings.monthlyGoal) * 100, 100)}%`
              }} 
            />
          </div>
          <p style={styles.progressText}>
            {thisMonthCO2.toFixed(1)} / {userSettings.monthlyGoal} kg CO₂ saved this month
          </p>
        </div>

        <div style={styles.insightCard}>
          <h4 style={styles.insightTitle}>Environmental Impact</h4>
          <p style={styles.impactText}>
            🌱 You've saved the equivalent of {Math.floor(userTotalCO2 * 2.5)} trees worth of CO₂!
          </p>
          <p style={styles.impactText}>
            ⚡ That's like taking a car off the road for {Math.floor(userTotalCO2 / 0.171)} km!
          </p>
        </div>
      </div>

      <div style={styles.communitySection}>
        <h3 style={styles.sectionTitle}>Community Impact</h3>
        
        <div style={styles.communityCard}>
          <LinearGradient
            colors={[Colors.light.accent, Colors.light.primary]}
            style={styles.communityGradient}
          >
            <div style={styles.communityStats}>
              <div style={styles.communityStat}>
                <Users size={24} color={Colors.light.card} />
                <span style={styles.communityValue}>{communityStats?.totalUsers || 0}</span>
                <span style={styles.communityLabel}>Green Heroes</span>
              </div>
              
              <div style={styles.communityStat}>
                <Leaf size={24} color={Colors.light.card} />
                <span style={styles.communityValue}>
                  {(communityStats?.totalCO2Saved || 0).toFixed(1)} kg
                </span>
                <span style={styles.communityLabel}>CO₂ Saved Together</span>
              </div>
            </div>
          </LinearGradient>
        </div>

        <div style={styles.achievementCard}>
          <h4 style={styles.achievementTitle}>🏆 Community Achievement</h4>
          <p style={styles.achievementText}>
            Together we've saved {(communityStats?.totalCO2Saved || 0).toFixed(1)} kg of CO₂!
          </p>
          <p style={styles.achievementSubtext}>
            That's equivalent to planting {Math.floor((communityStats?.totalCO2Saved || 0) * 2.5)} trees! 🌳
          </p>
        </div>
      </div>

      {/* Goal Setting Modal */}
      {showGoalModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Set Monthly Goal</h3>
              <button 
                onClick={() => setShowGoalModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.light.text} />
              </button>
            </div>
            
            <p style={styles.modalDescription}>
              Set your monthly CO₂ saving goal to track your progress
            </p>
            
            <div style={styles.inputContainer}>
              <input
                style={styles.goalInput}
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                type="number"
                placeholder="Enter goal in kg"
              />
              <span style={styles.inputSuffix}>kg CO₂</span>
            </div>
            
            <div style={styles.modalButtons}>
              <button 
                style={styles.cancelButton}
                onClick={() => setShowGoalModal(false)}
              >
                Cancel
              </button>
              
              <button 
                style={styles.saveButton}
                onClick={() => {
                  const goal = parseFloat(goalInput);
                  if (isNaN(goal) || goal <= 0) {
                    alert('Please enter a valid positive number');
                    return;
                  }
                  updateSettings({ monthlyGoal: goal });
                  setShowGoalModal(false);
                }}
              >
                Save Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: Colors.light.background,
    minHeight: '100vh',
  },
  header: {
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: Colors.light.card,
    margin: '0',
  },
  headerSubtitle: {
    fontSize: '1rem',
    color: Colors.light.card,
    opacity: 0.9,
    marginTop: '4px',
    margin: '4px 0 0 0',
  },
  statsSection: {
    padding: '20px',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
  },
  statCard: {
    backgroundColor: Colors.light.card,
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: '8px',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: Colors.light.muted,
    textAlign: 'center',
    marginTop: '4px',
  },
  insightsSection: {
    padding: '20px',
  },
  insightCard: {
    backgroundColor: Colors.light.card,
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  insightTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: '12px',
    margin: '0 0 12px 0',
  },
  insightContent: {
    display: 'flex',
    alignItems: 'center',
  },
  insightIcon: {
    fontSize: '2rem',
    marginRight: '12px',
  },
  insightText: {
    fontSize: '1rem',
    color: Colors.light.text,
  },
  insightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  settingsButton: {
    padding: '4px',
    borderRadius: '6px',
    backgroundColor: Colors.light.background,
    border: 'none',
    cursor: 'pointer',
  },
  progressBar: {
    height: '8px',
    backgroundColor: Colors.light.border,
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '0.875rem',
    color: Colors.light.muted,
    margin: '0',
  },
  impactText: {
    fontSize: '1rem',
    color: Colors.light.text,
    marginBottom: '8px',
    lineHeight: '1.5',
    margin: '0 0 8px 0',
  },
  communitySection: {
    padding: '20px',
  },
  communityCard: {
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  communityGradient: {
    padding: '20px',
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
    color: Colors.light.card,
    marginTop: '8px',
  },
  communityLabel: {
    fontSize: '0.75rem',
    color: Colors.light.card,
    textAlign: 'center',
    marginTop: '4px',
    opacity: 0.9,
  },
  achievementCard: {
    backgroundColor: Colors.light.card,
    padding: '20px',
    borderRadius: '12px',
    border: `2px solid ${Colors.light.warning}`,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  achievementTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  achievementText: {
    fontSize: '1rem',
    color: Colors.light.text,
    marginBottom: '8px',
    lineHeight: '1.5',
    margin: '0 0 8px 0',
  },
  achievementSubtext: {
    fontSize: '0.875rem',
    color: Colors.light.muted,
    lineHeight: '1.25',
    margin: '0',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: Colors.light.card,
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '400px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    margin: '0',
  },
  closeButton: {
    padding: '4px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },
  modalDescription: {
    fontSize: '1rem',
    color: Colors.light.muted,
    marginBottom: '20px',
    lineHeight: '1.375',
    margin: '0 0 20px 0',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${Colors.light.border}`,
    borderRadius: '8px',
    padding: '0 12px',
    marginBottom: '24px',
  },
  goalInput: {
    flex: 1,
    fontSize: '1rem',
    color: Colors.light.text,
    padding: '12px 0',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
  },
  inputSuffix: {
    fontSize: '1rem',
    color: Colors.light.muted,
    marginLeft: '8px',
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
  },
  cancelButton: {
    flex: 1,
    padding: '12px 20px',
    borderRadius: '8px',
    border: `1px solid ${Colors.light.border}`,
    backgroundColor: 'transparent',
    color: Colors.light.text,
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  saveButton: {
    flex: 1,
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: Colors.light.primary,
    color: Colors.light.card,
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default Dashboard;

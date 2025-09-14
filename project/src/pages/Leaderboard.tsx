import React, { useState, useMemo } from 'react';
import { Trophy, Medal, Award, Calendar, Clock, TrendingUp } from 'lucide-react';
import LinearGradient from '../components/LinearGradient';
import { useApp } from '../contexts/AppContext';
import { LeaderboardEntry, CommuteLog } from '../types';
import Colors from '../constants/colors';

type TimeFilter = 'all-time' | 'this-week' | 'today';

const Leaderboard: React.FC = () => {
  const { user, commuteLogs } = useApp();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all-time');

  const leaderboardData = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const filteredLogs = commuteLogs.filter((log: CommuteLog) => {
      const logDate = new Date(log.createdAt);
      switch (timeFilter) {
        case 'today':
          return logDate >= todayStart;
        case 'this-week':
          return logDate >= weekStart;
        default:
          return true;
      }
    });

    const userStats = filteredLogs.reduce((acc: Record<string, { userId: string; totalCO2Saved: number; tripCount: number }>, log: CommuteLog) => {
      if (!acc[log.userId]) {
        acc[log.userId] = {
          userId: log.userId,
          totalCO2Saved: 0,
          tripCount: 0,
        };
      }
      acc[log.userId].totalCO2Saved += log.co2Saved;
      acc[log.userId].tripCount += 1;
      return acc;
    }, {} as Record<string, { userId: string; totalCO2Saved: number; tripCount: number }>);

    const userStatsArray: { userId: string; totalCO2Saved: number; tripCount: number }[] = Object.values(userStats);
    
    const entries: LeaderboardEntry[] = userStatsArray
      .sort((a, b) => b.totalCO2Saved - a.totalCO2Saved)
      .slice(0, 50)
      .map((stat, index) => ({
        userId: stat.userId,
        userName: stat.userId === user?.id ? (user?.name || 'You') : `Green Champion ${stat.userId.slice(-4)}`,
        totalCO2Saved: stat.totalCO2Saved,
        rank: index + 1,
        isAnonymous: false, // Show all names now
      }));

    return entries;
  }, [commuteLogs, timeFilter, user]);

  const userRank = leaderboardData.find(entry => entry.userId === user?.id);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy size={24} color="#FFD700" />;
      case 2:
        return <Medal size={24} color="#C0C0C0" />;
      case 3:
        return <Award size={24} color="#CD7F32" />;
      default:
        return <span style={styles.rankNumber}>{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return styles.firstPlace;
      case 2:
        return styles.secondPlace;
      case 3:
        return styles.thirdPlace;
      default:
        return styles.regularPlace;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.secondary]}
        style={styles.header}
      >
        <Trophy size={48} color={Colors.light.card} />
        <h2 style={styles.headerTitle}>Green Champions</h2>
        <p style={styles.headerSubtitle}>Leading the way to a greener future</p>
      </LinearGradient>

      {/* Filter Section */}
      <div style={styles.filterSection}>
        <h3 style={styles.filterTitle}>Time Period</h3>
        <div style={styles.filterButtons}>
          {[
            { key: 'today' as TimeFilter, label: 'Today', icon: Clock },
            { key: 'this-week' as TimeFilter, label: 'This Week', icon: Calendar },
            { key: 'all-time' as TimeFilter, label: 'All Time', icon: TrendingUp },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              style={{
                ...styles.filterButton,
                ...(timeFilter === key ? styles.filterButtonActive : {}),
              }}
              onClick={() => setTimeFilter(key)}
            >
              <Icon 
                size={16} 
                color={timeFilter === key ? Colors.light.card : Colors.light.primary} 
              />
              <span
                style={{
                  ...styles.filterButtonText,
                  ...(timeFilter === key ? styles.filterButtonTextActive : {}),
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* User Rank Section */}
      {userRank && (
        <div style={styles.userRankSection}>
          <h3 style={styles.userRankTitle}>Your Ranking</h3>
          <div style={{ ...styles.userRankCard, ...getRankStyle(userRank.rank) }}>
            <div style={styles.userRankInfo}>
              {getRankIcon(userRank.rank)}
              <div style={styles.userRankDetails}>
                <span style={styles.userRankPosition}>#{userRank.rank}</span>
                <span style={styles.userRankCO2}>{userRank.totalCO2Saved.toFixed(1)} kg CO₂</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Section */}
      <div style={styles.leaderboardSection}>
        <h3 style={styles.leaderboardTitle}>Top Green Heroes</h3>
        {leaderboardData.map((item) => (
          <div key={item.userId} style={{ ...styles.leaderboardItem, ...getRankStyle(item.rank) }}>
            <div style={styles.rankContainer}>
              {getRankIcon(item.rank)}
            </div>
            
            <div style={styles.userInfo}>
              <span style={{ ...styles.userName, ...(item.userId === user?.id ? styles.currentUser : {}) }}>
                {item.userName}
                {item.userId === user?.id && ' (You)'}
              </span>
              <span style={styles.userStats}>
                {item.totalCO2Saved.toFixed(1)} kg CO₂ saved
              </span>
            </div>
            
            {item.rank <= 3 && (
              <div style={styles.badge}>
                <span style={styles.badgeText}>🌟</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {leaderboardData.length === 0 && (
        <div style={styles.emptyState}>
          <Trophy size={64} color={Colors.light.muted} />
          <h3 style={styles.emptyTitle}>No Data Yet</h3>
          <p style={styles.emptySubtitle}>
            Start logging your commutes to see the leaderboard!
          </p>
        </div>
      )}

      {/* Bottom padding for better scrolling */}
      <div style={styles.bottomPadding} />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: Colors.light.background,
    minHeight: '100vh',
  },
  bottomPadding: {
    height: '40px',
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
    marginTop: '12px',
    margin: '12px 0 0 0',
  },
  headerSubtitle: {
    fontSize: '1rem',
    color: Colors.light.card,
    opacity: 0.9,
    marginTop: '4px',
    margin: '4px 0 0 0',
  },
  filterSection: {
    padding: '20px',
    borderBottom: `1px solid ${Colors.light.border}`,
  },
  filterTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: '12px',
    margin: '0 0 12px 0',
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
  },
  filterButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: Colors.light.card,
    border: `1px solid ${Colors.light.border}`,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterButtonText: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: Colors.light.primary,
    marginLeft: '6px',
  },
  filterButtonTextActive: {
    color: Colors.light.card,
  },
  userRankSection: {
    padding: '20px',
    borderBottom: `1px solid ${Colors.light.border}`,
  },
  userRankTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: '12px',
    margin: '0 0 12px 0',
  },
  userRankCard: {
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: Colors.light.card,
  },
  userRankInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  userRankDetails: {
    marginLeft: '16px',
  },
  userRankPosition: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    display: 'block',
  },
  userRankCO2: {
    fontSize: '0.875rem',
    color: Colors.light.muted,
    marginTop: '2px',
    display: 'block',
  },
  leaderboardSection: {
    padding: '20px',
  },
  leaderboardTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  leaderboardItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    marginBottom: '8px',
    borderRadius: '12px',
    backgroundColor: Colors.light.card,
  },
  firstPlace: {
    backgroundColor: '#FFF9E6',
    border: '2px solid #FFD700',
  },
  secondPlace: {
    backgroundColor: '#F5F5F5',
    border: '2px solid #C0C0C0',
  },
  thirdPlace: {
    backgroundColor: '#FFF5E6',
    border: '2px solid #CD7F32',
  },
  regularPlace: {
    backgroundColor: Colors.light.card,
    border: `1px solid ${Colors.light.border}`,
  },
  rankContainer: {
    width: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  userInfo: {
    flex: 1,
    marginLeft: '16px',
  },
  userName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: Colors.light.text,
    display: 'block',
  },
  currentUser: {
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
  userStats: {
    fontSize: '0.875rem',
    color: Colors.light.muted,
    marginTop: '2px',
    display: 'block',
  },
  badge: {
    marginLeft: '8px',
  },
  badgeText: {
    fontSize: '1.25rem',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: '16px',
    margin: '16px 0 0 0',
  },
  emptySubtitle: {
    fontSize: '1rem',
    color: Colors.light.muted,
    marginTop: '8px',
    lineHeight: '1.5',
    margin: '8px 0 0 0',
  },
};

export default Leaderboard;

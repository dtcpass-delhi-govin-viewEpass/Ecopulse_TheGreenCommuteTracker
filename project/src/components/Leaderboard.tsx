import React, { useState, useMemo } from 'react';
import { Trophy, Medal, Award, Calendar, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { LeaderboardEntry, CommuteLog } from '@/types';
import Colors from '@/constants/colors';

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
    }, {});

    const userStatsArray = Object.values(userStats);

    const entries: LeaderboardEntry[] = userStatsArray
      .sort((a, b) => b.totalCO2Saved - a.totalCO2Saved)
      .slice(0, 50)
      .map((stat, index) => ({
        userId: stat.userId,
        userName: stat.userId === user?.id ? user?.name || 'You' : `Green Champion ${stat.userId.slice(-4)}`,
        totalCO2Saved: stat.totalCO2Saved,
        rank: index + 1,
        isAnonymous: false,
      }));

    return entries;
  }, [commuteLogs, timeFilter, user]);

  const userRank = leaderboardData.find((entry) => entry.userId === user?.id);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy size={24} color="#FFD700" />;
      case 2:
        return <Medal size={24} color="#C0C0C0" />;
      case 3:
        return <Award size={24} color="#CD7F32" />;
      default:
        return <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: Colors.light.text }}>{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return { backgroundColor: '#FFF9E6', border: '2px solid #FFD700' };
      case 2:
        return { backgroundColor: '#F5F5F5', border: '2px solid #C0C0C0' };
      case 3:
        return { backgroundColor: '#FFF5E6', border: '2px solid #CD7F32' };
      default:
        return { backgroundColor: 'white', border: `1px solid ${Colors.light.border}` };
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Trophy size={48} color={Colors.light.primary} style={{ marginBottom: '1rem' }} />
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: Colors.light.text,
          marginBottom: '0.5rem'
        }}>
          Green Champions
        </h1>
        <p style={{ color: Colors.light.muted, fontSize: '1.1rem' }}>
          Leading the way to a greener future
        </p>
      </div>

      {/* Filter Section */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ 
          fontSize: '1.1rem', 
          fontWeight: 'bold', 
          color: Colors.light.text,
          marginBottom: '1rem'
        }}>
          Time Period
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { key: 'today' as TimeFilter, label: 'Today', icon: Clock },
            { key: 'this-week' as TimeFilter, label: 'This Week', icon: Calendar },
            { key: 'all-time' as TimeFilter, label: 'All Time', icon: TrendingUp },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTimeFilter(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                border: `2px solid ${timeFilter === key ? Colors.light.primary : Colors.light.border}`,
                borderRadius: '8px',
                backgroundColor: timeFilter === key ? Colors.light.primary : 'white',
                color: timeFilter === key ? 'white' : Colors.light.text,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              <Icon size={16} style={{ marginRight: '0.5rem' }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* User Rank Section */}
      {userRank && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            color: Colors.light.text,
            marginBottom: '1rem'
          }}>
            Your Ranking
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            borderRadius: '8px',
            ...getRankStyle(userRank.rank)
          }}>
            <div style={{ marginRight: '1rem' }}>
              {getRankIcon(userRank.rank)}
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: Colors.light.text }}>
                #{userRank.rank}
              </div>
              <div style={{ fontSize: '0.9rem', color: Colors.light.muted }}>
                {userRank.totalCO2Saved.toFixed(1)} kg CO₂ saved
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="card">
        <h3 style={{ 
          fontSize: '1.2rem', 
          fontWeight: 'bold', 
          color: Colors.light.text,
          marginBottom: '1rem'
        }}>
          Top Green Heroes
        </h3>
        
        {leaderboardData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Trophy size={48} color={Colors.light.muted} style={{ marginBottom: '1rem' }} />
            <h4 style={{ color: Colors.light.text, marginBottom: '0.5rem' }}>No Data Yet</h4>
            <p style={{ color: Colors.light.muted }}>
              Start logging your commutes to see the leaderboard!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {leaderboardData.map((item) => (
              <div
                key={item.userId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  borderRadius: '8px',
                  transition: 'transform 0.2s',
                  ...getRankStyle(item.rank)
                }}
              >
                <div style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                  {getRankIcon(item.rank)}
                </div>

                <div style={{ flex: 1, marginLeft: '1rem' }}>
                  <div style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600', 
                    color: item.userId === user?.id ? Colors.light.primary : Colors.light.text
                  }}>
                    {item.userName}
                    {item.userId === user?.id && ' (You)'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: Colors.light.muted }}>
                    {item.totalCO2Saved.toFixed(1)} kg CO₂ saved
                  </div>
                </div>

                {item.rank <= 3 && (
                  <div style={{ fontSize: '1.2rem' }}>🌟</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
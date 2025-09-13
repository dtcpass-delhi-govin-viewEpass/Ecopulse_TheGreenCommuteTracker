import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Leaf, TrendingUp, Calendar, Award, Users } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { COMMUTE_MODES } from '@/constants/commute';
import Colors from '@/constants/colors';

const Dashboard: React.FC = () => {
  const { user, commuteLogs, communityStats, userSettings } = useApp();

  const userLogs = useMemo(() => 
    commuteLogs.filter(log => log.userId === user?.id), 
    [commuteLogs, user?.id]
  );

  const stats = useMemo(() => {
    const totalCO2 = userLogs.reduce((sum, log) => sum + log.co2Saved, 0);
    const totalDistance = userLogs.reduce((sum, log) => sum + log.distance, 0);
    
    const thisWeekLogs = userLogs.filter(log => {
      const logDate = new Date(log.createdAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return logDate > weekAgo;
    });
    const thisWeekCO2 = thisWeekLogs.reduce((sum, log) => sum + log.co2Saved, 0);

    const thisMonthLogs = userLogs.filter(log => {
      const logDate = new Date(log.createdAt);
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return logDate > monthAgo;
    });
    const thisMonthCO2 = thisMonthLogs.reduce((sum, log) => sum + log.co2Saved, 0);

    return {
      totalCO2,
      totalDistance,
      thisWeekCO2,
      thisMonthCO2,
      totalTrips: userLogs.length,
    };
  }, [userLogs]);

  const chartData = useMemo(() => {
    const modeStats = COMMUTE_MODES.map(mode => {
      const modeLogs = userLogs.filter(log => log.modes.includes(mode.id));
      const totalDistance = modeLogs.reduce((sum, log) => sum + log.distance, 0);
      const totalCO2 = modeLogs.reduce((sum, log) => sum + log.co2Saved, 0);
      
      return {
        name: mode.label,
        icon: mode.icon,
        distance: totalDistance,
        co2Saved: totalCO2,
        trips: modeLogs.length,
      };
    }).filter(item => item.distance > 0);

    return modeStats;
  }, [userLogs]);

  const pieData = useMemo(() => {
    return chartData.map((item, index) => ({
      ...item,
      color: [Colors.light.primary, Colors.light.secondary, Colors.light.accent, '#FF9800', '#9C27B0'][index % 5]
    }));
  }, [chartData]);

  const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; subtitle?: string }> = ({ 
    icon, title, value, subtitle 
  }) => (
    <div className="card" style={{ textAlign: 'center', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: Colors.light.text, marginBottom: '0.25rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.9rem', color: Colors.light.muted, fontWeight: '600' }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.8rem', color: Colors.light.muted, marginTop: '0.25rem' }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: Colors.light.text,
          marginBottom: '0.5rem'
        }}>
          Your Green Impact Dashboard
        </h1>
        <p style={{ color: Colors.light.muted, fontSize: '1.1rem' }}>
          Track your sustainable commuting journey
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          icon={<Leaf size={32} color={Colors.light.primary} />}
          title="Total CO₂ Saved"
          value={`${stats.totalCO2.toFixed(1)} kg`}
        />
        <StatCard
          icon={<Calendar size={32} color={Colors.light.primary} />}
          title="Total Trips"
          value={stats.totalTrips.toString()}
          subtitle={`${stats.totalDistance.toFixed(1)} km total`}
        />
        <StatCard
          icon={<TrendingUp size={32} color={Colors.light.primary} />}
          title="This Week"
          value={`${stats.thisWeekCO2.toFixed(1)} kg`}
          subtitle="CO₂ saved"
        />
        <StatCard
          icon={<Award size={32} color={Colors.light.primary} />}
          title="Monthly Progress"
          value={`${((stats.thisMonthCO2 / userSettings.monthlyGoal) * 100).toFixed(0)}%`}
          subtitle={`${stats.thisMonthCO2.toFixed(1)}/${userSettings.monthlyGoal} kg goal`}
        />
      </div>

      {/* Charts Section */}
      {chartData.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Distance by Mode Chart */}
          <div className="card">
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: Colors.light.text,
              marginBottom: '1rem'
            }}>
              Distance by Transportation Mode
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)} km`, 'Distance']}
                  labelStyle={{ color: Colors.light.text }}
                />
                <Bar dataKey="distance" fill={Colors.light.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* CO2 Savings Pie Chart */}
          <div className="card">
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: Colors.light.text,
              marginBottom: '1rem'
            }}>
              CO₂ Savings by Mode
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="co2Saved"
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}kg`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toFixed(2)} kg`, 'CO₂ Saved']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Community Stats */}
      {communityStats && (
        <div className="card">
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: Colors.light.text,
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Users size={24} style={{ marginRight: '0.5rem' }} />
            Community Impact
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: Colors.light.primary }}>
                {communityStats.totalUsers}
              </div>
              <div style={{ fontSize: '0.9rem', color: Colors.light.muted }}>Green Heroes</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: Colors.light.primary }}>
                {communityStats.totalCO2Saved.toFixed(1)} kg
              </div>
              <div style={{ fontSize: '0.9rem', color: Colors.light.muted }}>Total CO₂ Saved</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: Colors.light.primary }}>
                {communityStats.totalCommutes}
              </div>
              <div style={{ fontSize: '0.9rem', color: Colors.light.muted }}>Total Trips</div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {userLogs.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Leaf size={64} color={Colors.light.muted} style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', color: Colors.light.text, marginBottom: '0.5rem' }}>
            Start Your Green Journey
          </h3>
          <p style={{ color: Colors.light.muted, fontSize: '1.1rem' }}>
            Log your first commute to see your environmental impact!
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
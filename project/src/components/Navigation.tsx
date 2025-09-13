import React from 'react';
import { Home, Plus, BarChart3, Trophy, LogOut } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useApp();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'log', label: 'Log Commute', icon: Plus },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: `1px solid ${Colors.light.border}`,
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 1rem'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🌱</span>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: Colors.light.primary,
            margin: 0
          }}>
            EcoPulse
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: activeTab === id ? Colors.light.primary : 'transparent',
                color: activeTab === id ? 'white' : Colors.light.text,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              <Icon size={18} style={{ marginRight: '0.5rem' }} />
              <span className="nav-label">{label}</span>
            </button>
          ))}
        </div>

        {/* User Info & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: Colors.light.muted, fontSize: '0.9rem' }}>
            Welcome, {user?.name}
          </span>
          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              border: `1px solid ${Colors.light.border}`,
              borderRadius: '6px',
              backgroundColor: 'white',
              color: Colors.light.muted,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-label {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
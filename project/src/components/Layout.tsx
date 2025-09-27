import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Plus, BarChart3, Trophy, Info, LogOut } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

const Layout: React.FC = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/log-commute', icon: Plus, label: 'Log Trip' },
    { path: '/dashboard', icon: BarChart3, label: 'Impact' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/about', icon: Info, label: 'About' },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>EcoPulse</h1>
          <div style={styles.headerActions}>
            <span style={styles.userName}>Welcome, {user.name}!</span>
            <button style={styles.logoutButton} onClick={handleLogout}>
              <LogOut size={20} color={Colors.light.card} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav style={styles.bottomNav}>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <Icon size={24} color={Colors.light.primary} />
            <span style={styles.navLabel}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.primary,
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  headerTitle: {
    color: Colors.light.card,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    color: Colors.light.card,
    fontSize: '0.9rem',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  main: {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    paddingBottom: '80px', // Space for bottom nav
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.card,
    borderTop: `1px solid ${Colors.light.border}`,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0.5rem 0',
    zIndex: 1000,
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    color: Colors.light.tabIconDefault,
    padding: '0.5rem',
    borderRadius: '0.5rem',
    transition: 'color 0.2s',
    minWidth: '60px',
  },
  navItemActive: {
    color: Colors.light.primary,
  },
  navLabel: {
    fontSize: '0.75rem',
    marginTop: '0.25rem',
    fontWeight: '600',
  },
};

export default Layout;

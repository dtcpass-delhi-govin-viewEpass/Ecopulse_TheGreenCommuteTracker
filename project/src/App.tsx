import React, { useState } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import AuthForm from '@/components/AuthForm';
import Navigation from '@/components/Navigation';
import CommuteForm from '@/components/CommuteForm';
import Dashboard from '@/components/Dashboard';
import Leaderboard from '@/components/Leaderboard';
import { Leaf } from 'lucide-react';
import Colors from '@/constants/colors';

const AppContent: React.FC = () => {
  const { user, isLoading } = useApp();
  const [activeTab, setActiveTab] = useState('home');

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0f7e9 0%, #f0fff4 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Leaf size={48} color={Colors.light.primary} style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '1.2rem', color: Colors.light.text }}>Loading EcoPulse...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'log':
        return <CommuteForm />;
      case 'dashboard':
        return <Dashboard />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return (
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: Colors.light.text,
              marginBottom: '1rem'
            }}>
              Welcome to EcoPulse
            </h1>
            <p style={{ 
              fontSize: '1.2rem', 
              color: Colors.light.muted,
              marginBottom: '2rem',
              lineHeight: 1.6
            }}>
              Track your sustainable commuting journey, reduce your carbon footprint, 
              and compete with others in making our planet greener!
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginTop: '3rem'
            }}>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
                <h3 style={{ color: Colors.light.text, marginBottom: '0.5rem' }}>Track Your Impact</h3>
                <p style={{ color: Colors.light.muted, fontSize: '0.9rem' }}>
                  Log your daily commutes and see how much CO₂ you're saving
                </p>
              </div>
              
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏆</div>
                <h3 style={{ color: Colors.light.text, marginBottom: '0.5rem' }}>Compete & Win</h3>
                <p style={{ color: Colors.light.muted, fontSize: '0.9rem' }}>
                  Join the leaderboard and compete with other green champions
                </p>
              </div>
              
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌍</div>
                <h3 style={{ color: Colors.light.text, marginBottom: '0.5rem' }}>Make a Difference</h3>
                <p style={{ color: Colors.light.muted, fontSize: '0.9rem' }}>
                  Every sustainable trip contributes to a healthier planet
                </p>
              </div>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <button
                onClick={() => setActiveTab('log')}
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  backgroundColor: Colors.light.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(45, 90, 65, 0.3)'
                }}
              >
                Start Logging Your Commutes
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fffe' }}>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {renderContent()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
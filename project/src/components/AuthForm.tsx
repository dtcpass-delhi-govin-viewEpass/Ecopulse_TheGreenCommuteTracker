import React, { useState } from 'react';
import { User, Mail, UserPlus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

const AuthForm: React.FC = () => {
  const { register, isRegistering } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    register({ name: name.trim(), email: email.trim() });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0f7e9 0%, #f0fff4 100%)',
      padding: '1rem'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #2d5a41, #5a8a6b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🌱
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: Colors.light.text,
            marginBottom: '0.5rem'
          }}>
            Welcome to EcoPulse
          </h1>
          <p style={{ color: Colors.light.muted, fontSize: '1.1rem' }}>
            Start tracking your green commute journey
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '0.5rem',
              color: Colors.light.text,
              fontWeight: '600'
            }}>
              <User size={18} style={{ marginRight: '0.5rem' }} />
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              style={{ width: '100%' }}
              required
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '0.5rem',
              color: Colors.light.text,
              fontWeight: '600'
            }}>
              <Mail size={18} style={{ marginRight: '0.5rem' }} />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              style={{ width: '100%' }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isRegistering}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              backgroundColor: Colors.light.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isRegistering ? 'not-allowed' : 'pointer',
              opacity: isRegistering ? 0.6 : 1,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <UserPlus size={18} style={{ marginRight: '0.5rem' }} />
            {isRegistering ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#e8f5e8',
          borderRadius: '8px',
          border: `1px solid ${Colors.light.accent}`
        }}>
          <h4 style={{ color: Colors.light.text, marginBottom: '0.5rem', fontSize: '1rem' }}>
            🌍 Join the Green Movement
          </h4>
          <p style={{ color: Colors.light.muted, fontSize: '0.9rem', margin: 0 }}>
            Track your sustainable commutes, reduce your carbon footprint, and compete with others in making our planet greener!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
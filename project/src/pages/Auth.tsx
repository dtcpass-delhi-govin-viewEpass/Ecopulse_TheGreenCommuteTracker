import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, User, Mail, Calendar, Briefcase } from 'lucide-react';
import LinearGradient from '../components/LinearGradient';
import { useApp } from '../contexts/AppContext';
import Colors from '../constants/colors';

type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';

const Auth: React.FC = () => {
  const { register, isRegistering } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '' as Gender | '',
    profession: '',
  });
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleRegister = () => {
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!isAnonymous && !formData.email.trim()) {
      alert('Please enter your email or choose anonymous login');
      return;
    }

    const userData = {
      name: formData.name.trim(),
      email: isAnonymous ? undefined : formData.email.trim(),
      age: formData.age ? parseInt(formData.age) : undefined,
      gender: formData.gender || undefined,
      profession: formData.profession.trim() || undefined,
      isAnonymous,
    };

    register(userData);
    navigate('/');
  };

  const handleAnonymousLogin = () => {
    setIsAnonymous(true);
    setFormData(prev => ({ ...prev, email: '', age: '', gender: '', profession: '' }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.scrollContent}>
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.secondary]}
          style={styles.header}
        >
          <div style={styles.headerContent}>
            <Leaf size={48} color="white" />
            <h1 style={styles.title}>EcoPulse</h1>
            <p style={styles.subtitle}>Smart Green Commute Tracker</p>
          </div>
        </LinearGradient>

        <div style={styles.form}>
          <h2 style={styles.formTitle}>
            {isAnonymous ? 'Quick Anonymous Start' : 'Create Your Profile'}
          </h2>

          <div style={styles.inputGroup}>
            <User size={20} color={Colors.light.primary} style={styles.inputIcon} />
            <input
              style={styles.input}
              placeholder="Full Name *"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          {!isAnonymous && (
            <>
              <div style={styles.inputGroup}>
                <Mail size={20} color={Colors.light.primary} style={styles.inputIcon} />
                <input
                  style={styles.input}
                  placeholder="Email Address *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div style={styles.inputGroup}>
                <Calendar size={20} color={Colors.light.primary} style={styles.inputIcon} />
                <input
                  style={styles.input}
                  placeholder="Age (optional)"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>

              <div style={styles.inputGroup}>
                <User size={20} color={Colors.light.primary} style={styles.inputIcon} />
                <div style={styles.pickerContainer}>
                  <label style={styles.pickerLabel}>Gender (optional)</label>
                  <div style={styles.genderOptions}>
                    {(['male', 'female', 'other', 'prefer-not-to-say'] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        style={{
                          ...styles.genderOption,
                          ...(formData.gender === option ? styles.genderOptionSelected : {}),
                        }}
                        onClick={() => setFormData(prev => ({ ...prev, gender: option }))}
                      >
                        <span style={{
                          ...styles.genderOptionText,
                          ...(formData.gender === option ? styles.genderOptionTextSelected : {}),
                        }}>
                          {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <Briefcase size={20} color={Colors.light.primary} style={styles.inputIcon} />
                <input
                  style={styles.input}
                  placeholder="Profession (optional)"
                  value={formData.profession}
                  onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                />
              </div>
            </>
          )}

          <button
            style={{
              ...styles.button,
              ...styles.primaryButton,
              ...(isRegistering ? styles.buttonDisabled : {}),
            }}
            onClick={handleRegister}
            disabled={isRegistering}
          >
            {isRegistering ? 'Creating Profile...' : 'Get Started'}
          </button>

          {!isAnonymous && (
            <button
              style={{
                ...styles.button,
                ...styles.secondaryButton,
              }}
              onClick={handleAnonymousLogin}
            >
              Continue Anonymously
            </button>
          )}

          {isAnonymous && (
            <button
              style={{
                ...styles.button,
                ...styles.secondaryButton,
              }}
              onClick={() => {
                setIsAnonymous(false);
                setFormData({
                  name: formData.name,
                  email: '',
                  age: '',
                  gender: '',
                  profession: '',
                });
              }}
            >
              Create Full Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    paddingTop: '60px',
    paddingBottom: '40px',
    paddingLeft: '20px',
    paddingRight: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white',
    marginTop: '16px',
    margin: '16px 0 0 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: '8px',
    textAlign: 'center',
    margin: '8px 0 0 0',
  },
  form: {
    flex: 1,
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto',
    width: '100%',
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: '24px',
    textAlign: 'center',
    margin: '0 0 24px 0',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '4px 16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  inputIcon: {
    marginRight: '12px',
  },
  input: {
    flex: 1,
    fontSize: '1rem',
    color: Colors.light.text,
    padding: '16px 0',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
  },
  pickerContainer: {
    flex: 1,
    padding: '8px 0',
  },
  pickerLabel: {
    fontSize: '1rem',
    color: Colors.light.muted,
    marginBottom: '8px',
    display: 'block',
  },
  genderOptions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  genderOption: {
    padding: '6px 12px',
    borderRadius: '16px',
    backgroundColor: Colors.light.background,
    border: `1px solid ${Colors.light.border}`,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  genderOptionSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  genderOptionText: {
    fontSize: '0.75rem',
    color: Colors.light.text,
  },
  genderOptionTextSelected: {
    color: 'white',
  },
  button: {
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    border: `2px solid ${Colors.light.primary}`,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
};

export default Auth;

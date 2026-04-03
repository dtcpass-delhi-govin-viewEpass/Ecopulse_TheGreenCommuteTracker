import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, User, Mail, Calendar, Briefcase, Sprout } from 'lucide-react';
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

  const handleRegister = async () => {
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

    try {
      await register(userData);
      navigate('/');
    } catch (err: any) {
      console.error('Registration failed', err);
      alert(`Registration failed: ${err?.message || err}. Please try again.`);
    }
  };

  const handleAnonymousLogin = () => {
    setIsAnonymous(true);
    setFormData(prev => ({ ...prev, email: '', age: '', gender: '', profession: '' }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.scrollContent}>
        <div style={styles.header}>
          <div style={styles.headerContent}>              
            <h1 style={styles.title}>Welcome to EcoPulse <Leaf size={38} color="white" style={{ position: "relative", top: "5px" }} /></h1>
            <p style={styles.subtitle}>Smart Green Commute Tracker <Sprout size={28} color="white" style={{ position: "relative", top: "5px" }} /></p>
          </div>
        </div>

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
            {isRegistering ? 'Creating Profile...' : 'Start Tracking > > '}
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

          <div style={styles.signInContainer}>
            <span style={styles.signInText}>
              Already have an account?{' '}
              <span 
                style={styles.signInLink}
                onClick={() => alert('Sign in functionality will be available soon!')}
              >
                Sign In
              </span>
            </span>
          </div>
        </div>

        <LinearGradient
          colors={[Colors.light.primary, Colors.light.secondary]}
          style={styles.footer}
        >
          <div style={styles.footerContent}>
            <h2 style={styles.footerTitle}>
              Your commute data helps measure community carbon reduction 🌍
            </h2>
          </div>
        </LinearGradient>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: Colors.light.background,
    backgroundImage: `linear-gradient(rgba(106, 236, 104, 0.9), rgba(219, 246, 210, 0.9)), url('https://png.pngtree.com/thumb_back/fw800/background/20231105/pngtree-natural-green-leaves-pattern-a-refreshing-background-and-wallpaper-image_13753535.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  scrollContent: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    paddingTop: '10px',
    paddingBottom: '20px',
    paddingLeft: '20px',
    paddingRight: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${Colors.light.primary}, ${Colors.light.secondary})`,
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '2.5rem',
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
    borderColor: Colors.light.border,
    borderWidth: '2px',
    borderStyle: 'solid',
    boxShadow: `1px 3px 6px ${Colors.light.shadow}`,
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
    backgroundColor: 'rgba(213, 235, 215, 0.9)',
    border: `3px solid ${Colors.light.primary}`,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  signInContainer: {
    textAlign: 'center',
    marginTop: '20px',
    marginBottom: '20px',
  },
  signInText: {
    fontSize: '1rem',
    color: Colors.light.muted,
  },
  signInLink: {
    color: Colors.light.primary,
    fontWeight: 'bold',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  footer: {
    padding: '20px',
  },
  footerContent: {
    textAlign: 'center',
  },
  footerTitle: {
    fontSize: '1.25rem',
    fontWeight: 'semi-bold',
    color: 'white',
    margin: 0,
  },
};

export default Auth;
function rgba(arg0: number, arg1: number, arg2: number, arg3: number): import("csstype").Property.BackgroundColor | undefined {
  throw new Error('Function not implemented.');
}

function gradient(circle: any, at: any, top: Window | null, arg3: string | (string & {}) | undefined, transparent: any, arg5: number) {
  throw new Error('Function not implemented.');
}


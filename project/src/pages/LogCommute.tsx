import React, { useState } from 'react';
import { Check, Clock, MapPin, Calendar } from 'lucide-react';
import LinearGradient from '../components/LinearGradient';
import { useApp } from '../contexts/AppContext';
import { COMMUTE_MODES, DISTANCE_RANGES, FREQUENCY_OPTIONS, calculateCO2Savings } from '../constants/commute';
import Colors from '../constants/colors';
import { useNavigate } from 'react-router-dom';

const LogCommute: React.FC = () => {
  const { user, addCommuteLog, isAddingLog } = useApp();
  const navigate = useNavigate();
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = useState('');
  const [commuteTime, setCommuteTime] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('');

  const toggleMode = (modeId: string) => {
    setSelectedModes(prev => 
      prev.includes(modeId) 
        ? prev.filter(id => id !== modeId)
        : [...prev, modeId]
    );
  };

  const handleSubmit = () => {
    if (!user) {
      alert('Please register first');
      navigate('/auth');
      return;
    }

    if (selectedModes.length === 0) {
      alert('Please select at least one commute mode');
      return;
    }

    if (!selectedDistance) {
      alert('Please select your commute distance');
      return;
    }

    if (!commuteTime.trim()) {
      alert('Please enter your commute time');
      return;
    }

    if (!selectedFrequency) {
      alert('Please select how often you commute');
      return;
    }

    const time = parseInt(commuteTime);
    if (isNaN(time) || time <= 0) {
      alert('Please enter a valid commute time in minutes');
      return;
    }

    const co2Saved = calculateCO2Savings(selectedModes, selectedDistance, selectedFrequency);

    const logData = {
      modes: selectedModes,
      distanceRange: selectedDistance,
      commuteTime: time,
      frequency: selectedFrequency,
      co2Saved,
      date: new Date().toISOString().split('T')[0],
    };

    addCommuteLog(logData);

    const result = confirm(
      `Great Job! You saved ${co2Saved.toFixed(1)} kg of CO₂! Keep up the green commuting!\n\nWould you like to view your impact?`
    );
    
    if (result) {
      navigate('/dashboard');
    } else {
      setSelectedModes([]);
      setSelectedDistance('');
      setCommuteTime('');
      setSelectedFrequency('');
    }
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.secondary]}
          style={styles.authPrompt}
        >
          <h2 style={styles.authTitle}>Join EcoPulse</h2>
          <p style={styles.authSubtitle}>
            Register to start logging your green commute
          </p>
          <button
            style={styles.authButton}
            onClick={() => navigate('/auth')}
          >
            Get Started
          </button>
        </LinearGradient>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <MapPin size={20} color={Colors.light.primary} style={styles.titleIcon} /> Commute Mode
        </h3>
        <p style={styles.sectionSubtitle}>Select all modes you used (you can pick multiple)</p>
        
        <div style={styles.modesGrid}>
          {COMMUTE_MODES.map((mode) => (
            <button
              key={mode.id}
              style={{
                ...styles.modeCard,
                ...(selectedModes.includes(mode.id) ? styles.modeCardSelected : {}),
              }}
              onClick={() => toggleMode(mode.id)}
            >
              {selectedModes.includes(mode.id) && (
                <div style={styles.checkmark}>
                  <Check size={16} color={Colors.light.card} />
                </div>
              )}
              <span style={styles.modeIcon}>{mode.icon}</span>
              <span
                style={{
                  ...styles.modeLabel,
                  ...(selectedModes.includes(mode.id) ? styles.modeLabelSelected : {}),
                }}
              >
                {mode.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <MapPin size={20} color={Colors.light.primary} style={styles.titleIcon} /> Distance Range
        </h3>
        <p style={styles.sectionSubtitle}>How far is your one-way commute?</p>
        
        <div style={styles.optionsGrid}>
          {DISTANCE_RANGES.map((range) => (
            <button
              key={range.id}
              style={{
                ...styles.optionCard,
                ...(selectedDistance === range.id ? styles.optionCardSelected : {}),
              }}
              onClick={() => setSelectedDistance(range.id)}
            >
              <span
                style={{
                  ...styles.optionText,
                  ...(selectedDistance === range.id ? styles.optionTextSelected : {}),
                }}
              >
                {range.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <Clock size={20} color={Colors.light.primary} style={styles.titleIcon} /> Commute Time
        </h3>
        <p style={styles.sectionSubtitle}>How long does your one-way trip take?</p>
        
        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            placeholder="Enter time in minutes"
            value={commuteTime}
            onChange={(e) => setCommuteTime(e.target.value)}
            type="number"
          />
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <Calendar size={20} color={Colors.light.primary} style={styles.titleIcon} /> Frequency
        </h3>
        <p style={styles.sectionSubtitle}>How often do you make this commute?</p>
        
        <div style={styles.optionsGrid}>
          {FREQUENCY_OPTIONS.map((freq) => (
            <button
              key={freq.id}
              style={{
                ...styles.optionCard,
                ...(selectedFrequency === freq.id ? styles.optionCardSelected : {}),
              }}
              onClick={() => setSelectedFrequency(freq.id)}
            >
              <span
                style={{
                  ...styles.optionText,
                  ...(selectedFrequency === freq.id ? styles.optionTextSelected : {}),
                }}
              >
                {freq.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={styles.submitSection}>
        <button
          style={{
            ...styles.submitButton,
            ...(isAddingLog ? styles.submitButtonDisabled : {}),
          }}
          onClick={handleSubmit}
          disabled={isAddingLog}
        >
          {isAddingLog ? 'Calculating Impact...' : 'Log My Commute'}
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '0',
    backgroundColor: Colors.light.background,
    minHeight: '100vh',
  },
  authPrompt: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  authTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: Colors.light.card,
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  authSubtitle: {
    fontSize: '1rem',
    color: Colors.light.card,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: '24px',
    margin: '0 0 24px 0',
  },
  authButton: {
    backgroundColor: Colors.light.card,
    color: Colors.light.primary,
    padding: '16px 32px',
    borderRadius: '25px',
    border: 'none',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  section: {
    padding: '20px',
    borderBottom: `1px solid ${Colors.light.border}`,
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    margin: '0 0 8px 0',
  },
  titleIcon: {
    marginRight: '8px',
  },
  sectionSubtitle: {
    fontSize: '0.875rem',
    color: Colors.light.muted,
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  modesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  modeCard: {
    backgroundColor: Colors.light.card,
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: `2px solid ${Colors.light.border}`,
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  modeCardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  checkmark: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: Colors.light.success,
    borderRadius: '12px',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIcon: {
    fontSize: '1.5rem',
    marginBottom: '8px',
  },
  modeLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  modeLabelSelected: {
    color: Colors.light.card,
  },
  optionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  optionCard: {
    backgroundColor: Colors.light.card,
    padding: '16px',
    borderRadius: '12px',
    border: `2px solid ${Colors.light.border}`,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  optionCardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  optionText: {
    fontSize: '1rem',
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: Colors.light.card,
  },
  inputContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: '12px',
    border: `1px solid ${Colors.light.border}`,
  },
  input: {
    padding: '16px',
    fontSize: '1rem',
    color: Colors.light.text,
    border: 'none',
    borderRadius: '12px',
    width: '100%',
    outline: 'none',
    backgroundColor: 'transparent',
  },
  submitSection: {
    padding: '20px',
    paddingBottom: '40px',
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    color: Colors.light.card,
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s',
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
};

export default LogCommute;

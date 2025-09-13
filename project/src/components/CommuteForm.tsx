import React, { useState } from 'react';
import { Plus, MapPin, Calendar } from 'lucide-react';
import { COMMUTE_MODES, CO2_FACTORS } from '@/constants/commute';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

const CommuteForm: React.FC = () => {
  const { addCommuteLog, isAddingLog } = useApp();
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [distance, setDistance] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleModeToggle = (modeId: string) => {
    setSelectedModes(prev => 
      prev.includes(modeId) 
        ? prev.filter(id => id !== modeId)
        : [...prev, modeId]
    );
  };

  const calculateCO2Saved = (modes: string[], distance: number) => {
    if (modes.length === 0) return 0;
    
    // Calculate average CO2 factor for selected modes
    const avgCO2Factor = modes.reduce((sum, mode) => {
      return sum + (CO2_FACTORS[mode as keyof typeof CO2_FACTORS] || 0);
    }, 0) / modes.length;
    
    // Compare with regular car emissions (0.171 kg CO2 per km)
    const carEmissions = distance * CO2_FACTORS.car;
    const greenEmissions = distance * avgCO2Factor;
    
    return Math.max(0, carEmissions - greenEmissions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedModes.length === 0 || !distance || !date) {
      alert('Please fill in all fields and select at least one commute mode');
      return;
    }

    const distanceNum = parseFloat(distance);
    if (isNaN(distanceNum) || distanceNum <= 0) {
      alert('Please enter a valid distance');
      return;
    }

    const co2Saved = calculateCO2Saved(selectedModes, distanceNum);

    addCommuteLog({
      date,
      modes: selectedModes,
      distance: distanceNum,
      co2Saved,
    });

    // Reset form
    setSelectedModes([]);
    setDistance('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const estimatedCO2 = distance ? calculateCO2Saved(selectedModes, parseFloat(distance) || 0) : 0;

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Plus size={24} color={Colors.light.primary} style={{ marginRight: '0.5rem' }} />
        <h2 style={{ color: Colors.light.text, fontSize: '1.5rem', fontWeight: 'bold' }}>
          Log Your Green Commute
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Date Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '0.5rem',
            color: Colors.light.text,
            fontWeight: '600'
          }}>
            <Calendar size={18} style={{ marginRight: '0.5rem' }} />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </div>

        {/* Distance Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '0.5rem',
            color: Colors.light.text,
            fontWeight: '600'
          }}>
            <MapPin size={18} style={{ marginRight: '0.5rem' }} />
            Distance (km)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Enter distance in kilometers"
            style={{ width: '100%' }}
            required
          />
        </div>

        {/* Commute Mode Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '0.5rem',
            color: Colors.light.text,
            fontWeight: '600'
          }}>
            Transportation Mode(s)
          </label>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem'
          }}>
            {COMMUTE_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleModeToggle(mode.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  border: `2px solid ${selectedModes.includes(mode.id) ? Colors.light.primary : Colors.light.border}`,
                  borderRadius: '8px',
                  backgroundColor: selectedModes.includes(mode.id) ? Colors.light.primary : 'white',
                  color: selectedModes.includes(mode.id) ? 'white' : Colors.light.text,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>
                  {mode.icon}
                </span>
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* CO2 Estimation */}
        {estimatedCO2 > 0 && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#e8f5e8',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: `1px solid ${Colors.light.accent}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>🌱</span>
              <span style={{ fontWeight: '600', color: Colors.light.text }}>
                Environmental Impact
              </span>
            </div>
            <p style={{ color: Colors.light.text, margin: 0 }}>
              You'll save approximately <strong>{estimatedCO2.toFixed(2)} kg</strong> of CO₂ 
              compared to driving a regular car!
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isAddingLog || selectedModes.length === 0 || !distance || !date}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            fontWeight: '600',
            backgroundColor: Colors.light.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isAddingLog ? 'not-allowed' : 'pointer',
            opacity: isAddingLog || selectedModes.length === 0 || !distance || !date ? 0.6 : 1,
            transition: 'all 0.2s'
          }}
        >
          {isAddingLog ? 'Adding...' : 'Log Commute'}
        </button>
      </form>
    </div>
  );
};

export default CommuteForm;
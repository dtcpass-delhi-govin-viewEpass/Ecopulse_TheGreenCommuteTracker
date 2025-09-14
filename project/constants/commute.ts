export const COMMUTE_MODES = [
  { id: 'walking', label: 'Walking', icon: 'footprints', co2Factor: 0 },
  { id: 'biking', label: 'Biking', icon: 'bike', co2Factor: 0 },
  { id: 'public-bus', label: 'Public Bus', icon: 'bus', co2Factor: 0.089 },
  { id: 'metro', label: 'Metro/Train', icon: 'train', co2Factor: 0.041 },
  { id: 'car', label: 'Car (Petrol)', icon: 'car', co2Factor: 0.171 },
  { id: 'ev', label: 'Electric Vehicle', icon: 'zap', co2Factor: 0.053 },
  { id: 'motorcycle', label: 'Motorcycle', icon: 'bike', co2Factor: 0.113 },
  { id: 'carpool', label: 'Carpool', icon: 'users', co2Factor: 0.085 },
] as const;

export const DISTANCE_RANGES = [
  { id: '<2km', label: 'Less than 2km', avgKm: 1 },
  { id: '2-5km', label: '2-5km', avgKm: 3.5 },
  { id: '5-10km', label: '5-10km', avgKm: 7.5 },
  { id: '10-20km', label: '10-20km', avgKm: 15 },
  { id: '20-50km', label: '20-50km', avgKm: 35 },
  { id: '>50km', label: 'More than 50km', avgKm: 75 },
] as const;

export const FREQUENCY_OPTIONS = [
  { id: '1-2', label: '1-2 days per week', multiplier: 1.5 },
  { id: '3-4', label: '3-4 days per week', multiplier: 3.5 },
  { id: '5+', label: '5+ days per week', multiplier: 5.5 },
] as const;

export const CAR_BASELINE_CO2 = 0.171; // kg CO2 per km for average car

export function calculateCO2Savings(
  modes: string[],
  distanceRange: string,
  frequency: string
): number {
  const distance = DISTANCE_RANGES.find(d => d.id === distanceRange)?.avgKm || 0;
  const freq = FREQUENCY_OPTIONS.find(f => f.id === frequency)?.multiplier || 0;
  
  const totalEmissions = modes.reduce((sum, modeId) => {
    const mode = COMMUTE_MODES.find(m => m.id === modeId);
    return sum + (mode?.co2Factor || 0);
  }, 0) / modes.length; // Average if multiple modes
  
  const carEmissions = CAR_BASELINE_CO2 * distance * freq * 2; // Round trip
  const actualEmissions = totalEmissions * distance * freq * 2;
  
  return Math.max(0, carEmissions - actualEmissions);
}

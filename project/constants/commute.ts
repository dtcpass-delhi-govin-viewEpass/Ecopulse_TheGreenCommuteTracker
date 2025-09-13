export const COMMUTE_MODES = [
  {
    id: 'walking',
    label: 'Walking',
    icon: '🚶',
    co2Factor: 0,
  },
  {
    id: 'cycling',
    label: 'Cycling',
    icon: '🚴',
    co2Factor: 0,
  },
  {
    id: 'public_transport',
    label: 'Public Transport',
    icon: '🚌',
    co2Factor: 0.05,
  },
  {
    id: 'carpooling',
    label: 'Carpooling',
    icon: '🚗',
    co2Factor: 0.1,
  },
  {
    id: 'electric_vehicle',
    label: 'Electric Vehicle',
    icon: '⚡',
    co2Factor: 0.02,
  },
];

export const CO2_FACTORS = {
  walking: 0,
  cycling: 0,
  public_transport: 0.05,
  carpooling: 0.1,
  electric_vehicle: 0.02,
};
/**
 * Default Configured Reference Thresholds
 * Note: Labeled as "Configured Reference Threshold" per requirements.
 */

export const INITIAL_THRESHOLDS = {
  airQuality: {
    id: 'airQuality',
    name: 'Air Quality (MQ-135)',
    category: 'air',
    unit: 'PPM',
    min: 0,
    max: 500,
    warning: 100,
    violation: 150,
    isRange: false,
    description: 'Simulated MQ-135 semiconductor gas sensor measuring industrial VOCs, CO, and smoke concentration.'
  },
  temperature: {
    id: 'temperature',
    name: 'Ambient Temperature',
    category: 'air',
    unit: '°C',
    min: 0,
    max: 60,
    warning: 38.0,
    violation: 42.0,
    isRange: false,
    description: 'Ambient facility operating temperature to detect thermal buildup and heat radiation.'
  },
  humidity: {
    id: 'humidity',
    name: 'Relative Humidity',
    category: 'air',
    unit: '%',
    min: 0,
    max: 100,
    warning: 75.0,
    violation: 85.0,
    isRange: false,
    description: 'Atmospheric moisture percentage influencing industrial stack dispersion and condensation.'
  },
  ph: {
    id: 'ph',
    name: 'Effluent pH Level',
    category: 'water',
    unit: 'pH',
    min: 0,
    max: 14,
    isRange: true,
    warningLow: 6.5,
    warningHigh: 8.5,
    violationLow: 6.0,
    violationHigh: 9.0,
    description: 'Acidity / alkalinity index of industrial wastewater discharged into drainage waterways.'
  },
  turbidity: {
    id: 'turbidity',
    name: 'Water Turbidity',
    category: 'water',
    unit: 'NTU',
    min: 0,
    max: 40,
    warning: 5.0,
    violation: 10.0,
    isRange: false,
    description: 'Measure of relative wastewater clarity and suspended particulate matter density.'
  }
};


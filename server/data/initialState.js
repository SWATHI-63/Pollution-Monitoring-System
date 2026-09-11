export const DEFAULT_STATE = {
  thresholds: {
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
  },
  facilities: [
    {
      id: 'fac-1',
      name: 'Textile Processing Unit',
      code: 'TX-01',
      industryType: 'Textile & Dyeing',
      location: 'Sector 4, Industrial Corridor, Zone North',
      compliancePercentage: 94,
      activeAlerts: 0,
      status: 'NORMAL',
      sensorsCount: 5,
      establishedYear: 2018,
      contactPerson: 'Arun Kumar',
      contactEmail: 'textile.ops@ecocomply.internal'
    },
    {
      id: 'fac-2',
      name: 'Chemical Manufacturing Unit',
      code: 'CH-02',
      industryType: 'Specialty Chemicals',
      location: 'Plot 18, Petrochem Park, Zone East',
      compliancePercentage: 86,
      activeAlerts: 1,
      status: 'WARNING',
      sensorsCount: 5,
      establishedYear: 2015,
      contactPerson: 'Sonia Verma',
      contactEmail: 'chem.plant@ecocomply.internal'
    },
    {
      id: 'fac-3',
      name: 'Paper Manufacturing Unit',
      code: 'PA-03',
      industryType: 'Pulp & Paper Processing',
      location: 'Riverbank Road, Green Industrial Estate',
      compliancePercentage: 91,
      activeAlerts: 0,
      status: 'NORMAL',
      sensorsCount: 5,
      establishedYear: 2020,
      contactPerson: 'David Chen',
      contactEmail: 'paper.mill@ecocomply.internal'
    },
    {
      id: 'fac-4',
      name: 'Food Processing Unit',
      code: 'FP-04',
      industryType: 'Agro & Food Processing',
      location: 'Agri-Tech Zone, Facility 12-B',
      compliancePercentage: 98,
      activeAlerts: 0,
      status: 'NORMAL',
      sensorsCount: 5,
      establishedYear: 2022,
      contactPerson: 'Meera Nair',
      contactEmail: 'food.processing@ecocomply.internal'
    }
  ],
  alerts: [
    {
      id: 'ALT-1082',
      facilityId: 'fac-2',
      facility: 'Chemical Manufacturing Unit',
      parameter: 'Turbidity',
      parameterId: 'turbidity',
      currentValue: '12.4 NTU',
      threshold: '10.0 NTU (Violation Threshold)',
      severity: 'CRITICAL',
      date: '2026-09-10',
      time: '14:22:10',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      description: 'Effluent wastewater turbidity exceeded configured reference limit of 10.0 NTU.',
      status: 'ACTIVE',
      resolvedAt: null,
      resolutionNote: ''
    },
    {
      id: 'ALT-1079',
      facilityId: 'fac-2',
      facility: 'Chemical Manufacturing Unit',
      parameter: 'Air Quality (MQ-135)',
      parameterId: 'airQuality',
      currentValue: '112.5 PPM',
      threshold: '100.0 PPM (Warning Threshold)',
      severity: 'WARNING',
      date: '2026-09-10',
      time: '11:05:40',
      timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
      description: 'Stack gas emission levels reached warning envelope. Immediate ventilation check advised.',
      status: 'ACTIVE',
      resolvedAt: null,
      resolutionNote: ''
    }
  ],
  users: [
    {
      id: 'usr-1',
      name: 'Admin Supervisor',
      email: 'admin@ecocomply.com',
      role: 'ADMIN',
      department: 'Environmental Safety & Compliance',
      status: 'ACTIVE',
      createdAt: '2026-01-15',
      lastLogin: '2026-09-11 12:45'
    },
    {
      id: 'usr-2',
      name: 'Swathi Ramanathan',
      email: 'swathi@example.com',
      role: 'EMPLOYEE',
      department: 'Plant Operations & Monitoring',
      status: 'ACTIVE',
      createdAt: '2026-02-10',
      lastLogin: '2026-09-11 11:20'
    }
  ],
  simulation: {
    isRunning: true,
    isPaused: false,
    mode: 'NORMAL',
    tickIntervalMs: 3000,
    readings: {
      airQuality: 68,
      temperature: 28.5,
      humidity: 56,
      ph: 7.25,
      turbidity: 3.2,
      timestamp: new Date().toISOString()
    }
  }
};

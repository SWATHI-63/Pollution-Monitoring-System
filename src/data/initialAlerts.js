/**
 * Initial sample alerts
 */

export const INITIAL_ALERTS = [
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
  },
  {
    id: 'ALT-1065',
    facilityId: 'fac-1',
    facility: 'Textile Processing Unit',
    parameter: 'Effluent pH Level',
    parameterId: 'ph',
    currentValue: '5.8 pH',
    threshold: '< 6.0 pH (Violation Threshold)',
    severity: 'CRITICAL',
    date: '2026-09-09',
    time: '17:30:15',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    description: 'Dye wash bath drain detected acidic surge below safe pH limit.',
    status: 'RESOLVED',
    resolvedAt: '2026-09-09 18:45:00',
    resolutionNote: 'Alkaline neutralizer dosing unit engaged; pH normalized to 7.2.'
  },
  {
    id: 'ALT-1051',
    facilityId: 'fac-3',
    facility: 'Paper Manufacturing Unit',
    parameter: 'Ambient Temperature',
    parameterId: 'temperature',
    currentValue: '39.4 °C',
    threshold: '38.0 °C (Warning Threshold)',
    severity: 'WARNING',
    date: '2026-09-08',
    time: '13:12:00',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    description: 'Dryer section ambient temperature sustained above warning threshold.',
    status: 'RESOLVED',
    resolvedAt: '2026-09-08 14:00:00',
    resolutionNote: 'Exhaust louvers opened and auxiliary fans activated.'
  }
];


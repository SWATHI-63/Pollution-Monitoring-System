/**
 * Realistic time-series data generator for charts and historical table
 */

export function generateTrendPoints(facilityCode = 'TX-01', count = 24, intervalMinutes = 60) {
  const points = [];
  const now = Date.now();

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * intervalMinutes * 60 * 1000);
    // Realistic diurnally fluctuating values with occasional small noise
    const hour = timestamp.getHours();
    const cycle = Math.sin((hour / 24) * Math.PI * 2);

    // Base values
    const airQuality = Math.round(65 + cycle * 20 + Math.random() * 12); // ~50-95 ppm
    const temperature = Number((28 + cycle * 4 + Math.random() * 1.5).toFixed(1)); // ~25-34 °C
    const humidity = Math.round(55 - cycle * 12 + Math.random() * 6); // ~40-70 %
    const ph = Number((7.2 + Math.sin(i * 0.4) * 0.4 + (Math.random() - 0.5) * 0.2).toFixed(2)); // ~6.8 - 7.6
    const turbidity = Number((3.2 + Math.cos(i * 0.3) * 1.2 + Math.random() * 0.8).toFixed(1)); // ~2.5 - 5.2 NTU

    points.push({
      time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      timestamp: timestamp.toISOString(),
      facility: facilityCode,
      airQuality,
      temperature,
      humidity,
      ph,
      turbidity
    });
  }
  return points;
}

export function generateHistoricalTableLogs() {
  const facilities = [
    { name: 'Textile Processing Unit', code: 'TX-01' },
    { name: 'Chemical Manufacturing Unit', code: 'CH-02' },
    { name: 'Paper Manufacturing Unit', code: 'PA-03' },
    { name: 'Food Processing Unit', code: 'FP-04' }
  ];

  const logs = [];
  const now = Date.now();

  for (let i = 0; i < 60; i++) {
    const timestamp = new Date(now - i * 45 * 60 * 1000);
    const fac = facilities[i % facilities.length];

    // Introduce realistic variance and a few intentional warning/violation anomalies
    let airQuality = Math.round(60 + (i % 7) * 8 + Math.random() * 10);
    let temperature = Number((27 + (i % 5) * 2.1 + Math.random()).toFixed(1));
    let humidity = Math.round(52 + (i % 6) * 4 + Math.random() * 5);
    let ph = Number((7.1 + Math.sin(i) * 0.5 + (Math.random() - 0.5) * 0.2).toFixed(2));
    let turbidity = Number((3.0 + (i % 4) * 1.1 + Math.random() * 0.9).toFixed(1));

    let status = 'NORMAL';

    // Anomaly injectors for realistic logs
    if (i === 4) {
      // Chemical plant turbidity violation
      turbidity = 12.4;
      status = 'VIOLATION';
    } else if (i === 11) {
      // Air quality warning
      airQuality = 112;
      status = 'WARNING';
    } else if (i === 22) {
      // Acidic surge violation
      ph = 5.8;
      status = 'VIOLATION';
    } else if (i === 35) {
      // Temperature warning
      temperature = 39.4;
      status = 'WARNING';
    }

    logs.push({
      id: `LOG-${1000 + i}`,
      timestamp: timestamp.toISOString(),
      dateFormatted: timestamp.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      facility: fac.name,
      facilityCode: fac.code,
      airQuality: `${airQuality} PPM`,
      airQualityRaw: airQuality,
      temperature: `${temperature} °C`,
      temperatureRaw: temperature,
      humidity: `${humidity} %`,
      humidityRaw: humidity,
      ph: `${ph} pH`,
      phRaw: ph,
      turbidity: `${turbidity} NTU`,
      turbidityRaw: turbidity,
      status
    });
  }

  return logs;
}


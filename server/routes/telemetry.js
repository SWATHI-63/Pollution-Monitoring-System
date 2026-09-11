import express from 'express';
import { store } from '../store.js';

export const telemetryRouter = express.Router();

function evaluateParameter(paramId, value, threshold) {
  if (value === null || value === undefined || !threshold) {
    return { status: 'NORMAL', severity: 'INFO' };
  }
  const num = Number(value);

  if (threshold.isRange) {
    const { violationLow, warningLow, warningHigh, violationHigh } = threshold;
    if (num < violationLow || num > violationHigh) {
      return { status: 'VIOLATION', severity: 'CRITICAL' };
    }
    if (num < warningLow || num > warningHigh) {
      return { status: 'WARNING', severity: 'WARNING' };
    }
    return { status: 'NORMAL', severity: 'INFO' };
  }

  const { warning, violation } = threshold;
  if (num >= violation) {
    return { status: 'VIOLATION', severity: 'CRITICAL' };
  }
  if (num >= warning) {
    return { status: 'WARNING', severity: 'WARNING' };
  }
  return { status: 'NORMAL', severity: 'INFO' };
}

function calculateCompliance(readings, thresholds) {
  const keys = ['airQuality', 'temperature', 'humidity', 'ph', 'turbidity'];
  let violationCount = 0;
  let warningCount = 0;
  let normalCount = 0;
  const details = {};

  keys.forEach((k) => {
    const val = readings[k];
    const thresh = thresholds[k];
    const evalRes = evaluateParameter(k, val, thresh);
    details[k] = { value: val, threshold: thresh, ...evalRes };

    if (evalRes.status === 'VIOLATION') violationCount++;
    else if (evalRes.status === 'WARNING') warningCount++;
    else normalCount++;
  });

  const totalPoints = keys.reduce((acc, k) => {
    const st = details[k]?.status;
    if (st === 'NORMAL') return acc + 100;
    if (st === 'WARNING') return acc + 60;
    return acc;
  }, 0);

  const overallPercentage = Math.round(totalPoints / keys.length);
  let overallStatus = 'COMPLIANT';
  if (violationCount > 0 || overallPercentage < 70) overallStatus = 'NON-COMPLIANT';
  else if (warningCount > 0 || overallPercentage < 90) overallStatus = 'PARTIALLY COMPLIANT';

  return {
    overallPercentage,
    overallStatus,
    normalCount,
    warningCount,
    violationCount,
    details
  };
}

// Telemetry Generator for Server simulation
export function generateNextTelemetry(mode) {
  let airQuality = 65;
  let temperature = 28.5;
  let humidity = 56;
  let ph = 7.2;
  let turbidity = 3.2;

  const jitter = (range) => (Math.random() - 0.5) * range;

  if (mode === 'NORMAL') {
    airQuality = Math.round(55 + Math.random() * 30 + jitter(5));
    temperature = Number((26 + Math.random() * 6 + jitter(0.5)).toFixed(1));
    humidity = Math.round(48 + Math.random() * 18 + jitter(3));
    ph = Number((7.1 + (Math.random() - 0.5) * 0.6).toFixed(2));
    turbidity = Number((2.0 + Math.random() * 2.2).toFixed(1));
  } else if (mode === 'WARNING') {
    airQuality = Math.round(105 + Math.random() * 20);
    temperature = Number((38.5 + Math.random() * 2.0).toFixed(1));
    humidity = Math.round(76 + Math.random() * 5);
    ph = Number((6.2 + Math.random() * 0.2).toFixed(2));
    turbidity = Number((6.2 + Math.random() * 2.5).toFixed(1));
  } else if (mode === 'VIOLATION') {
    airQuality = Math.round(168 + Math.random() * 60);
    temperature = Number((43.2 + Math.random() * 4.5).toFixed(1));
    humidity = Math.round(87 + Math.random() * 8);
    ph = Number((5.4 + Math.random() * 0.4).toFixed(2));
    turbidity = Number((12.8 + Math.random() * 8.0).toFixed(1));
  }

  return {
    airQuality,
    temperature,
    humidity,
    ph,
    turbidity,
    timestamp: new Date().toISOString()
  };
}

// GET /api/telemetry/live
telemetryRouter.get('/live', (req, res) => {
  const simulation = store.get('simulation') || {};
  const thresholds = store.get('thresholds') || {};
  const compliance = calculateCompliance(simulation.readings, thresholds);

  res.json({
    ...simulation,
    compliance
  });
});

// POST /api/telemetry/mode
telemetryRouter.post('/mode', (req, res) => {
  const { mode } = req.body;
  if (!['NORMAL', 'WARNING', 'VIOLATION'].includes(mode)) {
    return res.status(400).json({ error: 'Invalid mode. Must be NORMAL, WARNING, or VIOLATION.' });
  }

  const simulation = store.get('simulation');
  simulation.mode = mode;
  simulation.readings = generateNextTelemetry(mode);
  store.set('simulation', simulation);

  res.json({ success: true, mode, readings: simulation.readings });
});

// POST /api/telemetry/control
telemetryRouter.post('/control', (req, res) => {
  const { action, intervalMs } = req.body; // 'start', 'pause', 'stop'
  const simulation = store.get('simulation');

  if (action === 'start') {
    simulation.isRunning = true;
    simulation.isPaused = false;
  } else if (action === 'pause') {
    simulation.isPaused = !simulation.isPaused;
  } else if (action === 'stop') {
    simulation.isRunning = false;
    simulation.isPaused = false;
  }

  if (intervalMs) {
    simulation.tickIntervalMs = Number(intervalMs);
  }

  store.set('simulation', simulation);
  res.json({ success: true, simulation });
});

// POST /api/telemetry/manual
telemetryRouter.post('/manual', (req, res) => {
  const { airQuality, temperature, humidity, ph, turbidity } = req.body;
  const readings = {
    airQuality: Number(airQuality),
    temperature: Number(temperature),
    humidity: Number(humidity),
    ph: Number(ph),
    turbidity: Number(turbidity),
    timestamp: new Date().toISOString()
  };

  const simulation = store.get('simulation');
  simulation.readings = readings;
  store.set('simulation', simulation);

  const thresholds = store.get('thresholds') || {};
  const compliance = calculateCompliance(readings, thresholds);

  // Auto create alert on violation
  const alerts = store.get('alerts') || [];
  Object.keys(thresholds).forEach((k) => {
    const item = compliance.details[k];
    if (item && item.status === 'VIOLATION') {
      alerts.unshift({
        id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        facility: 'Manual Test Bench',
        facilityId: 'fac-1',
        parameter: item.threshold.name,
        parameterId: k,
        currentValue: `${item.value} ${item.threshold.unit}`,
        threshold: item.threshold.isRange
          ? `< ${item.threshold.violationLow} or > ${item.threshold.violationHigh}`
          : `≥ ${item.threshold.violation} ${item.threshold.unit}`,
        severity: 'CRITICAL',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        timestamp: new Date().toISOString(),
        description: `SERVER ALERT: ${item.threshold.name} evaluated at ${item.value} ${item.threshold.unit} exceeds configured reference limit.`,
        status: 'ACTIVE',
        resolvedAt: null,
        resolutionNote: ''
      });
    }
  });
  store.set('alerts', alerts);

  res.json({ success: true, readings, compliance });
});

// GET /api/telemetry/history
telemetryRouter.get('/history', (req, res) => {
  const count = Number(req.query.count) || 24;
  const points = [];
  const now = Date.now();

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 60 * 1000);
    const hour = timestamp.getHours();
    const cycle = Math.sin((hour / 24) * Math.PI * 2);

    points.push({
      time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      timestamp: timestamp.toISOString(),
      airQuality: Math.round(65 + cycle * 20 + Math.random() * 12),
      temperature: Number((28 + cycle * 4 + Math.random() * 1.5).toFixed(1)),
      humidity: Math.round(55 - cycle * 12 + Math.random() * 6),
      ph: Number((7.2 + Math.sin(i * 0.4) * 0.4).toFixed(2)),
      turbidity: Number((3.2 + Math.cos(i * 0.3) * 1.2).toFixed(1))
    });
  }

  res.json(points);
});

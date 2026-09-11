import express from 'express';
import cors from 'cors';
import { store } from './store.js';
import { telemetryRouter, generateNextTelemetry } from './routes/telemetry.js';
import { thresholdsRouter } from './routes/thresholds.js';
import { alertsRouter } from './routes/alerts.js';
import { facilitiesRouter } from './routes/facilities.js';
import { usersRouter } from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Server-side Simulation Engine Loop (Background Telemetry Clock)
setInterval(() => {
  const simulation = store.get('simulation');
  if (simulation && simulation.isRunning && !simulation.isPaused) {
    const nextReadings = generateNextTelemetry(simulation.mode);
    simulation.readings = nextReadings;
    store.set('simulation', simulation);
  }
}, 3000);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'EcoComply REST API Backend',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Register REST API routers
app.use('/api/telemetry', telemetryRouter);
app.use('/api/thresholds', thresholdsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/facilities', facilitiesRouter);
app.use('/api/users', usersRouter);

app.listen(PORT, () => {
  console.log(`🚀 EcoComply REST API Server running at http://localhost:${PORT}`);
  console.log(`📡 Telemetry Simulation Loop active on port ${PORT}`);
});

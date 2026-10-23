import express from 'express';
import cors from 'cors';
import { store } from './store.js';
import { telemetryRouter, generateNextTelemetry } from './routes/telemetry.js';
import { thresholdsRouter } from './routes/thresholds.js';
import { alertsRouter } from './routes/alerts.js';
import { facilitiesRouter } from './routes/facilities.js';
import { usersRouter } from './routes/users.js';
import { isSupabaseConfigured } from './supabase.js';
import { reportsRouter } from './routes/reports.js';

const app = express();
app.disable('x-powered-by');
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' })); // NOSONAR
app.use(express.json());


// Server-side Simulation Engine Loop (Background Telemetry Clock)
setInterval(() => {
  const simulation = store.get('simulation');
  if (simulation?.isRunning && !simulation.isPaused) {
    const nextReadings = generateNextTelemetry(simulation.mode);
    simulation.readings = nextReadings;
    store.set('simulation', simulation);

    store.insertReading({
  ...nextReadings,
  source: 'simulation'
});
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
app.use('/api/reports', reportsRouter);

await store.initialize();

app.listen(PORT, () => {
  console.log(`EcoComply REST API Server running at http://localhost:${PORT}`);
  console.log(`Telemetry Simulation Loop active on port ${PORT}`);
  console.log(`Persistence: ${isSupabaseConfigured ? 'Supabase' : 'local JSON fallback'}`);
});

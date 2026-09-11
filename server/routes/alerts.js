import express from 'express';
import { store } from '../store.js';

export const alertsRouter = express.Router();

// GET /api/alerts
alertsRouter.get('/', (req, res) => {
  let alerts = store.get('alerts') || [];
  const { facilityId, severity, status } = req.query;

  if (facilityId && facilityId !== 'ALL') {
    alerts = alerts.filter((a) => a.facilityId === facilityId);
  }
  if (severity && severity !== 'ALL') {
    alerts = alerts.filter((a) => a.severity === severity);
  }
  if (status && status !== 'ALL') {
    alerts = alerts.filter((a) => a.status === status);
  }

  res.json(alerts);
});

// POST /api/alerts
alertsRouter.post('/', (req, res) => {
  const alerts = store.get('alerts') || [];
  const now = new Date();
  const newAlert = {
    id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
    facility: req.body.facility || 'Monitored Plant',
    facilityId: req.body.facilityId || 'fac-1',
    parameter: req.body.parameter || 'Environmental Parameter',
    parameterId: req.body.parameterId || '',
    currentValue: req.body.currentValue || '--',
    threshold: req.body.threshold || 'Configured Reference Threshold',
    severity: req.body.severity || 'WARNING',
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString('en-US', { hour12: false }),
    timestamp: now.toISOString(),
    description: req.body.description || 'Threshold breached during monitoring.',
    status: 'ACTIVE',
    resolvedAt: null,
    resolutionNote: ''
  };

  alerts.unshift(newAlert);
  store.set('alerts', alerts);

  res.status(201).json(newAlert);
});

// PATCH /api/alerts/:id/resolve
alertsRouter.patch('/:id/resolve', (req, res) => {
  const { id } = req.params;
  const { resolutionNote } = req.body;
  const alerts = store.get('alerts') || [];

  const alertIndex = alerts.findIndex((a) => a.id === id);
  if (alertIndex === -1) {
    return res.status(404).json({ error: `Alert ${id} not found.` });
  }

  alerts[alertIndex] = {
    ...alerts[alertIndex],
    status: 'RESOLVED',
    resolvedAt: new Date().toLocaleString(),
    resolutionNote: resolutionNote || 'Remediation completed and verified.'
  };

  store.set('alerts', alerts);
  res.json({ success: true, alert: alerts[alertIndex] });
});

// DELETE /api/alerts/resolved
alertsRouter.delete('/resolved', (req, res) => {
  let alerts = store.get('alerts') || [];
  alerts = alerts.filter((a) => a.status === 'ACTIVE');
  store.set('alerts', alerts);
  res.json({ success: true, remainingCount: alerts.length });
});

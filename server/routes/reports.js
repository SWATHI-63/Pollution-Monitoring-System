import express from 'express';
import { randomUUID } from 'node:crypto';
import { store } from '../store.js';

export const reportsRouter = express.Router();

// GET /api/reports — list saved reports
reportsRouter.get('/', (req, res) => {
  res.json(store.get('reports') || []);
});

// POST /api/reports — save a report
reportsRouter.post('/', async (req, res) => {
  const { facilityId, generatedBy, title, reportType, fileUrl } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Report title is required.' });
  }

  const report = {
    id: randomUUID(),
    facilityId: facilityId || null,
    generatedBy: generatedBy || null,
    title,
    reportType: reportType || 'compliance',
    fileUrl: fileUrl || null,
    createdAt: new Date().toISOString()
  };

  const reports = [...(store.get('reports') || []), report];

  try {
    await store.set('reports', reports);
    res.status(201).json({ success: true, report });
  } catch (error) {
    console.error('Failed to save report:', error);
    res.status(500).json({ error: 'Failed to save report.' });
  }
});
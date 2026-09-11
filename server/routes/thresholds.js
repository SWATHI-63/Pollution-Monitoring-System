import express from 'express';
import { store } from '../store.js';
import { DEFAULT_STATE } from '../data/initialState.js';

export const thresholdsRouter = express.Router();

// GET /api/thresholds
thresholdsRouter.get('/', (req, res) => {
  const thresholds = store.get('thresholds') || {};
  res.json(thresholds);
});

// PUT /api/thresholds/:id
thresholdsRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const thresholds = store.get('thresholds') || {};

  if (!thresholds[id]) {
    return res.status(404).json({ error: `Threshold with id ${id} not found.` });
  }

  thresholds[id] = {
    ...thresholds[id],
    ...req.body,
    id
  };

  store.set('thresholds', thresholds);
  res.json({ success: true, threshold: thresholds[id] });
});

// POST /api/thresholds/reset
thresholdsRouter.post('/reset', (req, res) => {
  const defaultThresholds = JSON.parse(JSON.stringify(DEFAULT_STATE.thresholds));
  store.set('thresholds', defaultThresholds);
  res.json({ success: true, thresholds: defaultThresholds });
});

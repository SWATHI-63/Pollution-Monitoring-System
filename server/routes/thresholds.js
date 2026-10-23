import express from 'express';
import { store } from '../store.js';
import { DEFAULT_STATE } from '../data/initialState.js';

export const thresholdsRouter = express.Router();

// GET /api/thresholds
thresholdsRouter.get('/', (req, res) => {
  res.json(store.get('thresholds') || {});
});

// PUT /api/thresholds/:id
thresholdsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const thresholds = store.get('thresholds') || {};

  if (!thresholds[id]) {
    return res.status(404).json({
      error: `Threshold with id ${id} not found.`
    });
  }

  thresholds[id] = {
    ...thresholds[id],
    ...req.body,
    id
  };

  try {
    await store.set('thresholds', thresholds);
    res.json({ success: true, threshold: thresholds[id] });
  } catch (error) {
    console.error('Failed to save threshold:', error);
    res.status(500).json({ error: 'Failed to save threshold.' });
  }
});

// POST /api/thresholds/reset
thresholdsRouter.post('/reset', async (req, res) => {
  const defaultThresholds = structuredClone(DEFAULT_STATE.thresholds);

  try {
    await store.set('thresholds', defaultThresholds);
    res.json({ success: true, thresholds: defaultThresholds });
  } catch (error) {
    console.error('Failed to reset thresholds:', error);
    res.status(500).json({ error: 'Failed to reset thresholds.' });
  }
});
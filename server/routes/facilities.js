import express from 'express';
import { store } from '../store.js';

export const facilitiesRouter = express.Router();

// GET /api/facilities
facilitiesRouter.get('/', (req, res) => {
  const facilities = store.get('facilities') || [];
  res.json(facilities);
});

// POST /api/facilities
facilitiesRouter.post('/', (req, res) => {
  const facilities = store.get('facilities') || [];
  const newFacility = {
    ...req.body,
    id: `fac-${Date.now()}`,
    compliancePercentage: req.body.compliancePercentage || 95,
    activeAlerts: 0,
    status: 'NORMAL',
    sensorsCount: 5,
    establishedYear: req.body.establishedYear || new Date().getFullYear()
  };

  facilities.unshift(newFacility);
  store.set('facilities', facilities);

  res.status(201).json(newFacility);
});

// PUT /api/facilities/:id
facilitiesRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const facilities = store.get('facilities') || [];
  const index = facilities.findIndex((f) => f.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Facility with id ${id} not found.` });
  }

  facilities[index] = {
    ...facilities[index],
    ...req.body,
    id
  };

  store.set('facilities', facilities);
  res.json({ success: true, facility: facilities[index] });
});

// DELETE /api/facilities/:id
facilitiesRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  let facilities = store.get('facilities') || [];
  facilities = facilities.filter((f) => f.id !== id);
  store.set('facilities', facilities);
  res.json({ success: true, id });
});

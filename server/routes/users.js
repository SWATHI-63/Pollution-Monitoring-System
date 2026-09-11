import express from 'express';
import { store } from '../store.js';

export const usersRouter = express.Router();

// GET /api/users
usersRouter.get('/', (req, res) => {
  const users = store.get('users') || [];
  res.json(users);
});

// POST /api/users
usersRouter.post('/', (req, res) => {
  const users = store.get('users') || [];
  const { name, email, role, department, status } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || email.split('@')[0],
    email: email.trim().toLowerCase(),
    role: role === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE',
    department: department || 'Environmental Operations',
    status: status || 'ACTIVE',
    createdAt: new Date().toISOString().split('T')[0],
    lastLogin: 'Never'
  };

  users.unshift(newUser);
  store.set('users', users);

  res.status(201).json(newUser);
});

// PUT /api/users/:id
usersRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const users = store.get('users') || [];
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `User ${id} not found.` });
  }

  users[index] = {
    ...users[index],
    ...req.body,
    id
  };

  store.set('users', users);
  res.json({ success: true, user: users[index] });
});

// DELETE /api/users/:id
usersRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  let users = store.get('users') || [];
  users = users.filter((u) => u.id !== id);
  store.set('users', users);
  res.json({ success: true, id });
});

import express from 'express';
import { randomUUID } from 'node:crypto';
import { store } from '../store.js';
import { isSupabaseConfigured, supabase } from '../supabase.js';

export const usersRouter = express.Router();
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// GET /api/users
usersRouter.get('/', (req, res) => {
  const users = store.get('users') || [];
  res.json(users);
});

// GET /api/users/profile?email=...
usersRouter.get('/profile', async (req, res) => {
  const email = String(req.query.email || '').trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  let user = (store.get('users') || []).find(
    (item) => String(item.email || '').toLowerCase() === email
  );

  if (!user && isSupabaseConfigured) {
    const { data: authUsers, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });
    if (error) {
      console.error('Failed to find Supabase Auth profile:', error);
      return res.status(502).json({ error: 'Could not read the Supabase Auth user.' });
    }

    const authUser = authUsers.users.find((item) => item.email?.toLowerCase() === email);
    if (authUser) {
      user = (store.get('users') || []).find((item) => item.id === authUser.id);
      if (user) {
        user = { ...user, email };
      }
    }
  }

  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  res.json(user);
});

// POST /api/users/login — persist a successful login in the profiles table
usersRouter.post('/login', async (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  const users = store.get('users') || [];
  const existingUser = users.find(
    (item) => String(item.email || '').toLowerCase() === normalizedEmail
  );
  const now = new Date().toISOString();
  let authUserId = existingUser?.id;

  try {
    if (isSupabaseConfigured) {
    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });
    if (listError) throw listError;

    const authUser = authUsers.users.find(
      (item) => item.email?.toLowerCase() === normalizedEmail
    );

    if (authUser) {
      authUserId = authUser.id;
    } else {
      if (!password) {
        return res.status(400).json({ error: 'Password is required to create the Supabase user.' });
        }
      const { data: createdAuthUser, error: createError } =
        await supabase.auth.admin.createUser({
          email: normalizedEmail,
          password,
          email_confirm: true,
          user_metadata: { name: name || normalizedEmail.split('@')[0] }
        });
      if (createError) throw createError;
      authUserId = createdAuthUser.user.id;
    }
  }

  const user = {
    ...(existingUser || {}),
    id: authUserId || (UUID_PATTERN.test(existingUser?.id || '') ? existingUser.id : randomUUID()),
    name: name || existingUser?.name || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    role: role === 'ADMIN' ? 'ADMIN' : existingUser?.role || 'EMPLOYEE',
    department: existingUser?.department || 'Environmental Operations',
    status: existingUser?.status || 'ACTIVE',
    createdAt: existingUser?.createdAt || now.split('T')[0],
    lastLogin: now
  };
  const nextUsers = existingUser
    ? users.map((item) => (item.id === existingUser.id ? user : item))
    : [user, ...users];

    await store.set('users', nextUsers);
    res.json(user);
  } catch (error) {
    console.error('Failed to persist login profile:', error);
    res.status(500).json({ error: error.message || 'Login succeeded, but the profile could not be saved.' });
  }
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

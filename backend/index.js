import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createClient } from '@supabase/supabase-js';
import { Trip, ChecklistItem, Favorite, TripRequest, ConversationMessage, User } from './models.js';

const app = express();
const port = Number(process.env.PORT) || 4000;
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174')
  .split(',').map(origin => origin.trim()).filter(Boolean);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked request from ${origin}`));
  },
}));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => res.json({
  ok: true,
  persistence: mongoose.connection.readyState === 1 ? 'mongodb' : 'disconnected',
  authentication: supabase ? 'supabase' : 'not-configured',
}));

app.get('/api/health/db', (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    success: connected,
    database: mongoose.connection.name || null,
    message: connected ? 'MongoDB connected successfully!' : 'MongoDB is not connected',
    readyState: mongoose.connection.readyState,
  });
});

async function requireUser(req, res, next) {
  if (!supabase) return res.status(503).json({ error: 'Authentication is not configured on the server.' });
  const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return res.status(401).json({ error: 'Sign in to continue.' });

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: 'Your session is invalid or expired. Please sign in again.' });

    const authUser = data.user;
    const metadata = authUser.user_metadata || {};
    const fields = {
      email: authUser.email || '',
      displayName: String(metadata.full_name || metadata.name || '').slice(0, 100),
      avatarUrl: String(metadata.avatar_url || '').slice(0, 1000),
    };
    try {
      req.account = await User.findOneAndUpdate(
        { supabaseId: authUser.id },
        { $set: fields, $setOnInsert: { supabaseId: authUser.id } },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
      );
    } catch (error) {
      // A simultaneous first request can race on the unique Supabase ID index.
      if (error.code !== 11000) throw error;
      req.account = await User.findOne({ supabaseId: authUser.id });
    }
    if (!req.account) return res.status(500).json({ error: 'Could not load your account.' });
    next();
  } catch (error) {
    next(error);
  }
}

app.use('/api/me', requireUser);
app.use('/api/trips', requireUser);
app.use('/api/checklists', requireUser);
app.use('/api/favorites', requireUser);
app.use('/api/trip-requests', requireUser);
app.use('/api/messages', requireUser);

app.get('/api/me', (req, res) => res.json({
  id: req.account._id,
  email: req.account.email,
  displayName: req.account.displayName,
  avatarUrl: req.account.avatarUrl,
  preferences: req.account.preferences,
  createdAt: req.account.createdAt,
}));

app.patch('/api/me', async (req, res, next) => {
  try {
    const { displayName, preferences } = req.body;
    if (displayName !== undefined) req.account.displayName = String(displayName).trim().slice(0, 100);
    if (preferences && typeof preferences === 'object') {
      req.account.set('preferences', { ...req.account.get('preferences'), ...preferences });
    }
    await req.account.save();
    res.json({ id: req.account._id, email: req.account.email, displayName: req.account.displayName, preferences: req.account.preferences });
  } catch (error) { next(error); }
});

app.get('/api/trip-requests', async (req, res, next) => {
  try {
    res.json(await TripRequest.find({ userId: req.account._id }).sort({ createdAt: -1 }).limit(100));
  } catch (error) { next(error); }
});

app.post('/api/trip-requests', async (req, res, next) => {
  try {
    const data = req.body || {};
    if (!data.startingLocation?.trim() || !data.destination?.trim() || !data.tripDates?.startDate || !data.tripDates?.endDate) {
      return res.status(400).json({ error: 'Starting location, destination and both trip dates are required.' });
    }
    if (new Date(data.tripDates.endDate) <= new Date(data.tripDates.startDate)) {
      return res.status(400).json({ error: 'The trip end date must be after the start date.' });
    }
    if (!Number.isInteger(Number(data.travelers)) || Number(data.travelers) < 1) {
      return res.status(400).json({ error: 'Traveler count must be a positive whole number.' });
    }
    if (!Number.isFinite(Number(data.budget?.amount)) || Number(data.budget.amount) <= 0 || !['total_group', 'per_person'].includes(data.budget?.type)) {
      return res.status(400).json({ error: 'Enter a positive budget and choose a budget type.' });
    }

    const saved = await TripRequest.create({
      userId: req.account._id,
      startingLocation: data.startingLocation,
      destination: data.destination,
      tripDates: data.tripDates,
      travelers: Number(data.travelers),
      budget: { amount: Number(data.budget.amount), type: data.budget.type },
      preferences: {
        interests: Array.isArray(data.preferences?.interests) ? data.preferences.interests : [],
        travelStyle: data.preferences?.travelStyle || '',
        accommodation: data.preferences?.accommodation || '',
        transportation: data.preferences?.transportation || 'no preference',
        pace: data.preferences?.pace || '',
      },
      additionalRequirements: data.additionalRequirements || '',
    });
    res.status(201).json(saved);
  } catch (error) { next(error); }
});

app.get('/api/messages', async (req, res, next) => {
  try { res.json(await ConversationMessage.find({ userId: req.account._id }).sort({ createdAt: 1 }).limit(300)); }
  catch (error) { next(error); }
});

app.post('/api/messages', async (req, res, next) => {
  try {
    const { role, content } = req.body || {};
    if (!['user', 'assistant'].includes(role) || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'A message role and message text are required.' });
    }
    res.status(201).json(await ConversationMessage.create({ userId: req.account._id, role, content: content.trim() }));
  } catch (error) { next(error); }
});

const collections = {
  trips: { Model: Trip, sort: { createdAt: -1 } },
  checklists: { Model: ChecklistItem, sort: { createdAt: 1 } },
  favorites: { Model: Favorite, sort: { createdAt: 1 } },
};
const validId = value => /^[a-f\d]{24}$/i.test(value);

for (const [name, { Model, sort }] of Object.entries(collections)) {
  const path = `/api/${name}`;
  app.get(path, async (req, res, next) => {
    try { res.json(await Model.find({ userId: req.account._id }).sort(sort)); }
    catch (error) { next(error); }
  });

  app.post(path, async (req, res, next) => {
    try {
      const input = req.body || {};
      let data;
      if (name === 'trips') {
        if (!input.title?.trim() || !Array.isArray(input.days)) return res.status(400).json({ error: 'A trip title and day list are required.' });
        data = { title: input.title.trim(), dates: input.dates || '', days: input.days, budget: input.budget || 'Comfort', travelers: Number(input.travelers) || 1 };
      } else if (name === 'checklists') {
        if (typeof input.name !== 'string' || !input.name.trim()) return res.status(400).json({ error: 'Checklist item name is required.' });
        data = { name: input.name.trim(), done: Boolean(input.done) };
      } else {
        if (typeof input.destinationId !== 'string' || !input.destinationId.trim()) return res.status(400).json({ error: 'Destination ID is required.' });
        data = { destinationId: input.destinationId.trim() };
      }
      res.status(201).json(await Model.create({ ...data, userId: req.account._id }));
    } catch (error) { next(error); }
  });

  app.put(`${path}/:id`, async (req, res, next) => {
    try {
      if (!validId(req.params.id)) return res.status(404).json({ error: 'Item not found.' });
      const input = req.body || {};
      const changes = name === 'trips'
        ? { ...(typeof input.title === 'string' ? { title: input.title.trim() } : {}), ...(Array.isArray(input.days) ? { days: input.days } : {}), ...(typeof input.budget === 'string' ? { budget: input.budget } : {}), ...(typeof input.travelers === 'number' ? { travelers: input.travelers } : {}) }
        : name === 'checklists'
          ? { ...(typeof input.name === 'string' ? { name: input.name.trim() } : {}), ...(typeof input.done === 'boolean' ? { done: input.done } : {}) }
          : {};
      const value = await Model.findOneAndUpdate({ _id: req.params.id, userId: req.account._id }, changes, { new: true, runValidators: true });
      return value ? res.json(value) : res.status(404).json({ error: 'Item not found.' });
    } catch (error) { next(error); }
  });

  app.delete(`${path}/:id`, async (req, res, next) => {
    try {
      if (!validId(req.params.id)) return res.status(404).json({ error: 'Item not found.' });
      const value = await Model.findOneAndDelete({ _id: req.params.id, userId: req.account._id });
      return value ? res.status(204).end() : res.status(404).json({ error: 'Item not found.' });
    } catch (error) { next(error); }
  });
}

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ error: error.message });
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

async function startServer() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required; authenticated user data is never stored in demo memory mode.');
  if (!supabase) throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are required for authentication.');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Connected to MongoDB database "${mongoose.connection.name}"`);
  app.listen(port, () => console.log(`Tide API listening on http://localhost:${port} (Supabase auth + MongoDB)`));
}

startServer().catch(error => {
  console.error('Could not start Tide API:', error.message);
  process.exit(1);
});

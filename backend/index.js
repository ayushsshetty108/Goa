import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Trip, ChecklistItem, Favorite } from './models.js';

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked request from ${origin}`));
  },
}));
app.use(express.json({ limit: '100kb' }));
const memory = { trips: [], checklists: [], favorites: [] };
const hasDb = Boolean(process.env.MONGODB_URI);
const col = { trips: Trip, checklists: ChecklistItem, favorites: Favorite };
const id = () => Math.random().toString(36).slice(2, 11);
const validId = s => /^[a-f\d]{24}$/i.test(s);

app.get('/api/health', (_, res) => res.json({ ok: true, persistence: hasDb ? 'mongodb' : 'demo-memory' }));
for (const [name, Model] of Object.entries(col)) {
  const path = `/api/${name}`;
  app.get(path, async (_, res, next) => { try { res.json(hasDb ? await Model.find().sort({ createdAt: -1 }) : memory[name]); } catch (e) { next(e); } });
  app.post(path, async (req, res, next) => {
    try {
      if (name === 'trips' && (!req.body.title || !Array.isArray(req.body.days))) return res.status(400).json({ error: 'A trip title and day list are required.' });
      if (name === 'checklists' && (typeof req.body.name !== 'string' || !req.body.name.trim())) return res.status(400).json({ error: 'Checklist item name is required.' });
      if (name === 'favorites' && (typeof req.body.destinationId !== 'string' || !req.body.destinationId.trim())) return res.status(400).json({ error: 'Destination ID is required.' });
      const data = name === 'checklists' ? { name: req.body.name.trim(), done: Boolean(req.body.done) } : name === 'favorites' ? { destinationId: req.body.destinationId.trim() } : { title: req.body.title.trim(), dates: req.body.dates || '', days: req.body.days, budget: req.body.budget || 'Comfort', travelers: Number(req.body.travelers) || 1 };
      const value = hasDb ? await Model.create(data) : { ...data, _id: id(), createdAt: new Date().toISOString() };
      if (!hasDb) memory[name].unshift(value);
      res.status(201).json(value);
    } catch (e) { next(e); }
  });
  app.put(`${path}/:id`, async (req, res, next) => {
    try {
      const changes = name === 'checklists' ? { ...(typeof req.body.name === 'string' ? { name: req.body.name.trim() } : {}), ...(typeof req.body.done === 'boolean' ? { done: req.body.done } : {}) } : name === 'favorites' ? {} : { ...(typeof req.body.title === 'string' ? { title: req.body.title.trim() } : {}), ...(Array.isArray(req.body.days) ? { days: req.body.days } : {}), ...(typeof req.body.budget === 'string' ? { budget: req.body.budget } : {}) };
      if (hasDb) { if (!validId(req.params.id)) return res.status(404).json({ error: 'Item not found.' }); const value = await Model.findByIdAndUpdate(req.params.id, changes, { new: true, runValidators: true }); return value ? res.json(value) : res.status(404).json({ error: 'Item not found.' }); }
      const item = memory[name].find(x => x._id === req.params.id); if (!item) return res.status(404).json({ error: 'Item not found.' }); Object.assign(item, changes); res.json(item);
    } catch (e) { next(e); }
  });
  app.delete(`${path}/:id`, async (req, res, next) => {
    try {
      if (hasDb) { if (!validId(req.params.id)) return res.status(404).json({ error: 'Item not found.' }); const result = await Model.findByIdAndDelete(req.params.id); return result ? res.status(204).end() : res.status(404).json({ error: 'Item not found.' }); }
      const before = memory[name].length; memory[name] = memory[name].filter(x => x._id !== req.params.id); return before === memory[name].length ? res.status(404).json({ error: 'Item not found.' }) : res.status(204).end();
    } catch (e) { next(e); }
  });
}
app.use((err, _req, res, _next) => { console.error(err); if (err.name === 'ValidationError') return res.status(400).json({ error: err.message }); res.status(500).json({ error: 'Something went wrong on the server.' }); });
const port = Number(process.env.PORT) || 4000;
if (hasDb) mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected to MongoDB')).catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
app.listen(port, () => console.log(`Tide API listening on http://localhost:${port} (${hasDb ? 'MongoDB' : 'demo-memory'} mode)`));

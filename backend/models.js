import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const stopSchema = new Schema({
  name: { type: String, required: true, trim: true },
  area: { type: String, default: '' },
  time: { type: String, default: '' },
  cost: { type: Number, min: 0, default: 0 },
  note: { type: String, default: '' },
}, { _id: false });

const daySchema = new Schema({
  day: { type: Number, required: true, min: 1 },
  title: { type: String, required: true },
  estimated: { type: Number, min: 0, default: 0 },
  stops: [stopSchema],
}, { _id: false });

const tripSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  dates: { type: String, default: '' },
  days: { type: [daySchema], required: true },
  budget: { type: String, default: 'Comfort' },
  travelers: { type: Number, min: 1, max: 30, default: 1 },
}, { timestamps: true });

const checklistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  done: { type: Boolean, default: false },
}, { timestamps: true });

const favoriteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  destinationId: { type: String, required: true, trim: true },
}, { timestamps: true });

const userSchema = new Schema({
  supabaseId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  displayName: { type: String, trim: true, maxlength: 100, default: '' },
  avatarUrl: { type: String, default: '' },
  preferences: {
    interests: { type: [String], default: [] },
    travelStyle: { type: String, default: '' },
    accommodation: { type: String, default: '' },
    transportation: { type: String, default: '' },
    pace: { type: String, default: '' },
  },
}, { timestamps: true });

const tripRequestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  startingLocation: { type: String, required: true, trim: true, maxlength: 160 },
  destination: { type: String, required: true, trim: true, maxlength: 160 },
  tripDates: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  travelers: { type: Number, required: true, min: 1, max: 100 },
  budget: {
    amount: { type: Number, required: true, min: 0.01 },
    type: { type: String, enum: ['total_group', 'per_person'], required: true },
  },
  preferences: {
    interests: { type: [String], default: [] },
    travelStyle: { type: String, enum: ['', 'budget-friendly', 'balanced', 'luxury'], default: '' },
    accommodation: { type: String, enum: ['', 'hostel', 'hotel', 'resort', 'homestay'], default: '' },
    transportation: { type: String, enum: ['no preference', 'bus', 'train', 'flight', 'self-drive'], default: 'no preference' },
    pace: { type: String, enum: ['', 'relaxed', 'moderate', 'packed'], default: '' },
  },
  additionalRequirements: { type: String, trim: true, maxlength: 4000, default: '' },
}, { timestamps: true });

const conversationMessageSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true, trim: true, maxlength: 4000 },
}, { timestamps: true });

export const User = mongoose.models.User || model('User', userSchema);
export const Trip = mongoose.models.Trip || model('Trip', tripSchema);
export const ChecklistItem = mongoose.models.ChecklistItem || model('ChecklistItem', checklistSchema);
export const Favorite = mongoose.models.Favorite || model('Favorite', favoriteSchema);
export const TripRequest = mongoose.models.TripRequest || model('TripRequest', tripRequestSchema);
export const ConversationMessage = mongoose.models.ConversationMessage || model('ConversationMessage', conversationMessageSchema);

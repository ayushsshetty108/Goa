import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const stopSchema = new Schema({ name: { type: String, required: true, trim: true }, area: { type: String, default: '' }, time: { type: String, default: '' }, cost: { type: Number, min: 0, default: 0 }, note: { type: String, default: '' } }, { _id: false });
const daySchema = new Schema({ day: { type: Number, required: true, min: 1 }, title: { type: String, required: true }, estimated: { type: Number, min: 0, default: 0 }, stops: [stopSchema] }, { _id: false });
const tripSchema = new Schema({ title: { type: String, required: true, trim: true, maxlength: 100 }, dates: { type: String, default: '' }, days: { type: [daySchema], required: true }, budget: { type: String, default: 'Comfort' }, travelers: { type: Number, min: 1, max: 30, default: 1 } }, { timestamps: true });
const checklistSchema = new Schema({ name: { type: String, required: true, trim: true, maxlength: 120 }, done: { type: Boolean, default: false } }, { timestamps: true });
const favoriteSchema = new Schema({ destinationId: { type: String, required: true, trim: true } }, { timestamps: true });
export const Trip = mongoose.models.Trip || model('Trip', tripSchema);
export const ChecklistItem = mongoose.models.ChecklistItem || model('ChecklistItem', checklistSchema);
export const Favorite = mongoose.models.Favorite || model('Favorite', favoriteSchema);

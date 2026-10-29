import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Check, MapPin, Sparkles, Users, Wallet, X } from 'lucide-react';
import { motionTransition } from '../data/goa';

const interestOptions = ['beaches', 'adventure', 'food', 'nightlife', 'nature', 'culture', 'shopping'];

const initialForm = {
  startingLocation: '',
  destination: '',
  tripStartDate: '',
  tripEndDate: '',
  travelers: '2',
  budgetAmount: '',
  budgetType: '',
  interests: [],
  travelStyle: '',
  accommodation: '',
  transportation: 'no preference',
  pace: '',
  additionalRequirements: '',
};

export default function PlannerModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const updateField = (name, value) => {
    setSubmitError('');
    setForm(current => ({ ...current, [name]: value }));
    setErrors(current => {
      const next = { ...current };
      delete next[name];
      if (name === 'tripStartDate' || name === 'tripEndDate') {
        delete next.tripStartDate;
        delete next.tripEndDate;
      }
      return next;
    });
  };

  const toggleInterest = interest => {
    setForm(current => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter(item => item !== interest)
        : [...current.interests, interest],
    }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.startingLocation.trim()) nextErrors.startingLocation = 'Enter where your trip will start.';
    if (!form.destination.trim()) nextErrors.destination = 'Enter your destination.';
    if (!form.tripStartDate) nextErrors.tripStartDate = 'Choose a trip start date.';
    if (!form.tripEndDate) nextErrors.tripEndDate = 'Choose a trip end date.';
    if (form.tripStartDate && form.tripEndDate && form.tripEndDate <= form.tripStartDate) {
      nextErrors.tripEndDate = 'The end date must be after the start date.';
    }
    if (!Number.isInteger(Number(form.travelers)) || Number(form.travelers) <= 0) {
      nextErrors.travelers = 'Enter a whole traveler count greater than zero.';
    }
    if (!Number.isFinite(Number(form.budgetAmount)) || Number(form.budgetAmount) <= 0) {
      nextErrors.budgetAmount = 'Enter a budget amount greater than zero.';
    }
    if (!form.budgetType) nextErrors.budgetType = 'Choose how this budget applies.';
    return nextErrors;
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const tripDetails = {
      startingLocation: form.startingLocation.trim(),
      destination: form.destination.trim(),
      tripDates: { startDate: form.tripStartDate, endDate: form.tripEndDate },
      travelers: Number(form.travelers),
      budget: { amount: Number(form.budgetAmount), type: form.budgetType },
      preferences: {
        interests: [...form.interests],
        travelStyle: form.travelStyle || null,
        accommodation: form.accommodation || null,
        transportation: form.transportation,
        pace: form.pace || null,
      },
      additionalRequirements: form.additionalRequirements.trim(),
    };
    setSubmitError('');
    setSubmitting(true);
    try {
      await onSubmit(tripDetails);
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      setSubmitError(error.response?.data?.error || 'We couldn’t save your trip details. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const errorFor = name => errors[name] && <span className="planner-field-error" id={`${name}-error`} role="alert">{errors[name]}</span>;
  const describedBy = name => errors[name] ? `${name}-error` : undefined;

  return <AnimatePresence>{open && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.div className="planner-modal" initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14 }} transition={motionTransition} onClick={event => event.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label="Close planner"><X size={18} /></button>
      <div className="modal-eyebrow"><Sparkles size={14} /> YOUR PERSONAL GOA PLANNER</div>
      <h2>Let’s make a little<br /><em>room for Goa.</em></h2>
      <p className="modal-intro">Share a few details and preferences for your trip.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="planner-fields">
          <label className="field"><span>STARTING LOCATION <i>*</i></span><div className={`input-with-icon ${errors.startingLocation ? 'has-error' : ''}`}><MapPin size={16} /><input value={form.startingLocation} onChange={event => updateField('startingLocation', event.target.value)} placeholder="City or airport" aria-invalid={Boolean(errors.startingLocation)} aria-describedby={describedBy('startingLocation')} /></div>{errorFor('startingLocation')}</label>
          <label className="field"><span>DESTINATION <i>*</i></span><div className={`input-with-icon ${errors.destination ? 'has-error' : ''}`}><MapPin size={16} /><input value={form.destination} onChange={event => updateField('destination', event.target.value)} placeholder="Where would you like to go?" aria-invalid={Boolean(errors.destination)} aria-describedby={describedBy('destination')} /></div>{errorFor('destination')}</label>

          <label className="field"><span>TRIP START DATE <i>*</i></span><div className={`input-with-icon ${errors.tripStartDate ? 'has-error' : ''}`}><CalendarDays size={16} /><input type="date" value={form.tripStartDate} onChange={event => updateField('tripStartDate', event.target.value)} aria-invalid={Boolean(errors.tripStartDate)} aria-describedby={describedBy('tripStartDate')} /></div>{errorFor('tripStartDate')}</label>
          <label className="field"><span>TRIP END DATE <i>*</i></span><div className={`input-with-icon ${errors.tripEndDate ? 'has-error' : ''}`}><CalendarDays size={16} /><input type="date" value={form.tripEndDate} min={form.tripStartDate || undefined} onChange={event => updateField('tripEndDate', event.target.value)} aria-invalid={Boolean(errors.tripEndDate)} aria-describedby={describedBy('tripEndDate')} /></div>{errorFor('tripEndDate')}</label>

          <label className="field"><span>NUMBER OF TRAVELERS <i>*</i></span><div className={`input-with-icon ${errors.travelers ? 'has-error' : ''}`}><Users size={16} /><input type="number" min="1" step="1" value={form.travelers} onChange={event => updateField('travelers', event.target.value)} placeholder="2" aria-invalid={Boolean(errors.travelers)} aria-describedby={describedBy('travelers')} /></div>{errorFor('travelers')}</label>
          <label className="field"><span>BUDGET AMOUNT <i>*</i></span><div className={`input-with-icon ${errors.budgetAmount ? 'has-error' : ''}`}><Wallet size={16} /><input type="number" min="0.01" step="any" value={form.budgetAmount} onChange={event => updateField('budgetAmount', event.target.value)} placeholder="Enter amount" aria-invalid={Boolean(errors.budgetAmount)} aria-describedby={describedBy('budgetAmount')} /></div>{errorFor('budgetAmount')}</label>

          <fieldset className="field full-field planner-choice-field"><legend>BUDGET TYPE <i>*</i></legend><div className="budget-options" role="radiogroup" aria-describedby={describedBy('budgetType')}>{[['total_group', 'Total group budget'], ['per_person', 'Per-person budget']].map(([value, label]) => <button type="button" key={value} className={form.budgetType === value ? 'on' : ''} role="radio" aria-checked={form.budgetType === value} onClick={() => updateField('budgetType', value)}>{label}</button>)}</div>{errorFor('budgetType')}</fieldset>

          <fieldset className="field full-field planner-choice-field"><legend>TRAVEL INTERESTS <small>OPTIONAL · SELECT ANY</small></legend><div className="interest-list">{interestOptions.map(interest => <button type="button" key={interest} className={form.interests.includes(interest) ? 'on' : ''} aria-pressed={form.interests.includes(interest)} onClick={() => toggleInterest(interest)}>{form.interests.includes(interest) && <Check size={12} />} {interest}</button>)}</div></fieldset>

          <label className="field"><span>TRAVEL STYLE <small>OPTIONAL</small></span><select className="planner-select" value={form.travelStyle} onChange={event => updateField('travelStyle', event.target.value)}><option value="">Choose a style</option><option value="budget-friendly">Budget-friendly</option><option value="balanced">Balanced</option><option value="luxury">Luxury</option></select></label>
          <label className="field"><span>ACCOMMODATION <small>OPTIONAL</small></span><select className="planner-select" value={form.accommodation} onChange={event => updateField('accommodation', event.target.value)}><option value="">Choose accommodation</option><option value="hostel">Hostel</option><option value="hotel">Hotel</option><option value="resort">Resort</option><option value="homestay">Homestay</option></select></label>
          <label className="field"><span>TRANSPORTATION <small>OPTIONAL</small></span><select className="planner-select" value={form.transportation} onChange={event => updateField('transportation', event.target.value)}><option value="no preference">No preference</option><option value="bus">Bus</option><option value="train">Train</option><option value="flight">Flight</option><option value="self-drive">Self-drive</option></select></label>
          <label className="field"><span>TRAVEL PACE <small>OPTIONAL</small></span><select className="planner-select" value={form.pace} onChange={event => updateField('pace', event.target.value)}><option value="">Choose a pace</option><option value="relaxed">Relaxed</option><option value="moderate">Moderate</option><option value="packed">Packed</option></select></label>
          <label className="field full-field"><span>ADDITIONAL REQUIREMENTS <small>OPTIONAL</small></span><textarea className="planner-textarea" value={form.additionalRequirements} onChange={event => updateField('additionalRequirements', event.target.value)} placeholder="Anything else we should know?" rows="3" /></label>
        </div>
        {submitError && <p className="planner-submit-error" role="alert">{submitError}</p>}
        <button className="btn btn-orange modal-submit" type="submit" disabled={submitting}><Sparkles size={16} /> {submitting ? 'Saving your trip…' : 'Make My Trip'} <ArrowRight size={16} /></button>
        <div className="modal-foot">Your trip details are saved to your account · No AI call is made</div>
      </form>
    </motion.div>
  </motion.div>}</AnimatePresence>;
}

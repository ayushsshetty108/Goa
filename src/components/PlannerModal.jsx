import { CalendarDays, Check, Minus, Plus, Sparkles, X, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { motionTransition } from '../data/goa';

const interestOptions = ['Beach', 'Food', 'Adventure', 'Culture', 'Nightlife', 'Churches'];
const budgets = ['Easy', 'Comfort', 'Treat me'];

export default function PlannerModal({ open, travelDate, onTravelDateChange, days, onDaysChange, travelers, onTravelersChange, interests, onToggleInterest, budget, onBudgetChange, onClose, onGenerate }) {
  return <AnimatePresence>{open && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.div className="planner-modal" initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14 }} transition={motionTransition} onClick={event => event.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label="Close planner"><X size={18} /></button><div className="modal-eyebrow"><Sparkles size={14} /> YOUR PERSONAL GOA PLANNER</div><h2>Let’s make a little<br /><em>room for Goa.</em></h2><p className="modal-intro">A few details help us make the trip feel more like you.</p>
      <div className="planner-fields">
        <label className="field"><span>WHEN ARE YOU GOING?</span><div className="input-with-icon"><CalendarDays size={16} /><input type="date" value={travelDate} onChange={event => onTravelDateChange(event.target.value)} /></div></label>
        <label className="field"><span>HOW LONG?</span><div className="stepper"><button onClick={() => onDaysChange(Math.max(1, days - 1))} aria-label="Fewer days"><Minus size={14} /></button><b>{days} days</b><button onClick={() => onDaysChange(Math.min(7, days + 1))} aria-label="More days"><Plus size={14} /></button></div></label>
        <label className="field"><span>WHO’S COMING?</span><div className="stepper"><button onClick={() => onTravelersChange(Math.max(1, travelers - 1))} aria-label="Fewer travellers"><Minus size={14} /></button><b>{travelers} {travelers === 1 ? 'traveller' : 'travellers'}</b><button onClick={() => onTravelersChange(travelers + 1)} aria-label="More travellers"><Plus size={14} /></button></div></label>
        <label className="field"><span>YOUR KIND OF TRIP</span><div className="interest-list">{interestOptions.map(interest => <button type="button" key={interest} className={interests.includes(interest) ? 'on' : ''} onClick={() => onToggleInterest(interest)}>{interests.includes(interest) && <Check size={12} />} {interest}</button>)}</div></label>
        <label className="field full-field"><span>YOUR DAILY BUDGET · PER PERSON</span><div className="budget-options">{budgets.map(option => <button key={option} onClick={() => onBudgetChange(option)} className={budget === option ? 'on' : ''}>{option}</button>)}</div></label>
      </div>
      <button className="btn btn-orange modal-submit" onClick={onGenerate}><Sparkles size={16} /> Build my Goa trip <ArrowRight size={16} /></button><div className="modal-foot">Rule-based demo planner · Estimated costs, not booking prices</div>
    </motion.div>
  </motion.div>}</AnimatePresence>;
}

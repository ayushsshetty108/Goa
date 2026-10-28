import { ArrowLeft, ArrowRight, Bookmark, CalendarDays, MapPin, Sparkles, X } from 'lucide-react';
import { Pill } from './SectionHeading';

export default function ItineraryDrawer({ trip, isSaved, onClose, onSave }) {
  if (!trip) return null;
  const averageCost = trip.days?.length ? Math.round(trip.days.reduce((total, day) => total + day.estimated, 0) / trip.days.length) : 3200;

  return <div className="itinerary-drawer"><div className="drawer-top"><button onClick={onClose}><ArrowLeft size={16} /> Back to Goa</button><button className="drawer-close" onClick={onClose} aria-label="Close itinerary"><X size={17} /></button></div>
    <div className="drawer-body"><Pill className="demo-pill"><Sparkles size={12} /> MADE FOR YOUR KIND OF TRIP</Pill><h2>{trip.title}</h2><div className="trip-meta"><span><CalendarDays size={14} />{trip.dates}</span><span><MapPin size={14} />{trip.travelers} travellers</span></div>
      <div className="cost-box"><span>ESTIMATED DAILY COST</span><b>₹{averageCost.toLocaleString('en-IN')} <small>/ group</small></b><p>Includes activities, meals & local transport. Stay excluded.</p></div>
      <div className="itinerary-list">{trip.days?.map(day => <article className="itinerary-day" key={day.day}><div className="day-index">0{day.day}</div><div className="day-content"><span className="day-label">DAY {day.day} · ₹{day.estimated.toLocaleString('en-IN')} EST.</span><h3>{day.title}</h3>{day.stops.map((stop, index) => <div className="stop" key={`${stop.name}-${index}`}><div className="stop-dot" /><div><b>{stop.time} · {stop.name}</b><span>{stop.area} · ₹{stop.cost.toLocaleString('en-IN')}</span><p>{stop.note}</p></div></div>)}</div></article>)}</div>
      <button className="btn btn-orange save-trip" onClick={onSave}><Bookmark size={16} />{isSaved ? 'Trip saved to My Trips' : 'Save this trip'}<ArrowRight size={16} /></button><p className="drawer-disclaimer">Demo itinerary · Travel times and estimated costs are starting points. Please confirm details before you go.</p>
    </div>
  </div>;
}

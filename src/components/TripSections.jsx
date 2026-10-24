import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Bookmark, Check, Heart, Plus, Send, Waves, X } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { photos } from '../data/goa';

export function TripsSection({ trips, checklist, onPlan, onDeleteTrip, onToggleChecklist, onDeleteChecklist, onAddChecklist }) {
  const [newItem, setNewItem] = useState('');
  const addItem = event => {
    event.preventDefault();
    const name = newItem.trim();
    if (!name) return;
    onAddChecklist(name);
    setNewItem('');
  };

  return <section className="section trip-section" id="trips"><SectionHeading eyebrow="YOUR LITTLE CORNER OF GOA" title="Trips & little things." text="Plans you’ve saved and things you don’t want to forget." /><div className="trips-grid">
    <div className="trips-panel"><div className="panel-title"><span className="panel-icon"><Bookmark size={17} /></span><div><h3>Your saved trips</h3><span>{trips.length} {trips.length === 1 ? 'little escape' : 'little escapes'}</span></div><button onClick={onPlan} className="round-add" aria-label="Plan a trip"><Plus size={17} /></button></div>
      {trips.length ? trips.map(trip => <div className="saved-trip" key={trip.id}><div className="trip-thumb" style={{ backgroundImage: `url(${photos.palolem})` }} /><div className="saved-trip-text"><b>{trip.title}</b><span>{trip.dates} · {trip.travelers} travellers</span></div><button onClick={onPlan}><ArrowRight size={16} /></button><button onClick={() => onDeleteTrip(trip.id)} aria-label={`Delete ${trip.title}`}><X size={15} /></button></div>) : <div className="panel-empty"><span className="empty-sun">☼</span><b>Your next story starts here.</b><p>Make a plan that feels like you. Save it for later.</p><button className="mini-cta" onClick={onPlan}>Plan a little getaway <ArrowRight size={14} /></button></div>}
    </div>
    <div className="trips-panel checklist-panel"><div className="panel-title"><span className="panel-icon peach-icon"><Check size={17} /></span><div><h3>Little things to bring</h3><span>{checklist.filter(item => item.done).length} of {checklist.length} checked off</span></div></div>
      <div className="checklist-items">{checklist.map((item, index) => <div className="check-row" key={`${item.name}-${index}`}><button className={`checkmark ${item.done ? 'checked' : ''}`} onClick={() => onToggleChecklist(index)} aria-label={`${item.done ? 'Uncheck' : 'Check'} ${item.name}`}>{item.done && <Check size={12} />}</button><span className={item.done ? 'done' : ''}>{item.name}</span><button className="delete-check" onClick={() => onDeleteChecklist(index)} aria-label={`Remove ${item.name}`}><X size={14} /></button></div>)}
        <form className="add-check" onSubmit={addItem}><input value={newItem} onChange={event => setNewItem(event.target.value)} placeholder="Add a little something…" aria-label="New checklist item" /><button aria-label="Add checklist item"><Plus size={17} /></button></form>
      </div>
    </div>
  </div></section>;
}

export function AssistantSection({ messages, chatText, thinking, onChatTextChange, onSend }) {
  return <section className="section assistant-section" id="assistant"><SectionHeading eyebrow="A FRIEND IN YOUR POCKET" title="Ask Tide anything." text="A little help with where to go, what to eat, and how to get there." /><div className="assistant-layout">
    <div className="assistant-copy"><div className="assistant-avatar"><Waves size={24} /><span /></div><span className="pill demo-pill">DEMO ASSISTANT</span><h3>Curious about<br /><em>something?</em></h3><p>Local ideas, gentle nudges, and helpful answers while you find your Goa.</p><div className="suggested"><span>TRY ASKING</span>{['What should I eat in Goa?', 'Tell me about South Goa', 'How much should I budget?'].map(question => <button onClick={() => onSend(question)} key={question}>{question}<ArrowUpRight size={14} /></button>)}</div></div>
    <div className="chat-box"><div className="chat-header"><span className="chat-live" /><div><b>Tide</b><small>Your Goa sidekick · Demo mode</small></div><span className="chat-header-spark">✦</span></div><div className="chat-messages">{messages.map((message, index) => <div className={`message ${message.from}`} key={`${message.from}-${index}`}>{message.from === 'ai' && <span className="msg-avatar"><Waves size={12} /></span>}<p>{message.text}</p></div>)}{thinking && <div className="message ai"><span className="msg-avatar"><Waves size={12} /></span><p className="typing"><i /><i /><i /></p></div>}</div>
      <form className="chat-input" onSubmit={event => { event.preventDefault(); onSend(); }}><input value={chatText} onChange={event => onChatTextChange(event.target.value)} placeholder="Ask me anything about Goa…" /><button aria-label="Send message" disabled={!chatText.trim() || thinking}><Send size={16} /></button></form><div className="chat-foot">A demo conversation · AI recommendations coming soon</div>
    </div>
  </div></section>;
}

export function ProfileSection({ favoriteCount, onPlan }) {
  return <section className="section profile-section" id="profile"><div className="profile-card"><div className="profile-avatar">A</div><div className="profile-copy"><div className="eyebrow">YOUR TRAVEL PROFILE</div><h3>Travel, the way you like it.</h3><p>Beach mornings, food adventures, a comfortable budget. We’ll remember the little things.</p></div><div className="profile-prefs"><span><Waves size={14} /> Beach person</span><span><span className="rupee">₹</span> Comfort budget</span><span><Heart size={14} /> {favoriteCount} saved {favoriteCount === 1 ? 'spot' : 'spots'}</span></div><button className="btn btn-outline" onClick={onPlan}>Update preferences <ArrowRight size={15} /></button></div></section>;
}

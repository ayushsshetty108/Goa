import { ChevronDown, Menu, Waves } from 'lucide-react';

const links = [['Home', 'home', 'home'], ['AI Planner', '', 'planner'], ['Places to Visit', 'places', 'places'], ['My Trips', 'trips', 'trips'], ['Goa Guide', 'guide', 'guide'], ['AI Assistant', 'assistant', 'assistant']];

export default function Navbar({ active, mobileMenu, labels, onNavigate, onToggleMenu }) {
  return (
    <nav className="nav-wrap">
      <button className="brand" onClick={() => onNavigate('Home')}>
        <span className="brand-mark"><Waves size={19} /></span><span>tide<span className="brand-dot">.</span></span>
      </button>
      <div className={`nav-links ${mobileMenu ? 'open' : ''}`}>
        {links.map(([name, id, key]) => <button key={name} className={active === name ? 'selected' : ''} onClick={() => onNavigate(name, id)}>{labels[key]}</button>)}
      </div>
      <button className="profile-button" onClick={() => onNavigate('Profile')}><span className="avatar">A</span><span>{labels.profile}</span><ChevronDown size={14} /></button>
      <button className="mobile-toggle" onClick={onToggleMenu} aria-label="Toggle navigation"><Menu /></button>
    </nav>
  );
}

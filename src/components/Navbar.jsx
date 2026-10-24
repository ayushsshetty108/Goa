import { ChevronDown, Menu, Waves } from 'lucide-react';

const links = [['Home', 'home'], ['AI Planner', ''], ['Places to Visit', 'places'], ['My Trips', 'trips'], ['Goa Guide', 'guide'], ['AI Assistant', 'assistant']];

export default function Navbar({ active, mobileMenu, onNavigate, onToggleMenu }) {
  return (
    <nav className="nav-wrap">
      <button className="brand" onClick={() => onNavigate('Home')}>
        <span className="brand-mark"><Waves size={19} /></span><span>tide<span className="brand-dot">.</span></span>
      </button>
      <div className={`nav-links ${mobileMenu ? 'open' : ''}`}>
        {links.map(([name, id]) => <button key={name} className={active === name ? 'selected' : ''} onClick={() => onNavigate(name, id)}>{name}</button>)}
      </div>
      <button className="profile-button" onClick={() => onNavigate('Profile')}><span className="avatar">A</span><span>My space</span><ChevronDown size={14} /></button>
      <button className="mobile-toggle" onClick={onToggleMenu} aria-label="Toggle navigation"><Menu /></button>
    </nav>
  );
}

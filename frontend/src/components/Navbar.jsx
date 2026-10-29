import { ChevronDown, LogOut, Menu, Waves } from 'lucide-react';
import { useState } from 'react';

const links = [['Home', 'home', 'home'], ['AI Planner', '', 'planner'], ['Places to Visit', 'places', 'places'], ['My Trips', 'trips', 'trips'], ['Goa Guide', 'guide', 'guide'], ['AI Assistant', 'assistant', 'assistant']];

export default function Navbar({ active, mobileMenu, labels, user, onSignOut, onNavigate, onToggleMenu }) {
  const [accountOpen, setAccountOpen] = useState(false);
  return (
    <nav className="nav-wrap">
      <button className="brand" onClick={() => onNavigate('Home')}>
        <span className="brand-mark"><Waves size={19} /></span><span>tide<span className="brand-dot">.</span></span>
      </button>
      <div className={`nav-links ${mobileMenu ? 'open' : ''}`}>
        {links.map(([name, id, key]) => <button key={name} className={active === name ? 'selected' : ''} onClick={() => onNavigate(name, id)}>{labels[key]}</button>)}
      </div>
      <div className="account-menu-wrap">
        <button className="profile-button" aria-expanded={accountOpen} onClick={() => setAccountOpen(open => !open)}><span className="avatar">{(user?.name || user?.email || 'T').slice(0, 1).toUpperCase()}</span><span>{labels.profile}</span><ChevronDown size={14} /></button>
        {accountOpen && <div className="account-popover"><b>{user?.name || 'Your Tide account'}</b><span>{user?.email}</span><button onClick={() => { setAccountOpen(false); onNavigate('Profile'); }}><span>Travel profile</span></button><button className="account-signout" onClick={onSignOut}><LogOut size={15} /> Sign out</button></div>}
      </div>
      <button className="mobile-toggle" onClick={onToggleMenu} aria-label="Toggle navigation"><Menu /></button>
    </nav>
  );
}

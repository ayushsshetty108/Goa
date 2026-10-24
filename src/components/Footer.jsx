import { Waves } from 'lucide-react';

export default function Footer({ onNavigate, onPlan }) {
  return <footer><div className="footer-main"><button className="brand footer-brand" onClick={() => onNavigate('Home')}><span className="brand-mark"><Waves size={19} /></span><span>tide<span className="brand-dot">.</span></span></button><p>Go a little slower.<br />Go a little further.</p><div className="footer-links"><button onClick={() => onNavigate('Goa Guide', 'guide')}>The Goa guide</button><button onClick={onPlan}>Plan with Tide</button><button onClick={() => onNavigate('My Trips', 'trips')}>Your saved trips</button></div><div className="footer-coordinate">15.2993° N<br />74.1240° E</div></div><div className="footer-bottom"><span>Made for the long way round. © Tide 2026</span><span><span className="live-dot" /> Demo experience · Nothing bookable just yet</span><span>Made with a little sea air <span className="footer-heart">♥</span></span></div></footer>;
}

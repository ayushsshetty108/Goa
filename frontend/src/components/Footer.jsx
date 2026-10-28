import { Waves } from 'lucide-react';

export default function Footer({ content, onNavigate, onPlan, onAdmin }) {
  const [firstLine, secondLine = ''] = content.saying.split('|');
  const [lat, lon] = content.coordinate.split('|');
  return <footer><div className="footer-main"><button className="brand footer-brand" onClick={() => onNavigate('Home')}><span className="brand-mark"><Waves size={19} /></span><span>tide<span className="brand-dot">.</span></span></button><p>{firstLine}<br />{secondLine}</p><div className="footer-links"><button onClick={() => onNavigate('Goa Guide', 'guide')}>The Goa guide</button><button onClick={onPlan}>Plan with Tide</button><button onClick={() => onNavigate('My Trips', 'trips')}>Your saved trips</button><button onClick={onAdmin}>Admin</button></div><div className="footer-coordinate">{lat}<br />{lon}</div></div><div className="footer-bottom"><span>{content.note}</span><span><span className="live-dot" /> Demo experience · Nothing bookable just yet</span><span>Made with a little sea air <span className="footer-heart">♥</span></span></div></footer>;
}

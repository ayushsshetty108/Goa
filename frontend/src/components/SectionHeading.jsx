import { ArrowRight } from 'lucide-react';

export function Pill({ children, className = '' }) {
  return <span className={`pill ${className}`}>{children}</span>;
}

export default function SectionHeading({ eyebrow, title, text, action, onAction }) {
  return (
    <div className="section-head">
      <div>
        <div className="eyebrow"><span />{eyebrow}</div>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {action && <button className="text-link" onClick={onAction}>{action}<ArrowRight size={16} /></button>}
    </div>
  );
}

import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, Compass, Heart, MapPin, Plane, Plus, Sparkles, Sun } from 'lucide-react';
import SectionHeading, { Pill } from './SectionHeading';
import { deals, destinationFilters, motionTransition, photos } from '../data/goa';

export function HeroSection({ content, labels, onPlan, onExplore }) {
  const [firstLine, secondLine = ''] = content.title.split('|');
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-photo" style={{ backgroundImage: `url(${content.image})` }} /><div className="hero-shade" />
        <div className="hero-content"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={motionTransition}>
          <Pill className="hero-tag"><span className="tiny-sun">✳</span> {content.tag}</Pill><h1>{firstLine}<br /><em>{secondLine}</em></h1>
          <p className="hero-copy">{content.description}</p>
          <div className="hero-buttons"><button className="btn btn-orange" onClick={onPlan}><Sparkles size={16} /> {labels.heroPlan} <ArrowRight size={16} /></button><button className="btn btn-glass" onClick={onExplore}>{labels.heroExplore} <ArrowDown size={15} /></button></div>
        </motion.div></div>
        <div className="hero-note"><span className="note-icon"><MapPin size={14} /></span><span><b>15°29′ N, 73°49′ E</b><small>Somewhere along the Konkan coast</small></span></div>
        <div className="hero-count"><span>01</span><i />03</div><div className="hero-caption">GOA, INDIA · 2026</div>
      </section>
      <div className="trust-row"><span><span className="wave-dot">●</span> Your trip, your pace</span><span>✳&nbsp; Thoughtfully planned, never overplanned</span><span>↗&nbsp; Good ideas. No booking pressure.</span></div>
    </>
  );
}

export function DealsSection({ deals, copy, onExplore }) {
  const icons = { Plane, Sun, Compass };
  return <section className="section deals-section" id="deals">
    <SectionHeading {...copy} onAction={onExplore} />
    <div className="deal-grid">{deals.map((deal, index) => { const DealIcon = icons[deal.icon] || Compass; return <motion.article className={`deal-card ${deal.color}`} key={`${deal.title}-${index}`} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...motionTransition, delay: index * .08 }}>
      <div className="deal-top"><span className="deal-icon"><DealIcon size={17} /></span><span className="demo-tag">DEMO LISTING</span></div>{deal.image && <img className="deal-thumb" src={deal.image} alt="" />}<div><div className="deal-label">{deal.label}</div><h3>{deal.title}</h3><p>{deal.sub}</p></div><div className="deal-bottom"><b>{deal.price}</b><button aria-label="Explore listing" onClick={onExplore}><ArrowUpRight size={18} /></button></div>
    </motion.article>; })}</div><p className="demo-note">Illustrative demo listings · Prices and availability are not live</p>
  </section>;
}

export function PlacesSection({ destinations, filter, query, favorites, copy, onFilterChange, onQueryChange, onToggleFavorite, onAddToPlanner, onAddToTrip, onGuide }) {
  return <section className="section discovery" id="places">
    <SectionHeading {...copy} onAction={onGuide} />
    <div className="discovery-tools"><div className="filter-tabs">{destinationFilters.map(tab => <button onClick={() => onFilterChange(tab)} className={filter === tab ? 'active' : ''} key={tab}>{tab}</button>)}</div><label className="search-box"><span>⌕</span><input value={query} onChange={event => onQueryChange(event.target.value)} placeholder="Find your somewhere…" /><kbd>⌘ K</kbd></label></div>
    <div className="place-grid">{destinations.map((destination, index) => <motion.article key={destination.id} className="place-card" layout initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...motionTransition, delay: (index % 3) * .06 }}>
      <div className="place-img-wrap"><img src={destination.image} alt={destination.name} /><span className="place-type">{destination.type}</span><button className={`heart-button ${favorites.includes(destination.id) ? 'hearted' : ''}`} onClick={() => onToggleFavorite(destination.id)} aria-label="Toggle favorite"><Heart size={17} fill={favorites.includes(destination.id) ? 'currentColor' : 'none'} /></button></div>
      <div className="place-info"><div className="place-area"><MapPin size={12} />{destination.area}<span>·</span><b>{destination.cost}</b></div><div className="place-title"><h3>{destination.name}</h3><button title="Add to an itinerary" onClick={() => onAddToPlanner(destination)}><Plus size={17} /></button></div><p>{destination.desc}</p><button className="place-more" onClick={() => onAddToTrip(destination)}>Add to itinerary <ArrowRight size={13} /></button></div>
    </motion.article>)}</div>
    {destinations.length === 0 && <div className="empty-state"><Compass /><b>No spots found just yet.</b><span>Try another search or category.</span><button onClick={() => { onQueryChange(''); onFilterChange('All'); }}>Clear filters</button></div>}
  </section>;
}

export function GuideBanner({ content, actionLabel, onGuide }) {
  const [firstLine, secondLine = ''] = content.title.split('|');
  return <section className="section banner-section"><div className="guide-banner" style={{ backgroundImage: `linear-gradient(90deg,rgba(11,45,68,.86),rgba(11,45,68,.22)),url(${content.image})` }}><div className="banner-content"><Pill className="banner-pill">{content.tag}</Pill><h2>{firstLine}<br />{secondLine}</h2><p>{content.text}</p><button className="btn btn-light" onClick={onGuide}>{actionLabel} <ArrowRight size={15} /></button></div><div className="banner-ornament">G<span>o</span>a</div></div></section>;
}

export function GuideSection({ guide, tip, copy, onPlan }) {
  return <section className="section guide-section" id="guide"><SectionHeading {...copy} /><div className="guide-grid">
    {guide.map((card, index) => { const [firstLine, secondLine = ''] = card.title.split('|'); return <article className={`guide-card ${card.tone}`} key={`${card.region}-${index}`}><div className="guide-card-top"><Pill>{card.region}</Pill><span>{card.number}</span></div><h3>{firstLine}<br />{secondLine}</h3><p>{card.description}</p><div className="guide-tags">{card.tags.split(',').map(tag => <span key={tag}>{tag.trim()}</span>)}</div><div className={`guide-illustration ${card.tone}-art`}>{card.tone === 'north' ? '✳' : '〰'}</div></article>; })}
    <article className="tip-card"><span className="tip-spark">✦</span><div className="eyebrow">{tip.eyebrow}</div><h3>{tip.title.split('|')[0]}<br /><em>{tip.title.split('|')[1]}</em></h3><p>{tip.description}</p><button onClick={onPlan}>Make room for magic <ArrowUpRight size={15} /></button></article>
  </div></section>;
}

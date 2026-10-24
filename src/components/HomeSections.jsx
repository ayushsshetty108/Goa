import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, Compass, Heart, MapPin, Plus, Sparkles, Waves } from 'lucide-react';
import SectionHeading, { Pill } from './SectionHeading';
import { deals, destinationFilters, motionTransition, photos } from '../data/goa';

export function HeroSection({ onPlan, onExplore }) {
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-photo" style={{ backgroundImage: `url(${photos.hero})` }} /><div className="hero-shade" />
        <div className="hero-content"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={motionTransition}>
          <Pill className="hero-tag"><span className="tiny-sun">✳</span> YOUR GOA, YOUR WAY</Pill><h1>Find your kind<br />of <em>Goa.</em></h1>
          <p className="hero-copy">Salt in your hair. Nothing on your calendar.<br className="desktop" /> Let’s plan a trip that feels like yours.</p>
          <div className="hero-buttons"><button className="btn btn-orange" onClick={onPlan}><Sparkles size={16} /> Plan my trip <ArrowRight size={16} /></button><button className="btn btn-glass" onClick={onExplore}>Explore Goa <ArrowDown size={15} /></button></div>
        </motion.div></div>
        <div className="hero-note"><span className="note-icon"><MapPin size={14} /></span><span><b>15°29′ N, 73°49′ E</b><small>Somewhere along the Konkan coast</small></span></div>
        <div className="hero-count"><span>01</span><i />03</div><div className="hero-caption">GOA, INDIA · 2026</div>
      </section>
      <div className="trust-row"><span><span className="wave-dot">●</span> Your trip, your pace</span><span>✳&nbsp; Thoughtfully planned, never overplanned</span><span>↗&nbsp; Good ideas. No booking pressure.</span></div>
    </>
  );
}

export function DealsSection({ onExplore }) {
  return <section className="section deals-section" id="deals">
    <SectionHeading eyebrow="A FEW GOOD STARTS" title="The trip starts here." text="A little inspiration for getting to Goa, staying a while, and making the most of it." action="See all opportunities" onAction={onExplore} />
    <div className="deal-grid">{deals.map((deal, index) => <motion.article className={`deal-card ${deal.color}`} key={deal.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...motionTransition, delay: index * .08 }}>
      <div className="deal-top"><span className="deal-icon"><deal.icon size={17} /></span><span className="demo-tag">DEMO LISTING</span></div><div><div className="deal-label">{deal.label}</div><h3>{deal.title}</h3><p>{deal.sub}</p></div><div className="deal-bottom"><b>{deal.price}</b><button aria-label="Explore listing" onClick={onExplore}><ArrowUpRight size={18} /></button></div>
    </motion.article>)}</div><p className="demo-note">Illustrative demo listings · Prices and availability are not live</p>
  </section>;
}

export function PlacesSection({ destinations, filter, query, favorites, onFilterChange, onQueryChange, onToggleFavorite, onAddToPlanner, onAddToTrip, onGuide }) {
  return <section className="section discovery" id="places">
    <SectionHeading eyebrow="GO WHERE THE DAY TAKES YOU" title="A little bit of everything." text="From slow mornings by the sea to nights that run a little late. Save a spot, or add it to your plan." action="View the Goa guide" onAction={onGuide} />
    <div className="discovery-tools"><div className="filter-tabs">{destinationFilters.map(tab => <button onClick={() => onFilterChange(tab)} className={filter === tab ? 'active' : ''} key={tab}>{tab}</button>)}</div><label className="search-box"><span>⌕</span><input value={query} onChange={event => onQueryChange(event.target.value)} placeholder="Find your somewhere…" /><kbd>⌘ K</kbd></label></div>
    <div className="place-grid">{destinations.map((destination, index) => <motion.article key={destination.id} className="place-card" layout initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...motionTransition, delay: (index % 3) * .06 }}>
      <div className="place-img-wrap"><img src={destination.image} alt={destination.name} /><span className="place-type">{destination.type}</span><button className={`heart-button ${favorites.includes(destination.id) ? 'hearted' : ''}`} onClick={() => onToggleFavorite(destination.id)} aria-label="Toggle favorite"><Heart size={17} fill={favorites.includes(destination.id) ? 'currentColor' : 'none'} /></button></div>
      <div className="place-info"><div className="place-area"><MapPin size={12} />{destination.area}<span>·</span><b>{destination.cost}</b></div><div className="place-title"><h3>{destination.name}</h3><button title="Add to an itinerary" onClick={() => onAddToPlanner(destination)}><Plus size={17} /></button></div><p>{destination.desc}</p><button className="place-more" onClick={() => onAddToTrip(destination)}>Add to itinerary <ArrowRight size={13} /></button></div>
    </motion.article>)}</div>
    {destinations.length === 0 && <div className="empty-state"><Compass /><b>No spots found just yet.</b><span>Try another search or category.</span><button onClick={() => { onQueryChange(''); onFilterChange('All'); }}>Clear filters</button></div>}
  </section>;
}

export function GuideBanner({ onGuide }) {
  return <section className="section banner-section"><div className="guide-banner" style={{ backgroundImage: `linear-gradient(90deg,rgba(11,45,68,.86),rgba(11,45,68,.22)),url(${photos.coast})` }}><div className="banner-content"><Pill className="banner-pill">A QUICK FIELD GUIDE</Pill><h2>Two coasts.<br />A hundred ways to slow down.</h2><p>North Goa buzzes. South Goa breathes. Here’s how to find your rhythm.</p><button className="btn btn-light" onClick={onGuide}>Find your side <ArrowRight size={15} /></button></div><div className="banner-ornament">G<span>o</span>a</div></div></section>;
}

export function GuideSection({ onPlan }) {
  return <section className="section guide-section" id="guide"><SectionHeading eyebrow="A NOTE BEFORE YOU GO" title="A little local know-how." text="The good stuff you wish you knew before you landed." /><div className="guide-grid">
    <article className="guide-card north"><div className="guide-card-top"><Pill>NORTH GOA</Pill><span>01 — 04</span></div><h3>For the curious<br />and the curious-at-night.</h3><p>Beach shacks, flea markets, old forts, late dinners. A little more buzz, a lot of personality.</p><div className="guide-tags"><span>Anjuna</span><span>Assagao</span><span>Vagator</span><span>Morjim</span></div><div className="guide-illustration north-art">✳</div></article>
    <article className="guide-card south"><div className="guide-card-top"><Pill>SOUTH GOA</Pill><span>05 — 08</span></div><h3>For the slow days<br />you’ll want to keep.</h3><p>Long beaches, palm shade, a good book. The kind of quiet that makes another day feel easy.</p><div className="guide-tags"><span>Palolem</span><span>Agonda</span><span>Cola</span><span>Patnem</span></div><div className="guide-illustration south-art">〰</div></article>
    <article className="tip-card"><span className="tip-spark">✦</span><div className="eyebrow">ONE LAST THING</div><h3>Go a little slower.<br /><em>Go a little further.</em></h3><p>Leave room for the place you stumble into. Those are usually the stories you bring home.</p><button onClick={onPlan}>Make room for magic <ArrowUpRight size={15} /></button></article>
  </div></section>;
}

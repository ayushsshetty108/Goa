import { useEffect, useMemo, useState } from 'react';
import { createItinerary, getAssistantReply } from './services/ai';
import { destinations } from './data/goa';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PlannerModal from './components/PlannerModal';
import ItineraryDrawer from './components/ItineraryDrawer';
import { HeroSection, DealsSection, PlacesSection, GuideBanner, GuideSection } from './components/HomeSections';
import { TripsSection, AssistantSection, ProfileSection } from './components/TripSections';

function readStoredValue(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [active, setActive] = useState('Home');
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState([2]);
  const [trips, setTrips] = useState(() => readStoredValue('tideTrips', []));
  const [checklist, setChecklist] = useState(() => readStoredValue('tideList', [
    { name: 'Sunscreen', done: false }, { name: 'Swimwear', done: false }, { name: 'Light layers', done: true },
  ]));
  const [showPlanner, setShowPlanner] = useState(false);
  const [trip, setTrip] = useState(null);
  const [days, setDays] = useState(4);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState('Comfort');
  const [travelDate, setTravelDate] = useState('2026-12-12');
  const [interests, setInterests] = useState(['Beach', 'Food']);
  const [messages, setMessages] = useState([{ from: 'ai', text: 'Hey, I’m Tide. Tell me what kind of Goa you’re dreaming of. 🌴' }]);
  const [chatText, setChatText] = useState('');
  const [thinking, setThinking] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => localStorage.setItem('tideTrips', JSON.stringify(trips)), [trips]);
  useEffect(() => localStorage.setItem('tideList', JSON.stringify(checklist)), [checklist]);

  const filteredDestinations = useMemo(() => destinations.filter(destination =>
    (filter === 'All' || destination.type === filter) &&
    `${destination.name} ${destination.area} ${destination.type}`.toLowerCase().includes(query.toLowerCase()),
  ), [filter, query]);

  const navigate = (name, id) => {
    setActive(name);
    setMobileMenu(false);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    else if (name === 'AI Planner') setShowPlanner(true);
    else if (name === 'AI Assistant') document.getElementById('assistant')?.scrollIntoView({ behavior: 'smooth' });
    else if (name === 'My Trips') document.getElementById('trips')?.scrollIntoView({ behavior: 'smooth' });
    else if (name === 'Profile') document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' });
    else document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateItinerary = () => {
    const plan = {
      id: Date.now(), title: `${days} days of Goa`,
      dates: `${new Date(`${travelDate}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · Goa`,
      days: createItinerary({ days, travelers, interests, budget }), budget, travelers,
    };
    setTrip(plan);
    setShowPlanner(false);
    setActive('AI Planner');
  };

  const saveTrip = () => {
    if (trip && !trips.some(savedTrip => savedTrip.id === trip.id)) setTrips(current => [trip, ...current]);
  };

  const sendMessage = async (text = chatText) => {
    if (!text.trim() || thinking) return;
    const userText = text.trim();
    setMessages(current => [...current, { from: 'user', text: userText }]);
    setChatText('');
    setThinking(true);
    const reply = await getAssistantReply(userText);
    setMessages(current => [...current, { from: 'ai', text: reply }]);
    setThinking(false);
  };

  const toggleInterest = interest => setInterests(current => current.includes(interest)
    ? current.filter(item => item !== interest)
    : [...current, interest]);

  const addDestinationToPlanner = destination => {
    setInterests(current => [...new Set([...current, destination.type])]);
    setShowPlanner(true);
  };

  const addDestinationToTrip = destination => {
    setTrip({
      id: Date.now(), title: `${destination.name} day idea`, dates: destination.area,
      days: createItinerary({ days: 1, travelers, interests: [destination.type], budget }), budget, travelers,
    });
    setActive('AI Planner');
  };

  return (
    <div className="app-shell">
      <Navbar active={active} mobileMenu={mobileMenu} onNavigate={navigate} onToggleMenu={() => setMobileMenu(open => !open)} />
      <main>
        <HeroSection onPlan={() => setShowPlanner(true)} onExplore={() => navigate('Places to Visit', 'places')} />
        <DealsSection onExplore={() => navigate('Places to Visit', 'places')} />
        <PlacesSection
          destinations={filteredDestinations} filter={filter} query={query} favorites={favorites}
          onFilterChange={setFilter} onQueryChange={setQuery}
          onToggleFavorite={id => setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])}
          onAddToPlanner={addDestinationToPlanner} onAddToTrip={addDestinationToTrip}
          onGuide={() => navigate('Goa Guide', 'guide')}
        />
        <GuideBanner onGuide={() => navigate('Goa Guide', 'guide')} />
        <GuideSection onPlan={() => setShowPlanner(true)} />
        <TripsSection
          trips={trips} checklist={checklist} onPlan={() => setShowPlanner(true)}
          onDeleteTrip={id => setTrips(current => current.filter(savedTrip => savedTrip.id !== id))}
          onToggleChecklist={index => setChecklist(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, done: !item.done } : item))}
          onDeleteChecklist={index => setChecklist(current => current.filter((_, itemIndex) => itemIndex !== index))}
          onAddChecklist={name => setChecklist(current => [...current, { name, done: false }])}
        />
        <AssistantSection messages={messages} chatText={chatText} thinking={thinking} onChatTextChange={setChatText} onSend={sendMessage} />
        <ProfileSection favoriteCount={favorites.length} onPlan={() => setShowPlanner(true)} />
      </main>
      <Footer onNavigate={navigate} onPlan={() => setShowPlanner(true)} />
      <PlannerModal
        open={showPlanner} travelDate={travelDate} onTravelDateChange={setTravelDate}
        days={days} onDaysChange={setDays} travelers={travelers} onTravelersChange={setTravelers}
        interests={interests} onToggleInterest={toggleInterest} budget={budget} onBudgetChange={setBudget}
        onClose={() => setShowPlanner(false)} onGenerate={generateItinerary}
      />
      <ItineraryDrawer trip={trip && !showPlanner ? trip : null} isSaved={Boolean(trip && trips.some(savedTrip => savedTrip.id === trip.id))} onClose={() => setTrip(null)} onSave={saveTrip} />
    </div>
  );
}

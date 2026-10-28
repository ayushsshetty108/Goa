import { useEffect, useMemo, useRef, useState } from 'react';
import { createItinerary, getAssistantReply } from './services/ai';
import { api } from './services/api';
import { defaultSiteContent } from './data/goa';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PlannerModal from './components/PlannerModal';
import ItineraryDrawer from './components/ItineraryDrawer';
import { HeroSection, DealsSection, PlacesSection, GuideBanner, GuideSection } from './components/HomeSections';
import { TripsSection, AssistantSection, ProfileSection } from './components/TripSections';
import AdminPage from './components/AdminPage';

function readStoredValue(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readSiteContent() {
  const saved = readStoredValue('tideSiteContent', {});
  return {
    ...defaultSiteContent, ...saved,
    hero: { ...defaultSiteContent.hero, ...saved.hero },
    banner: { ...defaultSiteContent.banner, ...saved.banner },
    tip: { ...defaultSiteContent.tip, ...saved.tip },
    profile: { ...defaultSiteContent.profile, ...saved.profile },
    footer: { ...defaultSiteContent.footer, ...saved.footer },
    copy: Object.fromEntries(Object.keys(defaultSiteContent.copy).map(key => [key, { ...defaultSiteContent.copy[key], ...saved.copy?.[key] }])),
    ui: { ...defaultSiteContent.ui, ...saved.ui, navigation: { ...defaultSiteContent.ui.navigation, ...saved.ui?.navigation } },
    deals: Array.isArray(saved.deals) ? saved.deals : defaultSiteContent.deals,
    destinations: Array.isArray(saved.destinations) ? saved.destinations : defaultSiteContent.destinations,
    guide: Array.isArray(saved.guide) ? saved.guide : defaultSiteContent.guide,
  };
}

export default function App() {
  const [active, setActive] = useState('Home');
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState(() => readStoredValue('tideFavorites', [2]));
  const [favoriteRecords, setFavoriteRecords] = useState([]);
  const [trips, setTrips] = useState(() => readStoredValue('tideTrips', []));
  const [checklist, setChecklist] = useState(() => readStoredValue('tideList', [
    { name: 'Sunscreen', done: false }, { name: 'Swimwear', done: false }, { name: 'Light layers', done: true },
  ]));
  const [showPlanner, setShowPlanner] = useState(false);
  const [trip, setTrip] = useState(null);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState('Comfort');
  const [interests, setInterests] = useState(['Beach', 'Food']);
  const [messages, setMessages] = useState([{ from: 'ai', text: 'Hey, I’m Tide. Tell me what kind of Goa you’re dreaming of. 🌴' }]);
  const [chatText, setChatText] = useState('');
  const [thinking, setThinking] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [siteContent, setSiteContent] = useState(readSiteContent);
  const apiLoadStarted = useRef(false);

  useEffect(() => localStorage.setItem('tideTrips', JSON.stringify(trips)), [trips]);
  useEffect(() => localStorage.setItem('tideList', JSON.stringify(checklist)), [checklist]);
  useEffect(() => localStorage.setItem('tideFavorites', JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem('tideSiteContent', JSON.stringify(siteContent)), [siteContent]);

  useEffect(() => {
    if (apiLoadStarted.current) return;
    apiLoadStarted.current = true;

    const loadCollections = async () => {
      const [remoteTrips, remoteChecklist, remoteFavorites] = await Promise.allSettled([
        api.get('/trips'), api.get('/checklists'), api.get('/favorites'),
      ]);

      if (remoteTrips.status === 'fulfilled') {
        const records = remoteTrips.value.data.map(record => ({ ...record, id: record.id ?? record._id }));
        if (records.length) setTrips(records);
        else {
          const local = readStoredValue('tideTrips', []);
          if (local.length) {
            const imported = await Promise.all(local.map(record => api.post('/trips', record).then(response => ({ ...response.data, id: response.data._id }))));
            setTrips(imported);
          }
        }
      }

      if (remoteChecklist.status === 'fulfilled') {
        const records = remoteChecklist.value.data;
        if (records.length) setChecklist(records);
        else {
          const local = readStoredValue('tideList', [{ name: 'Sunscreen', done: false }, { name: 'Swimwear', done: false }, { name: 'Light layers', done: true }]);
          const imported = await Promise.all(local.map(item => api.post('/checklists', item).then(response => response.data)));
          setChecklist(imported);
        }
      }

      if (remoteFavorites.status === 'fulfilled') {
        let records = remoteFavorites.value.data;
        if (!records.length) {
          const local = readStoredValue('tideFavorites', [2]);
          records = await Promise.all(local.map(destinationId => api.post('/favorites', { destinationId: String(destinationId) }).then(response => response.data)));
        }
        setFavoriteRecords(records);
        setFavorites(records.map(record => Number(record.destinationId)));
      }
    };

    loadCollections().catch(error => console.error('Could not sync Goa planner data with the API:', error));
  }, []);

  const filteredDestinations = useMemo(() => siteContent.destinations.filter(destination =>
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

  const submitTripDetails = tripDetails => {
    console.log('GoTrip AI trip request:', tripDetails);
    setShowPlanner(false);
  };

  const saveTrip = async () => {
    if (!trip || trips.some(savedTrip => savedTrip.id === trip.id || savedTrip._id === trip._id)) return;
    try {
      const response = await api.post('/trips', trip);
      const savedTrip = { ...response.data, id: response.data._id };
      setTrips(current => [savedTrip, ...current]);
      setTrip(savedTrip);
    } catch {
      setTrips(current => [trip, ...current]);
    }
  };

  const deleteTrip = async id => {
    const record = trips.find(item => item.id === id);
    setTrips(current => current.filter(item => item.id !== id));
    if (record?._id) {
      try { await api.delete(`/trips/${record._id}`); } catch (error) { console.error('Could not delete trip from the API:', error); }
    }
  };

  const addChecklistItem = async name => {
    try {
      const response = await api.post('/checklists', { name, done: false });
      setChecklist(current => [...current, response.data]);
    } catch {
      setChecklist(current => [...current, { name, done: false }]);
    }
  };

  const toggleChecklistItem = async index => {
    const item = checklist[index];
    if (!item) return;
    const updated = { ...item, done: !item.done };
    setChecklist(current => current.map((entry, itemIndex) => itemIndex === index ? updated : entry));
    if (item._id) {
      try { await api.put(`/checklists/${item._id}`, { done: updated.done }); } catch (error) { console.error('Could not update checklist item in the API:', error); }
    }
  };

  const deleteChecklistItem = async index => {
    const item = checklist[index];
    setChecklist(current => current.filter((_, itemIndex) => itemIndex !== index));
    if (item?._id) {
      try { await api.delete(`/checklists/${item._id}`); } catch (error) { console.error('Could not delete checklist item from the API:', error); }
    }
  };

  const toggleFavorite = async destinationId => {
    if (favorites.includes(destinationId)) {
      setFavorites(current => current.filter(id => id !== destinationId));
      const record = favoriteRecords.find(item => Number(item.destinationId) === destinationId);
      setFavoriteRecords(current => current.filter(item => item !== record));
      if (record?._id) {
        try { await api.delete(`/favorites/${record._id}`); } catch (error) { console.error('Could not remove favorite from the API:', error); }
      }
      return;
    }

    setFavorites(current => [...current, destinationId]);
    try {
      const response = await api.post('/favorites', { destinationId: String(destinationId) });
      setFavoriteRecords(current => [...current, response.data]);
    } catch (error) { console.error('Could not save favorite to the API:', error); }
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

  if (window.location.pathname.replace(/\/$/, '') === '/admin') {
    return <AdminPage siteContent={siteContent} onSaveContent={setSiteContent} onBackToSite={() => window.location.assign('/')} />;
  }

  return (
    <div className="app-shell">
      <Navbar active={active} mobileMenu={mobileMenu} labels={siteContent.ui.navigation} onNavigate={navigate} onToggleMenu={() => setMobileMenu(open => !open)} />
      <main>
        <HeroSection content={siteContent.hero} labels={siteContent.ui} onPlan={() => setShowPlanner(true)} onExplore={() => navigate('Places to Visit', 'places')} />
        <DealsSection deals={siteContent.deals} copy={siteContent.copy.deals} onExplore={() => navigate('Places to Visit', 'places')} />
        <PlacesSection
          destinations={filteredDestinations} filter={filter} query={query} favorites={favorites}
          onFilterChange={setFilter} onQueryChange={setQuery}
          onToggleFavorite={toggleFavorite}
          onAddToPlanner={addDestinationToPlanner} onAddToTrip={addDestinationToTrip}
          onGuide={() => navigate('Goa Guide', 'guide')} copy={siteContent.copy.destinations}
        />
        <GuideBanner content={siteContent.banner} actionLabel={siteContent.ui.bannerAction} onGuide={() => navigate('Goa Guide', 'guide')} />
        <GuideSection guide={siteContent.guide} tip={siteContent.tip} copy={siteContent.copy.guide} onPlan={() => setShowPlanner(true)} />
        <TripsSection
          trips={trips} checklist={checklist} copy={siteContent.copy.trips} onPlan={() => setShowPlanner(true)}
          onDeleteTrip={deleteTrip}
          onToggleChecklist={toggleChecklistItem}
          onDeleteChecklist={deleteChecklistItem}
          onAddChecklist={addChecklistItem}
        />
        <AssistantSection messages={messages} chatText={chatText} thinking={thinking} copy={siteContent.copy.assistant} onChatTextChange={setChatText} onSend={sendMessage} />
        <ProfileSection content={siteContent.profile} actionLabel={siteContent.ui.profileAction} favoriteCount={favorites.length} onPlan={() => setShowPlanner(true)} />
      </main>
      <Footer content={siteContent.footer} onNavigate={navigate} onPlan={() => setShowPlanner(true)} onAdmin={() => window.location.assign('/admin')} />
      <PlannerModal
        open={showPlanner}
        onClose={() => setShowPlanner(false)}
        onSubmit={submitTripDetails}
      />
      <ItineraryDrawer trip={trip && !showPlanner ? trip : null} isSaved={Boolean(trip && trips.some(savedTrip => savedTrip.id === trip.id))} onClose={() => setTrip(null)} onSave={saveTrip} />
    </div>
  );
}

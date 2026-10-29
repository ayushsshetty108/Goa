import { useEffect, useMemo, useRef, useState } from 'react';
import { Waves } from 'lucide-react';
import { createItinerary, getAssistantReply } from './services/ai';
import { api } from './services/api';
import { supabase } from '../lib/supabaseClient';
import { defaultSiteContent } from './data/goa';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PlannerModal from './components/PlannerModal';
import ItineraryDrawer from './components/ItineraryDrawer';
import { HeroSection, DealsSection, PlacesSection, GuideBanner, GuideSection } from './components/HomeSections';
import { TripsSection, AssistantSection, ProfileSection } from './components/TripSections';
import AdminPage from './components/AdminPage';
import AuthScreen from './components/AuthScreen';

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
  const [authSession, setAuthSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [active, setActive] = useState('Home');
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [favoriteRecords, setFavoriteRecords] = useState([]);
  const [trips, setTrips] = useState([]);
  const [checklist, setChecklist] = useState([]);
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

  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return undefined; }
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('Could not restore the Supabase session:', error.message);
      setAuthSession(data?.session ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authSession?.access_token) api.defaults.headers.common.Authorization = `Bearer ${authSession.access_token}`;
    else delete api.defaults.headers.common.Authorization;
  }, [authSession?.access_token]);

  useEffect(() => localStorage.setItem('tideSiteContent', JSON.stringify(siteContent)), [siteContent]);

  useEffect(() => {
    if (!authSession?.user?.id) {
      apiLoadStarted.current = false;
      setTrips([]);
      setChecklist([]);
      setFavorites([]);
      setFavoriteRecords([]);
      setMessages([{ from: 'ai', text: 'Hey, I’m Tide. Tell me what kind of Goa you’re dreaming of. 🌴' }]);
      return undefined;
    }
    if (apiLoadStarted.current) return undefined;
    apiLoadStarted.current = true;
    let cancelled = false;

    const loadCollections = async () => {
      await api.get('/me');
      const [remoteTrips, remoteChecklist, remoteFavorites, remoteMessages] = await Promise.allSettled([
        api.get('/trips'), api.get('/checklists'), api.get('/favorites'), api.get('/messages'),
      ]);

      if (cancelled) return;
      if (remoteTrips.status === 'fulfilled') {
        const records = remoteTrips.value.data.map(record => ({ ...record, id: record.id ?? record._id }));
        setTrips(records);
      }

      if (remoteChecklist.status === 'fulfilled') {
        setChecklist(remoteChecklist.value.data);
      }

      if (remoteFavorites.status === 'fulfilled') {
        const records = remoteFavorites.value.data;
        setFavoriteRecords(records);
        setFavorites(records.map(record => Number(record.destinationId)));
      }
      if (remoteMessages.status === 'fulfilled' && remoteMessages.value.data.length) {
        setMessages(remoteMessages.value.data.map(message => ({ from: message.role === 'assistant' ? 'ai' : 'user', text: message.content })));
      }
    };

    loadCollections().catch(error => console.error('Could not load this account’s Goa planner data:', error));
    return () => { cancelled = true; };
  }, [authSession?.user?.id]);

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

  const submitTripDetails = async tripDetails => {
    await api.post('/trip-requests', tripDetails);
    setShowPlanner(false);
  };

  const saveTrip = async () => {
    if (!trip || trips.some(savedTrip => savedTrip.id === trip.id || savedTrip._id === trip._id)) return;
    try {
      const response = await api.post('/trips', trip);
      const savedTrip = { ...response.data, id: response.data._id };
      setTrips(current => [savedTrip, ...current]);
      setTrip(savedTrip);
    } catch (error) {
      console.error('Could not save this trip to your account:', error);
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
    } catch (error) {
      console.error('Could not save this checklist item to your account:', error);
    }
  };

  const toggleChecklistItem = async index => {
    const item = checklist[index];
    if (!item) return;
    const updated = { ...item, done: !item.done };
    if (item._id) {
      try {
        const response = await api.put(`/checklists/${item._id}`, { done: updated.done });
        setChecklist(current => current.map((entry, itemIndex) => itemIndex === index ? response.data : entry));
      } catch (error) { console.error('Could not update checklist item in the API:', error); }
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
      const record = favoriteRecords.find(item => Number(item.destinationId) === destinationId);
      if (record?._id) {
        try {
          await api.delete(`/favorites/${record._id}`);
          setFavoriteRecords(current => current.filter(item => item._id !== record._id));
          setFavorites(current => current.filter(id => id !== destinationId));
        } catch (error) { console.error('Could not remove favorite from the API:', error); }
      }
      return;
    }

    try {
      const response = await api.post('/favorites', { destinationId: String(destinationId) });
      setFavoriteRecords(current => [...current, response.data]);
      setFavorites(current => [...current, destinationId]);
    } catch (error) { console.error('Could not save favorite to the API:', error); }
  };

  const sendMessage = async (text = chatText) => {
    if (!text.trim() || thinking) return;
    const userText = text.trim();
    setMessages(current => [...current, { from: 'user', text: userText }]);
    setChatText('');
    setThinking(true);
    try {
      await api.post('/messages', { role: 'user', content: userText });
    } catch (error) {
      setThinking(false);
      console.error('Could not save your message to your account:', error);
      return;
    }
    const reply = await getAssistantReply(userText);
    setMessages(current => [...current, { from: 'ai', text: reply }]);
    try { await api.post('/messages', { role: 'assistant', content: reply }); }
    catch (error) { console.error('Could not save the assistant reply to your account:', error); }
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

  if (authLoading) return <main className="auth-loading"><span className="brand-mark"><Waves /></span><p>Finding your place by the sea…</p></main>;
  if (!authSession) return <AuthScreen />;

  const account = authSession.user;
  const accountName = account.user_metadata?.full_name || account.user_metadata?.name || account.email;
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Could not sign out:', error.message);
  };

  return (
    <div className="app-shell">
      <Navbar active={active} mobileMenu={mobileMenu} labels={siteContent.ui.navigation} user={{ email: account.email, name: accountName }} onSignOut={signOut} onNavigate={navigate} onToggleMenu={() => setMobileMenu(open => !open)} />
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

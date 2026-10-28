export const photos = {
  hero: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1900&q=90',
  palolem: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=85',
  chapora: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=85',
  fontainhas: 'https://images.unsplash.com/photo-1590050752117-23a9d7fc9bcf?auto=format&fit=crop&w=900&q=85',
  dudhsagar: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=900&q=85',
  food: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
  stay: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=85',
  coast: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85',
};

export const destinations = [
  { id: 1, name: 'Palolem Beach', area: 'Canacona · South Goa', type: 'Beach', cost: 'Free', image: photos.palolem, desc: 'A crescent of calm, clear water and palms. South Goa at its most unhurried.' },
  { id: 2, name: 'Chapora Fort', area: 'Vagator · North Goa', type: 'Heritage', cost: 'Free', image: photos.chapora, desc: 'Laterite walls, river views and one of Goa’s loveliest golden-hour walks.' },
  { id: 3, name: 'Fontainhas', area: 'Panjim · Central Goa', type: 'Culture', cost: '₹', image: photos.fontainhas, desc: 'A living Latin Quarter of colour-washed homes, cafés and small discoveries.' },
  { id: 4, name: 'Dudhsagar Falls', area: 'Mollem · East Goa', type: 'Adventure', cost: '₹₹', image: photos.dudhsagar, desc: 'A dramatic four-tier cascade in a green, forested pocket of the Western Ghats.' },
  { id: 5, name: 'Goan Fish Thali', area: 'Panjim · Central Goa', type: 'Food', cost: '₹₹', image: photos.food, desc: 'A table-full of local flavours, kokum, curry and the catch of the day.' },
  { id: 6, name: 'A quiet beach stay', area: 'Agonda · South Goa', type: 'Stay', cost: '₹₹₹', image: photos.stay, desc: 'Wake to the sound of the sea, with nowhere you need to be.' },
];

export const deals = [
  { icon: 'Plane', label: 'FLIGHT FIND', title: 'Bengaluru → Goa', sub: 'Non-stop · 1h 20m', price: 'from ₹3,499', color: 'sky', image: '' },
  { icon: 'Sun', label: 'STAY A LITTLE LONGER', title: 'Beachside boutique stays', sub: 'North & South Goa · 2 nights', price: 'from ₹4,200 / night', color: 'peach', image: '' },
  { icon: 'Compass', label: 'DO SOMETHING DIFFERENT', title: 'Spice farm & village lunch', sub: 'Half day · Ponda', price: 'from ₹1,250 / person', color: 'mint', image: '' },
];

export const destinationFilters = ['All', 'Beach', 'Culture', 'Adventure', 'Food', 'Stay'];
export const motionTransition = { duration: .42, ease: [0.22, 1, .36, 1] };

export const defaultSiteContent = {
  hero: { tag: 'YOUR GOA, YOUR WAY', title: 'Find your kind|of Goa.', description: 'Salt in your hair. Nothing on your calendar. Let’s plan a trip that feels like yours.', image: photos.hero },
  deals,
  destinations,
  banner: { tag: 'A QUICK FIELD GUIDE', title: 'Two coasts.|A hundred ways to slow down.', text: 'North Goa buzzes. South Goa breathes. Here’s how to find your rhythm.', image: photos.coast },
  guide: [
    { region: 'NORTH GOA', number: '01 — 04', title: 'For the curious|and the curious-at-night.', description: 'Beach shacks, flea markets, old forts, late dinners. A little more buzz, a lot of personality.', tags: 'Anjuna, Assagao, Vagator, Morjim', tone: 'north' },
    { region: 'SOUTH GOA', number: '05 — 08', title: 'For the slow days|you’ll want to keep.', description: 'Long beaches, palm shade, a good book. The kind of quiet that makes another day feel easy.', tags: 'Palolem, Agonda, Cola, Patnem', tone: 'south' },
  ],
  tip: { eyebrow: 'ONE LAST THING', title: 'Go a little slower.|Go a little further.', description: 'Leave room for the place you stumble into. Those are usually the stories you bring home.' },
  profile: { title: 'Travel, the way you like it.', description: 'Beach mornings, food adventures, a comfortable budget. We’ll remember the little things.', preference: 'Beach person', budget: 'Comfort budget' },
  footer: { saying: 'Go a little slower.|Go a little further.', coordinate: '15.2993° N|74.1240° E', note: 'Made for the long way round. © Tide 2026' },
  copy: {
    deals: { eyebrow: 'A FEW GOOD STARTS', title: 'The trip starts here.', text: 'A little inspiration for getting to Goa, staying a while, and making the most of it.', action: 'See all opportunities' },
    destinations: { eyebrow: 'GO WHERE THE DAY TAKES YOU', title: 'A little bit of everything.', text: 'From slow mornings by the sea to nights that run a little late. Save a spot, or add it to your plan.', action: 'View the Goa guide' },
    guide: { eyebrow: 'A NOTE BEFORE YOU GO', title: 'A little local know-how.', text: 'The good stuff you wish you knew before you landed.' },
    trips: { eyebrow: 'YOUR LITTLE CORNER OF GOA', title: 'Trips & little things.', text: 'Plans you’ve saved and things you don’t want to forget.' },
    assistant: { eyebrow: 'A FRIEND IN YOUR POCKET', title: 'Ask Tide anything.', text: 'A little help with where to go, what to eat, and how to get there.', prompts: 'What should I eat in Goa?|Tell me about South Goa|How much should I budget?' },
  },
  ui: {
    navigation: { home: 'Home', planner: 'AI Planner', places: 'Places to Visit', trips: 'My Trips', guide: 'Goa Guide', assistant: 'AI Assistant', profile: 'My space' },
    heroPlan: 'Plan my trip', heroExplore: 'Explore Goa', bannerAction: 'Find your side', profileAction: 'Update preferences',
  },
};

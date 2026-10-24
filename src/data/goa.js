import { Compass, Plane, Sun } from 'lucide-react';

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
  { icon: Plane, label: 'FLIGHT FIND', title: 'Bengaluru → Goa', sub: 'Non-stop · 1h 20m', price: 'from ₹3,499', color: 'sky' },
  { icon: Sun, label: 'STAY A LITTLE LONGER', title: 'Beachside boutique stays', sub: 'North & South Goa · 2 nights', price: 'from ₹4,200 / night', color: 'peach' },
  { icon: Compass, label: 'DO SOMETHING DIFFERENT', title: 'Spice farm & village lunch', sub: 'Half day · Ponda', price: 'from ₹1,250 / person', color: 'mint' },
];

export const destinationFilters = ['All', 'Beach', 'Culture', 'Adventure', 'Food', 'Stay'];
export const motionTransition = { duration: .42, ease: [0.22, 1, .36, 1] };

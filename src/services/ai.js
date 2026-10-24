// Replace these deterministic adapters with server-side model calls when ready.
export function createItinerary({ days = 3, interests = ['Beach'], travelers = 2, budget = 'Comfort' }) {
  const picks = [
    { name: 'Anjuna & Vagator', area: 'North Goa', time: '9:00 AM', cost: 900, interest: 'Beach', note: 'Start slow with a beach walk, then linger over a long lunch by the water.' },
    { name: 'Fontainhas & Panjim', area: 'Central Goa', time: '10:00 AM', cost: 650, interest: 'Culture', note: 'Wander the old Latin Quarter, pastel lanes and tiny galleries.' },
    { name: 'Dudhsagar foothills', area: 'East Goa', time: '7:00 AM', cost: 1800, interest: 'Adventure', note: 'Trade the coast for a lush inland day and a waterfall view.' },
    { name: 'Chapora sunset', area: 'North Goa', time: '4:30 PM', cost: 450, interest: 'Nightlife', note: 'Catch the last light above the river, then head out for dinner.' },
    { name: 'Old Goa churches', area: 'South Goa', time: '10:30 AM', cost: 500, interest: 'Churches', note: 'Take a quiet morning among Goa’s grand UNESCO-listed heritage.' },
    { name: 'Margao market', area: 'South Goa', time: '11:00 AM', cost: 750, interest: 'Food', note: 'Taste your way through the market with a local thali stop.' },
  ];
  const spend = budget === 'Easy' ? .72 : budget === 'Treat me' ? 1.55 : 1;
  return Array.from({ length: Math.min(Math.max(Number(days) || 3, 1), 7) }, (_, i) => {
    const chosen = picks.filter(p => interests.some(interest => p.interest.toLowerCase().includes(interest.toLowerCase())));
    const first = chosen.length ? chosen[(i * 2) % chosen.length] : picks[i % picks.length];
    const second = picks[(i + 2) % picks.length];
    return { day: i + 1, title: ['Coast & slow mornings', 'Colour, culture & coast', 'A little inland magic'][i % 3], stops: [first, second].map((p, j) => ({ ...p, time: j ? (i % 2 ? '5:00 PM' : '2:00 PM') : p.time, cost: Math.round(p.cost * travelers * spend) })), estimated: Math.round((first.cost + second.cost) * travelers * spend + 1100 * travelers * spend) };
  });
}

export async function getAssistantReply(message) {
  await new Promise(resolve => setTimeout(resolve, 850));
  const q = message.toLowerCase();
  if (q.includes('south')) return 'For a slower, softer coast, try Palolem, Agonda and Cola in South Goa. Keep a day for Old Goa or a spice farm if you want a change of scene. 🌴';
  if (q.includes('food') || q.includes('eat')) return 'A few delicious starts: fish thali at Ritz Classic in Panjim, a bakery stop in Fontainhas, and a sunset table at a beach shack. Ask for the catch of the day! 🍤';
  if (q.includes('budget') || q.includes('cost')) return 'A comfortable mid-range day in Goa can land around ₹3,000–₹5,000 per person before accommodation. Scooter hire and local cafés can make it gentler. These are demo estimates, so check prices before booking.';
  return 'I’d start with one beach morning, a long Goan lunch, then leave the evening open for a sunset spot. Tell me your dates, budget or travel style and I’ll shape a more personal idea. ✨';
}

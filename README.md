# Tide — Goa Travel Planner

A responsive Goa discovery and trip planning app built with React, Vite, Framer Motion, and an Express/Mongoose API scaffold. Listings, prices, itinerary suggestions, and assistant responses are demo content; no live booking or AI provider is connected.

## Run locally

1. Install Node.js 18+.
2. Run `npm install`.
3. Copy `.env.example` to `.env`. Set `MONGODB_URI` to enable persistence; the API starts in demo-memory mode if it is unset.
4. Run `npm run dev` for the website, or `npm start` for the website and API together.
5. Open `http://localhost:5173`.

The API listens on port 4000 by default. Frontend credentials are never used. Keep database and any future model credentials in the server-side `.env` file.

## API

- `GET/POST/PUT/DELETE /api/trips`
- `GET/POST/PUT/DELETE /api/checklists`
- `GET/POST/DELETE /api/favorites`
- `GET /api/health`

MongoDB models use Mongoose when `MONGODB_URI` is configured. A rule-based itinerary and demo conversational adapter are kept modular in `src/services/ai.js` so a server-side LLM integration can replace them later.

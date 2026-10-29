# Tide — Goa Travel Planner

A responsive Goa discovery and trip planning app built with React, Vite, Framer Motion, and an Express/Mongoose API. The frontend calls the backend with Axios. Listings, prices, itinerary suggestions, and assistant responses are demo content; no live booking or AI provider is connected.

## Project structure

- `frontend/` — Vite app, reusable React components, styles, and Axios API client.
- `backend/` — Express API, CORS configuration, and Mongoose models.
- `.env.example` — local API, database, CORS, and demo admin settings.

## Run locally

1. Install Node.js 18+.
2. Run `npm install`.
3. Copy `.env.example` to `.env` if needed. Set `MONGODB_URI`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_PUBLISHABLE_KEY` before starting the app. The root `.env` is shared by Vite and Express and is ignored by Git.
4. Run `npm start` from the project root to start the Express API and Vite frontend together. To run one side, use `npm run server` or `npm run dev`.
5. Open `http://localhost:5173`.

The API listens on port 4000 by default. Supabase Auth manages sign-up, sign-in, sessions, and passwords. Express validates each Supabase access token and MongoDB stores a matching user profile. Passwords and access tokens are never written to MongoDB. Every personal-data API route requires authentication and scopes its queries to the signed-in user's Mongo user ID. Keep the MongoDB URI in the ignored root `.env`; the Supabase publishable key is intended for the frontend.

## Local admin content studio

- Open `http://localhost:5173/admin` or select **Admin** in the footer.
- Demo sign-in: username `admin`, password `goa123`.
- Set `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD` in your local `.env` before starting Vite to use different demo values.
- The dashboard edits homepage content, destination cards, deals, guide content, section headings, profile details, and footer text. Cards can be added, edited, and removed. Images are set with public image URLs.
- Content is saved in this browser's local storage. This is a local demo dashboard: credentials are bundled with the frontend, so do not use this login or local storage as production security or shared database storage.

## API

- `GET/PATCH /api/me` — account profile and travel preferences.
- `GET/POST /api/trip-requests` — structured Make My Trip submissions.
- `GET/POST/PUT/DELETE /api/trips` — saved itineraries.
- `GET/POST/PUT/DELETE /api/checklists` — personal packing/checklist items.
- `GET/POST/DELETE /api/favorites` — personal destination favorites.
- `GET/POST /api/messages` — persisted conversation messages.
- `GET /api/health`

MongoDB uses separate collections for users, trip submissions, saved itineraries, checklist items, favorites, and conversation messages. Each personal collection references the owning MongoDB user record. The trip request model stores dates, locations, traveler count, budget and type, all preferences, and additional requirements. A rule-based itinerary and demo conversational adapter are kept modular in `frontend/src/services/ai.js`.

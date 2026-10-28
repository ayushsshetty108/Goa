# Tide — Goa Travel Planner

A responsive Goa discovery and trip planning app built with React, Vite, Framer Motion, and an Express/Mongoose API. The frontend calls the backend with Axios. Listings, prices, itinerary suggestions, and assistant responses are demo content; no live booking or AI provider is connected.

## Project structure

- `frontend/` — Vite app, reusable React components, styles, and Axios API client.
- `backend/` — Express API, CORS configuration, and Mongoose models.
- `.env.example` — local API, database, CORS, and demo admin settings.

## Run locally

1. Install Node.js 18+.
2. Run `npm install`.
3. Copy `.env.example` to `.env`. Set `MONGODB_URI` to enable persistence; the API starts in demo-memory mode if it is unset.
4. Run `npm start` from the project root to start the Express API and Vite frontend together. To run one side, use `npm run server` or `npm run dev`.
5. Open `http://localhost:5173`.

The API listens on port 4000 by default. The frontend API URL is configurable with `VITE_API_BASE_URL`; the API's allowed frontend origins are configured with `CLIENT_ORIGIN`. Keep database and any future model credentials in the server-side `.env` file.

## Local admin content studio

- Open `http://localhost:5173/admin` or select **Admin** in the footer.
- Demo sign-in: username `admin`, password `goa123`.
- Set `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD` in your local `.env` before starting Vite to use different demo values.
- The dashboard edits homepage content, destination cards, deals, guide content, section headings, profile details, and footer text. Cards can be added, edited, and removed. Images are set with public image URLs.
- Content is saved in this browser's local storage. This is a local demo dashboard: credentials are bundled with the frontend, so do not use this login or local storage as production security or shared database storage.

## API

- `GET/POST/PUT/DELETE /api/trips`
- `GET/POST/PUT/DELETE /api/checklists`
- `GET/POST/DELETE /api/favorites`
- `GET /api/health`

MongoDB models use Mongoose when `MONGODB_URI` is configured. Without MongoDB, the API keeps trip, checklist, and favorite records in memory for the running server process. A rule-based itinerary and demo conversational adapter are kept modular in `frontend/src/services/ai.js` so a server-side LLM integration can replace them later.

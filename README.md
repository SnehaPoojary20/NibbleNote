## NibbleNote

A full-stack restaurant and café discovery platform. Users add restaurants, leave ratings and written reviews, and search the catalog by name, cuisine, or free text — with an AI-generated "vibe check" summary of what reviewers are saying about a place.

**Live:** https://nibble-note.vercel.app
**GitHub:** https://github.com/SnehaPoojary20/NibbleNote

### The Engineering Problem

Two things matter for a discovery feed like this: search has to return the *right* results, not just matching ones, and aggregate signals (rating, review count) have to stay cheap to read even as reviews pile up. NibbleNote addresses both with a relevance-scored search endpoint and a denormalized, write-time-recalculated stats model.

### Architecture

```
React Frontend (Vercel)
        │
        ▼
Node.js / Express.js REST API (Render)
        │
        ├── /api/v1/users        → registration, login, JWT auth, profile
        ├── /api/v1/restaurants  → CRUD, listing, search, "vibe check"
        └── /api/v1/reviews      → CRUD, per-restaurant stats recalculation
        │
        ▼
MongoDB (Mongoose)
```

### Key Engineering Decisions

**Weighted-Relevance Search**
`GET /api/v1/restaurants/search` runs a Mongo aggregation pipeline: a regex match across name/cuisine/address, an `$addFields` stage that scores prefix matches higher than substring matches, then sorts by score and rating and caps the response at the top 8 results. `GET /api/v1/restaurants` (the plain listing/filter endpoint) uses offset pagination at 10 results per page.

**Denormalized Rating Aggregation**
`avgRating` and `totalReviews` live directly on the `Restaurant` document instead of being computed per-request. Every review create/update/delete triggers a Mongo aggregation (`$group` on `restaurantId`) that recalculates both fields and writes them back — so restaurant reads stay index-only lookups instead of joining across the reviews collection.

**Duplicate-Location Prevention**
A unique compound index on `{ name, coordinates.lat, coordinates.lng }` stops the same restaurant from being added twice at the same address.

**"Vibe Check" AI Summarizer**
`GET /api/v1/restaurants/:id/vibe` pulls up to 150 review comments for a restaurant, sends them to an external LLM API via Axios, and caches the summary in an in-memory `Map` for 24 hours, keyed by restaurant ID. The cache is explicitly invalidated on every review create/update/delete so a new review can't get lost behind stale AI output.

**JWT Authentication**
Access and refresh tokens are issued on login (httpOnly cookies, `secure`, `sameSite: none`) and verified per-request in `verifyJWT` middleware. A `/refresh-token` endpoint reissues both tokens using the refresh token stored on the user document.

### Frontend

React SPA, feature-based component folders under `src/Components/` (Home, Restaurant, Review, AddRestaurant, EditRestaurant, Login, Register, Profile, SearchResults, Navbar, Footer). Plain per-component `.css` files — no Tailwind or Bootstrap. Axios client with a request interceptor that attaches the JWT to outgoing requests.

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router, plain CSS, Axios |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB (compound + unique indexes, aggregation pipeline) |
| Auth | JWT (access + refresh tokens) |
| File uploads | Multer + Cloudinary |
| Deployment | Vercel (frontend), Render (backend) |

### Features

- Restaurant and café discovery with weighted search
- Ratings and written reviews, with denormalized aggregate stats
- AI-generated review summaries ("vibe check"), cached for 24 hours
- Image uploads for restaurants and profiles (Cloudinary)
- JWT-authenticated sessions with refresh-token renewal
- Soft-delete on restaurants (`isActive` flag, not a hard delete)

### Local Setup

```bash
git clone https://github.com/SnehaPoojary20/NibbleNote.git

# Backend
cd NibbleNote/Backend
npm install
# create a .env with: MONGO_URI, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY,
# REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, CLOUDINARY_*, LLM_API_URL
npm run dev

# Frontend
cd ../Frontend
npm install
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev
```

### Known Limitations / What I'd Improve Next

- **No geospatial querying.** Restaurant location is stored as plain `{ lat, lng }` numbers, not a GeoJSON point, so there's no `2dsphere` index and no `$near`/proximity search — search today is text-based (name/cuisine/address), not location-based. This is the biggest gap between what the app could do and what it does today, and the next thing I'd build.
- **In-memory cache doesn't survive restarts or scale past one instance.** The vibe-check cache is a plain `Map` on the Node process — fine for a single Render instance, but it resets on every deploy and wouldn't be shared across replicas. Redis is the natural next step if this needs to scale horizontally.
- **No dedicated service layer.** Controllers call Mongoose models directly; there's no controller/service split yet, so business logic and request handling are mixed in the same functions.
- Cursor-based pagination instead of offset pagination for large result sets.
- Real-time notifications via WebSockets for review activity.


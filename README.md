## NibbleNote

A full-stack restaurant and café discovery platform. Users share reviews, images, and location-based experiences — the platform surfaces relevant results through indexed queries and location-aware ranking.

Live: https://nibble-note.vercel.app

### The Engineering Problem

Restaurant discovery has two hard parts: keeping queries fast as content grows, and returning results that are actually relevant to where the user is. NibbleNote addresses both with MongoDB compound indexing for the primary discovery-feed queries, and geospatial queries for location-aware ranking.

### Architecture

```
React Frontend (Vercel)
        │
        ▼
Node.js / Express.js REST API (Render)
        │
        ├── /auth      → JWT authentication
        ├── /posts     → Review creation, image uploads, feed retrieval
        ├── /search    → Compound-indexed search queries
        └── /location  → Geospatial query layer
        │
        ▼
MongoDB (Compound Indexes + Geospatial Queries)
```

### Key Engineering Decisions

**MongoDB Compound Indexing**
Reviews are queried by multiple dimensions simultaneously — location, cuisine type, rating, recency. A compound index on `{ location, rating, createdAt }` is designed to avoid full collection scans on the primary discovery feed path as the dataset grows. (Query plans have not yet been benchmarked against pre-index behavior at production scale — this is on the improvement list below.)

**Geospatial Discovery**
Uses MongoDB's `$near` operator with 2dsphere indexes to return nearby restaurants ranked by distance. This keeps the sort in the database rather than pulling all documents and filtering in application code.

**JWT Authentication Pipeline**
Stateless JWT-based auth with token verification middleware applied at the route level. No session storage — each request is independently authenticated, which keeps the API horizontally scalable.

**Modular REST API Design**
Routes are organized by domain (`/users`, `/posts`, `/search`, `/location`) with controller-service separation, so each service module owns its own business logic.

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, MongoDB Indexing (2dsphere) |
| Auth | JWT |
| Deployment | Vercel (frontend), Render (backend) |

### Features

- Restaurant and café discovery with location-based sorting
- Community ratings and review system
- Image-based posts and user profiles
- Indexed search and filtering
- JWT-authenticated sessions
- Responsive UI across devices

### Local Setup

```bash
git clone https://github.com/SnehaPoojary20/NibbleNote.git

# Backend
cd backend
npm install
cp .env.example .env
# Add: MONGO_URI, JWT_SECRET
npm start

# Frontend
cd ../frontend
npm install
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev
```

### What I'd improve next

- **Benchmark query performance directly** (explain plans, before/after latency at realistic data volume) to quantify the actual impact of the compound indexes rather than assuming it.
- Redis caching on frequently queried feed endpoints to reduce database load.
- Cursor-based pagination instead of offset pagination for large result sets.
- Real-time notifications via WebSockets for review activity.
- Recommendation ranking using collaborative filtering on user engagement signals.


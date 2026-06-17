# NibbleNote

A full-stack restaurant and café discovery platform. Users share reviews, images, and location-based experiences — the platform surfaces the right results fast through optimized queries and location-aware ranking.

**Live:** [nibble-note.vercel.app](https://nibble-note.vercel.app)

---

## The Engineering Problem

Restaurant discovery at scale has two hard parts: **query performance** as content grows, and **location relevance** when returning results. NibbleNote tackles both — compound indexing on MongoDB reduced lookup latency by over 40%, and geospatial queries power the location-aware feed without naive full-collection scans.

---

## Architecture

```
React Frontend (Vercel)
        │
        ▼
Node.js / Express.js REST API (Render)
        │
        ├── /auth     → JWT authentication + session management
        ├── /posts     → Review creation, image uploads, feed retrieval
        ├── /search    → Compound-indexed search queries
        └── /location  → Geospatial query layer
        │
        ▼
MongoDB (Compound Indexes + Geospatial Queries)
```

---

## Key Engineering Decisions

### MongoDB Compound Indexing
Reviews are queried by multiple dimensions simultaneously — location, cuisine type, rating, recency. Compound indexes on `{ location, rating, createdAt }` eliminate collection scans and keep response times consistent as data grows. **Result: 40%+ reduction in lookup latency.**

### Geospatial Discovery
Used MongoDB's `$near` geospatial operator with `2dsphere` indexes to return nearby restaurants ranked by distance. This avoids pulling all documents and filtering in application code — the sort happens in the database.

### JWT Authentication Pipeline
Stateless JWT-based auth with token verification middleware applied at the route level. No session storage — each request is independently authenticated, keeping the API horizontally scalable.

### Modular REST API Design
Routes are organized by domain (`/users`, `/posts`, `/search`, `/location`) with controller-service separation. Each service module owns its business logic and is independently testable.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, MongoDB Indexing (`2dsphere`) |
| Auth | JWT |
| Deployment | Vercel (frontend), Render (backend) |

---

## Features

- Restaurant and café discovery with location-based sorting
- Community ratings and review system
- Image-based posts and user profiles
- Optimized search and filtering
- Secure JWT-authenticated sessions
- Responsive UI across devices

---

## Local Setup

```bash
# Clone the repo
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

Backend runs at `http://localhost:5000`
Frontend runs at `http://localhost:5173`

---

## What I'd improve next

- **Redis caching** on frequently queried feed endpoints to reduce database load
- **Pagination with cursors** instead of offset pagination for large result sets
- **Real-time notifications** via WebSockets for review activity
- **Recommendation ranking** using collaborative filtering on user engagement signals


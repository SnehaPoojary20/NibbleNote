# NibbleNote – Frontend

NibbleNote Frontend is the client-facing application of the NibbleNote platform, responsible for delivering an intuitive, responsive, and location-aware restaurant discovery and review experience. It consumes secure backend APIs and presents restaurant data, reviews, and map-based discovery through a modern React-based UI.

This repository focuses on frontend architecture, API integration, state handling, and progressive UI enhancements while maintaining clean separation of concerns.

---

## Product Philosophy

The frontend is designed to **support trust and transparency** rather than manipulate user behavior. UI decisions prioritize clarity of information, accurate location context, and frictionless review consumption over aggressive engagement tactics.

The goal is to make restaurant discovery feel **informative, unbiased, and reliable**.

---

## Engineering Focus

- Component-driven UI architecture using React
- Clear separation between presentation and data-fetching logic
- Secure API consumption with JWT-based authentication
- Progressive enhancement strategy (core functionality first, UI polish iteratively)
- Scalable structure suitable for future features such as filtering, sorting, and moderation tools

---

## Tech Stack

- **Framework:** React.js
- **Styling:** CSS, Bootstrap
- **API Integration:** REST APIs (Backend services)
- **Maps & Location:** Google Maps API
- **Deployment:** Vercel

---

## Key Features

- User authentication flow integrated with backend JWT APIs
- Restaurant listing and review display
- Location-based discovery using interactive maps
- Protected views for authenticated users
- Responsive layout optimized for desktop and tablet usage

---

## Architecture Overview

- React components consume RESTful APIs exposed by the backend
- Authentication tokens are handled securely for protected requests
- Google Maps API is used for accurate restaurant geolocation
- UI state is managed locally with predictable data flow

---

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
3. Configure environment variables
4. Start the development server: npm start
5. Ensure the backend service is running and accessible

---

## Environment Variables

REACT_APP_API_BASE_URL=
REACT_APP_GOOGLE_MAPS_API_KEY=




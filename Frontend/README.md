# NibbleNote – Discovery UI 🎨

The frontend for NibbleNote is built to handle complex data (Maps, AI Summaries, and Geo-data) while maintaining a seamless user experience.

## 🎨 Design Philosophy
- **Decision Efficiency:** Prioritizes AI-generated summaries ("Vibe Checks") to save user time.
- **Context-First:** Uses interactive **Google Maps** integration to provide immediate spatial context to restaurant listings.

## ⚡ Engineering Highlights
- **State Management:** Localized state management for optimized re-rendering during map interactions.
- **Security:** Secure handling of JWTs in memory/HTTP-only cookies to prevent XSS/CSRF.
- **Responsiveness:** Mobile-first approach using Tailwind CSS.

## 🛠️ Tech Stack
- React.js
- Tailwind CSS / Bootstrap
- Axios (with interceptors for token refresh)
- Google Maps SDK




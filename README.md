# AI-Powered Discovery Engine (NibbleNote) 🚀

NibbleNote is a high-performance, AI-driven restaurant discovery platform. It moves beyond traditional keyword search by utilizing **LLMs and Vector Embeddings** to understand user intent, combined with **Redis Geospatial indexing** for sub-15ms location-based queries.

## 🌟 Why This Project Matters
In an era of information overload, NibbleNote solves the "Review Fatigue" problem. Instead of reading hundreds of reviews, users get AI-generated "Vibe Checks." Instead of searching for "Spicy Food," users can search for "A quiet place with spicy food for a date" using natural language.

## 🛠️ Advanced Engineering Focus
- **Semantic Search:** Implemented using **Vector Embeddings** and **Pinecone DB** to enable high-accuracy contextual discovery.
- **AI Summarization:** Leveraged the **Gemini API** and **LangChain** to condense 100+ user reviews into instant, actionable insights.
- **High-Performance Location Queries:** Migrated from MongoDB `2dsphere` to **Redis Geospatial** indexing, reducing search latency by **90%**.
- **System Reliability:** Architected with JWT refresh-token rotation, middleware-based RBAC, and schema-level data integrity.

## 🏗️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Google Maps API
- **Backend:** Node.js, Express.js, Redis (Geospatial & Caching)
- **AI/ML:** Gemini API, LangChain, Pinecone (Vector DB)
- **Database:** MongoDB (Mongoose ODM)
- **Deployment:** Vercel

## 🚀 Key Features
- **Semantic Discovery:** Natural language restaurant search.
- **AI Vibe Check:** Instant LLM summaries of restaurant atmospheres.
- **Geo-Fencing:** High-speed discovery within a 5km-50km radius.
- **Secure Auth:** Advanced JWT lifecycle management (Access/Refresh tokens).
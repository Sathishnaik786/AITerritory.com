# 🧠 AI Territory.org

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-netlify-badge/deploy-status)](https://app.netlify.com/sites/aiterritory/deploys)
[![Render Backend](https://img.shields.io/badge/Backend-Render-blue)](https://dashboard.render.com/)
[![Build Status](https://github.com/your-org/aiterritory.org/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/aiterritory.org/actions)

---

## 🧭 Project Overview

**AI Territory** is your all-in-one AI-powered platform for discovering, repurposing, and managing the best AI tools, prompts, and resources. Built for creators, marketers, developers, and AI enthusiasts, it offers a seamless experience to boost productivity, SEO, and content generation.

> **Vision:** "Empowering everyone to leverage AI for smarter, faster, and more creative digital work."

Live: [https://aiterritory.org](https://aiterritory.org)

---

## 🚀 Features

- **Smart Repurposing:** Instantly transform content for different platforms and formats.
- **SEO Copilot:** AI-driven SEO suggestions, meta tag generation, and performance insights.
- **Prompt Library:** Curated, searchable prompt collections for OpenAI, Claude, and more.
- **Blog Generation:** AI-powered blog creation and management.
- **Tool Discovery:** Explore, filter, and bookmark 500+ AI tools.
- **Trending & Featured Tools:** Real-time updates on what's hot in AI.
- **User Dashboard:** Manage bookmarks, submissions, and feedback.
- **Testimonials & Reviews:** Community-driven insights and ratings.
- **YouTube AI Content:** Embedded videos and channel integration.
- **API Access:** RESTful endpoints for tools, prompts, and more.
- **Responsive UI:** Mobile-first, fast, and accessible.

---

## 🧱 Project Structure

```
AITerritory.com/
├── src/                # Frontend (React, Vite, Shadcn/UI, Zustand)
│   ├── admin/          # Admin dashboard & pages
│   ├── app/            # App data & dashboard
│   ├── components/     # UI & feature components
│   ├── context/        # React contexts
│   ├── data/           # Static data (tools, blogs, nav)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities
│   ├── pages/          # Main pages (Home, Blog, Tools, etc.)
│   ├── services/       # API & business logic
│   ├── types/          # TypeScript types
│   └── assets/         # Images & static assets
├── server/             # Backend (Node.js, Express, Supabase, Prisma)
│   ├── controllers/    # API controllers
│   ├── lib/            # Supabase & helpers
│   ├── middleware/     # Auth, error handling, rate limiting
│   ├── models/         # ORM models
│   ├── routes/         # Express routes
│   ├── scripts/        # DB & migration scripts
│   └── server.js       # Entry point
├── supabase/           # DB migrations & SQL
│   └── migrations/     # SQL migration files
├── public/             # Static files (favicon, robots.txt, images)
├── docs/               # Documentation
├── Dockerfile.frontend # Frontend Docker config
├── docker-compose.yml  # Multi-service Docker setup
├── nginx.conf          # Nginx config (if used)
├── package.json        # Project metadata & scripts
└── README.md           # This file
```

---

## ⚙️ Tech Stack

**Frontend:**
- React, Vite, TypeScript
- Next.js (planned)
- Tailwind CSS, Shadcn/UI
- Zustand (state), React Query (data)
- Framer Motion (animations)

**Backend:**
- Node.js, Express
- PostgreSQL, Prisma ORM
- Redis (caching)
- Supabase (auth, storage, DB)
- JWT (auth), S3 (uploads)

**AI/ML:**
- OpenAI, Claude, HuggingFace
- Pinecone (vector search)
- spaCy (NLP)

**Deployment:**
- Netlify (Frontend)
- Render (Backend)
- GitHub Actions (CI/CD)

---

## 🔐 Environment Setup Instructions

### Prerequisites
- Node.js >= 18.x
- pnpm or npm
- PostgreSQL (local or cloud)
- Supabase account (for auth/storage)
- Redis (optional, for caching)
- Docker (optional)

### 1. Clone & Install
```bash
git clone https://github.com/your-org/aiterritory.org.git
cd AITerritory.com
pnpm install # or npm install
```

### 2. Environment Variables

#### Frontend (`.env` in root or `src/`):
```
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Backend (`server/.env`):
```
DATABASE_URL=postgresql://user:pass@localhost:5432/aiterritory
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-supabase-service-key
JWT_SECRET=your-jwt-secret
REDIS_URL=redis://localhost:6379
S3_BUCKET=your-s3-bucket
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
```

### 3. Development
- **Frontend:**
  ```bash
  pnpm run dev
  # or
  cd src && pnpm run dev
  ```
- **Backend:**
  ```bash
  cd server
  pnpm run dev
  ```

### 4. Production
- **Frontend:**
  ```bash
  pnpm run build && pnpm run preview
  ```
- **Backend:**
  ```bash
  cd server
  pnpm run start
  ```

### 5. Docker (Optional)
```bash
docker-compose up --build
```

---

## 🧪 Testing Instructions

- **Frontend:**
  ```bash
  pnpm run test
  ```
- **Backend:**
  ```bash
  cd server
  pnpm run test
  ```
- **Database:**
  ```bash
  cd server/scripts
  node testDatabase.js
  ```

---

## 🧠 Smart Repurposing + SEO Copilot Instructions

- **Smart Repurposing:**
  1. Go to the [Dashboard](https://aiterritory.org/dashboard)
  2. Select content (blog, prompt, etc.)
  3. Click "Repurpose" and choose target format (e.g., LinkedIn, Twitter, Blog)
  4. Edit and approve AI-generated output

- **SEO Copilot:**
  1. Open any blog or tool detail page
  2. Use the "SEO Copilot" panel for meta tag suggestions, keyword ideas, and performance tips
  3. Apply suggestions and re-check SEO score

---

## 🧰 API Example Usage

- **GET /tools**
  ```http
  GET https://aiterritory.org/api/tools
  ```
- **POST /prompts**
  ```http
  POST https://aiterritory.org/api/prompts
  Content-Type: application/json
  {
    "title": "Best LinkedIn Post",
    "content": "Write a viral LinkedIn post about AI."
  }
  ```
- **GET /categories**
  ```http
  GET https://aiterritory.org/api/categories
  ```
- **GET /blog**
  ```http
  GET https://aiterritory.org/api/blog
  ```

See [API Docs](docs/) for full details.

---

## 🎨 Screenshots

> _Add screenshots to the `public/` folder and update links below as needed._

| Homepage | Dashboard | Smart Repurposing | Blog Section |
|---|---|---|---|
| ![Homepage](public/screenshots/homepage.png) | ![Dashboard](public/screenshots/dashboard.png) | ![Repurposing](public/screenshots/repurposing.png) | ![Blog](public/screenshots/blog.png) |

---

## 🌍 SEO Integration

- [Sitemap.xml](https://aiterritory.org/sitemap.xml)
- [robots.txt](https://aiterritory.org/robots.txt)
- Meta tags & OG images for all pages
- Automated SEO audits (Lighthouse > 90)
- Schema.org structured data

---

## 🔐 Security Notes

- **CSP:** Strict Content Security Policy headers
- **JWT:** Secure, short-lived tokens for API
- **Rate Limiting:** Express middleware to prevent abuse
- **Supabase:** Row-level security, access policies
- **HTTPS:** Enforced in production

---

## 🌐 Deployment Setup

- **Frontend:**
  - Deployed via [Netlify](https://app.netlify.com/sites/aiterritory/deploys)
  - Connect repo, set build command: `pnpm run build`, publish: `dist/`
  - Configure custom domain, HTTPS, and environment variables
- **Backend:**
  - Deployed via [Render](https://dashboard.render.com/)
  - Connect repo, set start command: `pnpm run start`
  - Set environment variables, PostgreSQL, and Supabase configs
- **CI/CD:**
  - [GitHub Actions](https://github.com/your-org/aiterritory.org/actions) for tests, lint, and deploy

---

## 📥 Contribution Guide

1. Fork the repo & create a feature branch
2. Follow [Conventional Commits](https://www.conventionalcommits.org/)
3. Add/Update tests for new features
4. Run `pnpm run lint` and `pnpm run test`
5. Submit a pull request with a clear description
6. Join [GitHub Discussions](https://github.com/your-org/aiterritory.org/discussions) for ideas & feedback

---

## 🛣️ Roadmap

- Stripe billing & subscriptions
- React Native mobile app
- AI-powered analytics dashboard
- Multi-language support
- More prompt templates & integrations
- Community Q&A and forum

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📫 Support & Contact

- Email: [support@aiterritory.com](mailto:support@aiterritory.com)
- [GitHub Issues](https://github.com/your-org/aiterritory.org/issues)
- [GitHub Discussions](https://github.com/your-org/aiterritory.org/discussions)
- [Docs](docs/)
# 🚀 AITerritory.org - AI-Powered Content Creation, SEO & Publishing Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-username/AITerritory.com/actions)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Deployment](https://img.shields.io/badge/deployed-Render%20%2F%20Netlify-blue)](https://aiterritory.org)

## 📋 Project Overview

**AITerritory.org** is a full-stack AI-powered content creation, SEO, and publishing platform designed for creators, marketers, and startups. It enables users to generate high-quality blog posts, schedule social media content, optimize for SEO, and analyze performance—all in one place.

- **Target Audience:** Creators, marketers, startups
- **Core Use Cases:** Blog generation, social media scheduling, SEO optimization, analytics

## 🎯 Key Features

- **AI-powered content generation** (OpenAI, Claude, Hugging Face)
- **SEO optimization** with real-time keyword suggestions
- **Social media publishing** (Twitter, Facebook, LinkedIn, Instagram)
- **Email marketing integration** (Mailchimp, ConvertKit)
- **Plagiarism detection and rewriting tools**
- **Analytics for content performance**
- **Collaborative workflows for teams**
- **Scheduled content calendar**
- **Multi-language support**
- **Image generation** using DALL·E and Midjourney API

## 🏗️ Project Structure

```
AITerritory.com/
├── README.md
├── package.json
├── package-lock.json
├── bun.lockb
├── .gitignore
├── .dockerignore
├── docker-compose.yml
├── Dockerfile.frontend
├── ecosystem.config.js
├── netlify.toml
├── render.yaml
├── nginx.conf
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── favicon_io/                  # Favicon and icon assets
├── public/                      # Static assets (logo, favicon, robots.txt, etc.)
├── docs/                        # Project documentation (e.g., databse.md)
├── server/                      # Backend (Node.js/Express)
│   ├── server.js                # Main server entry
│   ├── package.json
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── config/                  # Configuration files (e.g., database.js)
│   ├── controllers/             # Route controllers (AI, tools, prompts, etc.)
│   ├── lib/                     # Supabase and other libraries
│   ├── middleware/              # Express middleware (error handler, rate limiter)
│   ├── models/                  # Database models (Tool, Tag, Review, etc.)
│   ├── routes/                  # API routes (tools, prompts, likes, etc.)
│   ├── scripts/                 # Database and utility scripts (migrations, seeds)
│   └── test-*.js                # Test scripts
├── src/                         # Frontend (React + TypeScript)
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   ├── admin/                   # Admin dashboard and management pages
│   ├── assets/                  # Images and static assets
│   ├── components/              # Reusable UI components
│   │   └── ui/                  # Shadcn/UI and custom UI primitives
│   ├── context/                 # React context providers
│   ├── data/                    # Static data (e.g., tools.ts)
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility libraries
│   ├── pages/                   # Main app pages (Home, Tools, Prompts, etc.)
│   ├── services/                # API and business logic services
│   └── types/                   # TypeScript type definitions
├── supabase/                    # Supabase database config
│   └── migrations/              # SQL migration scripts
```

## 🛠️ Tech Stack

- **Frontend:** React + Next.js 14, Tailwind CSS, Shadcn/ui, Zustand, React Query, Vite, Framer Motion
- **Backend:** Node.js + Express, PostgreSQL, Redis, Prisma, JWT Auth, S3 file upload
- **AI Services:** OpenAI, Cohere, Claude, Hugging Face, spaCy, Pinecone
- **DevOps:** Render (backend), Netlify (frontend), GitHub Actions CI/CD, Sentry, Docker, Cloudflare

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose
- pnpm (recommended) or npm

### Local Development

```bash
# 1. Clone the repository
$ git clone https://github.com/your-username/AITerritory.com.git
$ cd AITerritory.com

# 2. Install dependencies
$ pnpm install

# 3. Set up environment variables
$ cp .env.example .env
$ cp server/.env.example server/.env
$ cp src/.env.example src/.env

# 4. Start the development environment
$ docker-compose up -d
# Or run frontend and backend separately
$ pnpm run dev:full

# 5. Access the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```

## 🖼️ Example Screenshots

> _Add your own screenshots here!_

![Homepage Screenshot](docs/screenshots/homepage.png)
![Admin Dashboard Screenshot](docs/screenshots/admin-dashboard.png)

## 📡 Example API Usage

**Get all tools:**
```http
GET https://aiterritory.org/api/tools
```
**Sample response:**
```json
[
  {
    "id": "tool_123",
    "name": "AI Blog Writer",
    "category": "Content Generation",
    "description": "Generate SEO-optimized blog posts with AI.",
    ...
  },
  ...
]
```

**Create a new prompt:**
```http
POST https://aiterritory.org/api/prompts
Content-Type: application/json
{
  "title": "Write a product review for...",
  "category": "Reviews"
}
```

## 🧪 Running Tests

```bash
# Run all tests
$ pnpm test

# Run frontend tests
$ cd src && pnpm test

# Run backend tests
$ cd server && pnpm test
```

## 🙋 Requesting Support or Features

- For **support**, open a [GitHub Issue](https://github.com/your-username/AITerritory.com/issues) or email [support@aiterritory.com](mailto:support@aiterritory.com)
- For **feature requests**, use [GitHub Discussions](https://github.com/your-username/AITerritory.com/discussions) or the in-app feedback form

## 🚀 Deployment

- **Frontend:** Hosted on Netlify and connected to domain `aiterritory.org`
- **Backend:** Deployed on Render with environment variables configured
- **Custom Domain:** DNS records point to Netlify and Render IPs

## 🔍 SEO & Meta

- `robots.txt` and `sitemap.xml` implemented
- Open Graph, Twitter Card, and canonical tags via `react-helmet-async`
- OG image hosted on CDN and verified with Facebook, Twitter, LinkedIn inspectors

## 🌐 Live URLs

- **Website:** https://aiterritory.org
- **Sitemap:** https://aiterritory.org/sitemap.xml
- **Robots.txt:** https://aiterritory.org/robots.txt

## 🛣️ Next Steps (Roadmap)

- Launch on ProductHunt and Dev.to
- Improve mobile UX and finalize React Native app
- Add billing plans with Stripe
- Expand AI tools (auto-meta, real-time SEO audit)

---

## 🤝 Contributing

We welcome contributions from the community! To get started:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.aiterritory.com](https://docs.aiterritory.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/AITerritory.com/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/AITerritory.com/discussions)
- **Email**: support@aiterritory.com

---

**Built with ❤️ by the AITerritory.org Team**
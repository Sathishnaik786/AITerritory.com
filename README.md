# AI Tools Directory

A modern, full-stack application for discovering and managing AI tools, built with React, Node.js, Express, and Supabase.

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: React Router v6
- **Authentication**: Clerk
- **HTTP Client**: Axios

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens
- **Security**: Helmet, CORS, Rate limiting
- **API**: RESTful API with proper error handling

### Database (Supabase)
- **Type**: PostgreSQL with Row Level Security
- **Features**: Real-time subscriptions, Auto-generated APIs
- **Schema**: Tools, Categories, Tags, Reviews, Sub-tools

## 🚀 Quick Start

### Prerequisites
- Node.js 18.19.0 or higher
- npm or yarn
- Supabase account

### 1. Clone and Install
```bash
# Install all dependencies (frontend + backend)
npm run setup

# Or install separately
npm install                    # Frontend
cd server && npm install      # Backend
```

### 2. Environment Setup

#### Frontend (.env)
```bash
cp .env.example .env
```
Edit `.env` with your configuration:
```env
VITE_API_BASE_URL=http://localhost:3002/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend (server/.env)
```bash
cd server
cp .env.example .env
```
Edit `server/.env` with your Supabase credentials:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3002
NODE_ENV=development
```

### 3. Database Setup

Run the migration to create tables:
```bash
# The migration file is in supabase/migrations/
# Apply it through Supabase Dashboard or CLI
```

Seed the database (optional):
```bash
cd server
npm run seed
```

### 4. Start Development

#### Option 1: Start both frontend and backend together
```bash
npm run dev:full
```

#### Option 2: Start separately
```bash
# Terminal 1 - Frontend (port 8080)
npm run dev

# Terminal 2 - Backend (port 3002)
npm run server:dev
```

## 📁 Project Structure

```
├── src/                          # Frontend source
│   ├── components/               # Reusable UI components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── ToolCard.tsx         # Tool display component
│   │   ├── ToolGrid.tsx         # Tool grid layout
│   │   └── CategoryFilter.tsx   # Category filtering
│   ├── hooks/                   # Custom React hooks
│   │   ├── useTools.ts          # Tool data management
│   │   ├── useCategories.ts     # Category data management
│   │   └── useTags.ts           # Tag data management
│   ├── services/                # API service layer
│   │   ├── api.ts               # Axios configuration
│   │   ├── toolService.ts       # Tool API calls
│   │   ├── categoryService.ts   # Category API calls
│   │   └── tagService.ts        # Tag API calls
│   ├── types/                   # TypeScript type definitions
│   │   ├── tool.ts              # Tool-related types
│   │   ├── category.ts          # Category types
│   │   └── tag.ts               # Tag types
│   ├── pages/                   # Page components
│   │   ├── HomePage.tsx         # Main landing page
│   │   └── ...                  # Other pages
│   └── App.tsx                  # Main app component
├── server/                      # Backend source
│   ├── config/                  # Configuration files
│   │   └── database.js          # Supabase connection
│   ├── controllers/             # Route controllers
│   │   ├── toolController.js    # Tool CRUD operations
│   │   ├── categoryController.js # Category operations
│   │   └── tagController.js     # Tag operations
│   ├── models/                  # Data models
│   │   ├── Tool.js              # Tool model
│   │   ├── Category.js          # Category model
│   │   └── Tag.js               # Tag model
│   ├── routes/                  # API routes
│   │   ├── tools.js             # Tool routes
│   │   ├── categories.js        # Category routes
│   │   └── tags.js              # Tag routes
│   ├── middleware/              # Express middleware
│   │   ├── errorHandler.js      # Error handling
│   │   └── rateLimiter.js       # Rate limiting
│   ├── scripts/                 # Utility scripts
│   │   ├── seed.js              # Database seeding
│   │   └── migrate.js           # Migration runner
│   └── server.js                # Express server entry
├── supabase/                    # Database migrations
│   └── migrations/              # SQL migration files
└── package.json                 # Frontend dependencies
```

## 🔌 API Endpoints

### Tools
- `GET /api/tools` - Get all tools (with filters)
- `GET /api/tools/:id` - Get single tool
- `POST /api/tools` - Create new tool
- `PUT /api/tools/:id` - Update tool
- `DELETE /api/tools/:id` - Delete tool

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `GET /api/categories/slug/:slug` - Get category by slug
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/:id` - Get single tag
- `GET /api/tags/slug/:slug` - Get tag by slug
- `POST /api/tags` - Create tag
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

## 🎯 Key Features

### Frontend Features
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Search**: Instant search with debouncing
- **Advanced Filtering**: Filter by categories, tags, ratings
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Comprehensive error boundaries
- **Loading States**: Skeleton loaders and loading indicators
- **Responsive Design**: Mobile-first approach

### Backend Features
- **RESTful API**: Clean, consistent API design
- **Data Validation**: Input validation and sanitization
- **Error Handling**: Structured error responses
- **Rate Limiting**: Protection against abuse
- **Security**: CORS, Helmet, input validation
- **Database Integration**: Optimized Supabase queries

### Database Features
- **Row Level Security**: Secure data access
- **Full-text Search**: Advanced search capabilities
- **Relationships**: Proper foreign key constraints
- **Indexing**: Optimized query performance
- **Triggers**: Automatic timestamp updates

## 🛠️ Development

### Available Scripts

#### Frontend
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

#### Backend
```bash
npm run server:dev       # Start backend development server
npm run server:install   # Install backend dependencies
```

#### Combined
```bash
npm run setup           # Install all dependencies
npm run dev:full        # Start both frontend and backend
```

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (via ESLint)
- **Husky**: Git hooks for quality checks

### Testing
```bash
# Frontend tests
npm run test

# Backend tests
cd server && npm run test
```

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku/DigitalOcean)
```bash
cd server
npm start
```

### Environment Variables for Production
Make sure to set all required environment variables in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
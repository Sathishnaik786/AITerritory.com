# AI Tools Directory - Backend API

A Node.js backend API with Supabase PostgreSQL database for the AI Tools Directory application.

## 🚀 Features

- **RESTful API** with Express.js
- **Supabase PostgreSQL** database
- **Full CRUD operations** for tools, categories, and tags
- **Advanced search and filtering**
- **Image URL storage** (no file uploads)
- **Rate limiting and security**
- **Input validation**
- **Error handling**
- **Database migrations and seeding**

## 📋 Prerequisites

- Node.js 18+ 
- Supabase account and project
- npm or yarn

## 🛠️ Installation

1. **Clone and navigate to server directory:**
```bash
cd server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

4. **Run database migrations:**
```bash
npm run migrate
```

5. **Seed the database with sample data:**
```bash
npm run seed
```

6. **Start the development server:**
```bash
npm run dev
```

## 📚 API Endpoints

### Tools
- `GET /api/tools` - Get all tools with filtering
- `GET /api/tools/featured` - Get featured tools
- `GET /api/tools/trending` - Get trending tools
- `GET /api/tools/search?q=query` - Search tools
- `GET /api/tools/category/:slug` - Get tools by category
- `GET /api/tools/:id` - Get single tool
- `POST /api/tools` - Create new tool
- `PUT /api/tools/:id` - Update tool
- `DELETE /api/tools/:id` - Delete tool

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/slug/:slug` - Get category by slug
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/popular` - Get popular tags
- `GET /api/tags/:id` - Get tag by ID
- `POST /api/tags` - Create tag

### Query Parameters for Tools

**Filtering:**
- `category` - Filter by category slug
- `status` - Filter by status (Active, Inactive, Coming Soon)
- `featured=true` - Get only featured tools
- `trending=true` - Get only trending tools
- `search` - Full-text search in name and description
- `tags` - Comma-separated tag slugs

**Sorting:**
- `sortBy` - Sort field (created_at, rating, name)
- `sortOrder` - Sort direction (asc, desc)

**Pagination:**
- `limit` - Number of results (default: 20)
- `offset` - Offset for pagination

**Example:**
```
GET /api/tools?category=ai-language-models&featured=true&limit=10&sortBy=rating&sortOrder=desc
```

## 🗄️ Database Schema

### Tables
- **categories** - Tool categories
- **tools** - AI tools with metadata
- **tags** - Tool tags
- **tool_tags** - Many-to-many relationship
- **sub_tools** - Sub-tools for main tools
- **reviews** - User reviews and ratings

### Key Features
- UUID primary keys
- Full-text search indexes
- Row Level Security (RLS)
- Automatic timestamps
- Foreign key constraints

## 🔧 Development

**Start development server:**
```bash
npm run dev
```

**Run migrations:**
```bash
npm run migrate
```

**Seed database:**
```bash
npm run seed
```

**Production build:**
```bash
npm start
```

## 🔒 Security Features

- **Helmet.js** for security headers
- **CORS** configuration
- **Rate limiting** (100 requests per 15 minutes)
- **Input validation** with express-validator
- **Row Level Security** in Supabase
- **Environment-based configuration**

## 📊 API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": [...],
  "message": "Optional message"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...] // Validation errors if applicable
}
```

## 🌐 Integration with Frontend

Update your frontend to use the API:

```javascript
// Example: Fetch tools
const response = await fetch('http://localhost:3001/api/tools');
const { data: tools } = await response.json();

// Example: Search tools
const response = await fetch('http://localhost:3001/api/tools/search?q=chatgpt');
const { data: searchResults } = await response.json();
```

## 🚀 Deployment

1. **Set production environment variables**
2. **Deploy to your preferred platform** (Vercel, Railway, Heroku, etc.)
3. **Update FRONTEND_URL** in environment variables
4. **Run migrations** on production database

## 📝 Notes

- Images are stored as URLs (no file upload handling)
- Database uses Supabase PostgreSQL
- All endpoints return JSON
- Rate limiting applied to prevent abuse
- Full-text search available for tools
- Supports complex filtering and sorting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
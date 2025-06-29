# AI Tools Directory - Backend Server

This is the backend API server for the AI Tools Directory application.

## Features

- RESTful API for tools, categories, and tags
- Supabase integration for database operations
- Rate limiting and security middleware
- Error handling and logging
- Database seeding and migration scripts

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials and preferred port.

3. Run database migrations:
```bash
npm run migrate
```

4. Seed the database (optional):
```bash
npm run seed
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Tools
- `GET /api/tools` - Get all tools (with optional filters)
- `GET /api/tools/:id` - Get single tool
- `POST /api/tools` - Create new tool
- `PUT /api/tools/:id` - Update tool
- `DELETE /api/tools/:id` - Delete tool

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `GET /api/categories/slug/:slug` - Get category by slug
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/:id` - Get single tag
- `GET /api/tags/slug/:slug` - Get tag by slug
- `POST /api/tags` - Create new tag
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

## Query Parameters

### Tools Endpoint
- `category_id` - Filter by category ID
- `is_featured` - Filter featured tools (true/false)
- `is_trending` - Filter trending tools (true/false)
- `status` - Filter by status (default: 'Active')
- `search` - Full-text search in name and description

## Environment Variables

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `PORT` - Server port (default: 3002)
- `NODE_ENV` - Environment (development/production)

## Security Features

- Helmet.js for security headers
- CORS enabled
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- Error handling without sensitive data exposure

## Database Schema

The server works with the following main tables:
- `categories` - Tool categories
- `tools` - AI tools and applications
- `tags` - Tool tags for filtering
- `tool_tags` - Many-to-many relationship between tools and tags
- `sub_tools` - Sub-tools related to main tools
- `reviews` - User reviews for tools

## Development

The server uses:
- Express.js for the web framework
- Supabase for database operations
- Various middleware for security and functionality

For development, use `npm run dev` to start the server with nodemon for auto-reloading.
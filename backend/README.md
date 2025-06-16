# AI Tools Backend API

A comprehensive Node.js backend API for the AI Tools Directory platform, built with Express.js and MongoDB.

## Features

- **RESTful API** for AI tools management
- **MongoDB** database with Mongoose ODM
- **User authentication** with Clerk integration
- **Search functionality** with full-text search
- **Newsletter management**
- **Analytics and reporting**
- **Rate limiting** and security middleware
- **Input validation** with express-validator
- **Comprehensive error handling**

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-tools-db
JWT_SECRET=your_super_secret_jwt_key_here
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Database Setup

1. Make sure MongoDB is running locally or you have a MongoDB Atlas connection string
2. Run the seed script to populate initial data:
```bash
node scripts/seedData.js
```

## API Endpoints

### Tools
- `GET /api/tools` - Get all tools with filtering and pagination
- `GET /api/tools/featured` - Get featured tools
- `GET /api/tools/:id` - Get single tool by ID
- `POST /api/tools` - Create new tool (requires auth)
- `PUT /api/tools/:id` - Update tool (admin only)
- `DELETE /api/tools/:id` - Delete tool (admin only)
- `POST /api/tools/:id/bookmark` - Bookmark/unbookmark tool
- `POST /api/tools/:id/review` - Add review to tool

### Search
- `GET /api/search?q=query` - Search tools
- `GET /api/search/suggestions?q=query` - Get search suggestions
- `GET /api/search/trending` - Get trending search terms

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/featured` - Get featured categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/bookmarks` - Get user bookmarks
- `GET /api/users/reviews` - Get user reviews
- `DELETE /api/users/reviews/:toolId` - Delete user review

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /api/newsletter/subscribers` - Get subscribers (admin only)
- `GET /api/newsletter/stats` - Get newsletter stats (admin only)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics (admin only)
- `GET /api/analytics/tools` - Get tool analytics
- `POST /api/analytics/track` - Track user events

### Webhooks
- `POST /api/webhooks/clerk` - Handle Clerk webhooks

## Database Models

### Tool
- Basic info: name, category, description, link
- Media: image, icon
- Metadata: tags, company, status, pricing
- Analytics: rating, reviewCount, viewCount, bookmarkCount
- Approval system: approved, submittedBy, approvedBy

### User
- Clerk integration: clerkId
- Profile: email, firstName, lastName, username, avatar
- Preferences: newsletter, notifications, theme
- Activity: bookmarkedTools, submittedTools, reviews
- Role-based access: user, moderator, admin

### Category
- Basic info: name, slug, description
- Visual: icon, color
- Organization: parentCategory, subcategories, order
- Analytics: toolCount, featured status

### Newsletter
- Subscriber info: email, firstName, lastName
- Preferences: interests, source
- Status: isActive, unsubscribedAt, unsubscribeReason

## Authentication

The API uses Clerk for authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables

## Development

### Running Tests
```bash
npm test
```

### Code Style
The project uses ESLint for code linting. Run:
```bash
npm run lint
```

### Database Migrations
For schema changes, create migration scripts in the `scripts/` directory.

## Deployment

### Environment Variables
Make sure to set all required environment variables in production:
- `NODE_ENV=production`
- `MONGODB_URI` (MongoDB Atlas connection string)
- `JWT_SECRET` (strong secret key)
- `CLERK_WEBHOOK_SECRET`
- `CORS_ORIGIN` (your frontend domain)

### Docker Support
A Dockerfile is included for containerized deployment:

```bash
docker build -t ai-tools-backend .
docker run -p 5000:5000 ai-tools-backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details
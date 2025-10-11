# AI Territory

AI Territory is a comprehensive platform for AI tools, prompts, and resources.

## Project Structure

```
.
├── database/              # Database migrations and scripts
├── docs/                  # Documentation files
├── google-scripts/        # Google Apps Script integrations
├── netlify/               # Netlify edge functions
├── public/                # Static assets
├── scripts/               # Utility scripts
├── server/                # Backend API server
├── src/                   # Frontend React application
├── supabase/              # Supabase configuration
└── test/                  # Test files
```

## Recent Fixes

### Prompt Details Page Issues (October 2025)

Fixed critical issues with the prompt details page that were causing:

- Timeout errors due to excessive API calls
- 404 errors when accessing prompt interactions
- 500 errors from foreign key constraint violations

**Key Changes:**

1. **Updated PromptDetailsPage Component**
   - Now uses the correct service to fetch Gemini prompts
   - Integrated with the new prompt interactions system
   - Improved error handling and loading states

2. **API Improvements**
   - Increased timeout from 15s to 30s
   - Enhanced retry logic with exponential backoff
   - Better error handling for network issues

3. **Backend Optimizations**
   - Removed excessive verification checks that caused timeouts
   - Fixed foreign key constraints in database
   - Improved error responses

4. **Database Migration**
   - Added proper foreign key constraints with CASCADE options
   - Created necessary indexes for better performance
   - Added unique constraints to prevent duplicates

See [PROMPT_DETAILS_PAGE_FIXES.md](PROMPT_DETAILS_PAGE_FIXES.md) for detailed information.

## Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account
- Render account (for deployment)

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.development
   # Edit .env.development with your credentials
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

## Deployment

The application is configured for deployment on Render with automatic builds from the main branch.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.
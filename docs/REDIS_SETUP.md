# Redis Integration Setup Guide

## Overview

This guide explains how to set up Redis caching and rate limiting for the AI Territory backend server.

## Environment Variables

Add these variables to your `.env` file:

```bash
# Redis Configuration
REDIS_URL=redis://localhost:6379
ENABLE_REDIS=true
```

## Redis Providers

### 1. Upstash Redis (Recommended for Production)

1. Sign up at [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Copy the connection string
4. Set in your `.env`:

```bash
REDIS_URL=redis://default:your_password@your_host:your_port
ENABLE_REDIS=true
```

### 2. Redis Cloud

1. Sign up at [redis.com](https://redis.com)
2. Create a new database
3. Get the connection details
4. Set in your `.env`:

```bash
REDIS_URL=redis://username:password@host:port
ENABLE_REDIS=true
```

### 3. Local Redis (Development)

#### Using Docker:
```bash
docker run -d -p 6379:6379 redis:alpine
```

#### Using Homebrew (macOS):
```bash
brew install redis
brew services start redis
```

#### Using apt (Ubuntu):
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

## Features Implemented

### 1. API Caching
- **Endpoints**: `/api/tools` and `/api/blogs` GET requests
- **Cache Duration**: 5 minutes (300 seconds)
- **Cache Keys**: Based on URL and query parameters
- **Fallback**: Graceful degradation when Redis is unavailable

### 2. Rate Limiting
- **Limit**: 100 requests per IP per 60 seconds
- **Distribution**: Works across multiple server instances
- **Headers**: Includes rate limit information in response headers
- **Fallback**: Allows requests when Redis is unavailable

## Testing

### 1. Test Redis Connection
```bash
curl http://localhost:3003/health/redis
```

### 2. Test Caching
```bash
# First request (cache miss)
curl http://localhost:3003/api/tools

# Second request (cache hit)
curl http://localhost:3003/api/tools
```

### 3. Test Rate Limiting
```bash
# Make multiple requests quickly
for i in {1..110}; do
  curl http://localhost:3003/api/tools
done
```

## Deployment

### Render Deployment

1. Add environment variables in Render dashboard:
   - `REDIS_URL`: Your Redis connection string
   - `ENABLE_REDIS`: `true`

2. Recommended Redis providers for Render:
   - Upstash Redis
   - Redis Cloud

### Local Development

1. Install dependencies:
```bash
cd server
npm install
```

2. Set up Redis (see Redis Providers section)

3. Start the server:
```bash
npm run dev
```

## Disabling Redis

To disable Redis features entirely:

```bash
ENABLE_REDIS=false
```

This will:
- Skip Redis connection attempts
- Disable caching (requests go directly to Supabase)
- Disable rate limiting (all requests allowed)
- No impact on existing functionality

## Monitoring

### Health Check Endpoints

- `/health` - Basic server health
- `/health/redis` - Redis status, rate limiting, and cache statistics

### Cache Statistics

The `/health/redis` endpoint provides:
- Redis connection status
- Cache hit/miss statistics
- Rate limiting configuration
- Memory usage information

## Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   - Check `REDIS_URL` format
   - Verify Redis server is running
   - Check firewall settings

2. **Cache Not Working**
   - Verify `ENABLE_REDIS=true`
   - Check Redis connection in `/health/redis`
   - Look for cache logs in server console

3. **Rate Limiting Not Working**
   - Verify `ENABLE_REDIS=true`
   - Check rate limit configuration
   - Monitor `/health/redis` endpoint

### Logs

The server provides detailed logging:
- `🔗 Redis: Initializing connection...`
- `✅ Redis: Connected successfully`
- `📖 Cache: Hit for key "cache:tools:GET:/api/tools"`
- `❌ Cache: Miss for key "cache:tools:GET:/api/tools"`
- `🚫 Rate Limiter: IP 127.0.0.1 exceeded limit`

## Performance Benefits

### Caching Benefits
- **Response Time**: 90%+ reduction for cached requests
- **Database Load**: Reduced Supabase queries
- **Scalability**: Better handling of traffic spikes

### Rate Limiting Benefits
- **DDoS Protection**: Prevents abuse
- **Resource Management**: Protects server resources
- **Fair Usage**: Ensures fair access for all users

## Security Considerations

1. **Redis Security**
   - Use strong passwords
   - Enable SSL/TLS in production
   - Restrict network access

2. **Rate Limiting**
   - Configurable limits per endpoint
   - IP-based tracking
   - Graceful degradation

3. **Cache Security**
   - No sensitive data cached
   - Automatic expiration
   - Cache invalidation support 
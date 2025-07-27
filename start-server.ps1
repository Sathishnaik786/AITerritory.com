# ========================================
# AI TERRITORY SERVER STARTUP SCRIPT
# ========================================
# 
# This script starts the AI Territory server with Redis integration.
# 
# Usage: .\start-server.ps1
# 
# ========================================

Write-Host "🚀 Starting AI Territory Server with Redis Integration..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "server\package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "   Current directory: $(Get-Location)" -ForegroundColor Yellow
    Write-Host "   Expected: AITerritory.com directory with server subfolder" -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
if (-not (Test-Path "server\.env")) {
    Write-Host "⚠️  Warning: No .env file found in server directory" -ForegroundColor Yellow
    Write-Host "   Creating basic .env file..." -ForegroundColor Yellow
    
    # Create basic .env file
    @"
# AI Territory Server Environment Variables
PORT=3003
NODE_ENV=development

# Redis Configuration
REDIS_URL=redis://localhost:6379
ENABLE_REDIS=true

# Add your Supabase credentials here
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
"@ | Out-File -FilePath "server\.env" -Encoding UTF8
    
    Write-Host "   Created server\.env file with basic configuration" -ForegroundColor Green
    Write-Host "   Please update with your actual Supabase credentials" -ForegroundColor Yellow
}

# Check Redis configuration
Write-Host "🔍 Checking Redis configuration..." -ForegroundColor Cyan

# Load environment variables
if (Test-Path "server\.env") {
    Get-Content "server\.env" | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

$enableRedis = [Environment]::GetEnvironmentVariable("ENABLE_REDIS", "Process")
$redisUrl = [Environment]::GetEnvironmentVariable("REDIS_URL", "Process")

Write-Host "   ENABLE_REDIS: $enableRedis" -ForegroundColor White
Write-Host "   REDIS_URL: $redisUrl" -ForegroundColor White

if ($enableRedis -eq "true") {
    Write-Host "   ✅ Redis is enabled" -ForegroundColor Green
    Write-Host "   ℹ️  Server will use Redis for caching and rate limiting" -ForegroundColor Cyan
} else {
    Write-Host "   ⚠️  Redis is disabled" -ForegroundColor Yellow
    Write-Host "   ℹ️  Server will work without Redis (no caching/rate limiting)" -ForegroundColor Cyan
}

# Change to server directory
Set-Location "server"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Start the server
Write-Host "🚀 Starting server..." -ForegroundColor Green
Write-Host "   Health check: http://localhost:3003/health" -ForegroundColor Cyan
Write-Host "   Redis health: http://localhost:3003/health/redis" -ForegroundColor Cyan
Write-Host "   API base: http://localhost:3003/api" -ForegroundColor Cyan
Write-Host ""

npm run dev 
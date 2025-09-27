@echo off
echo ========================================
echo AI TERRITORY SERVER TEST
echo ========================================
echo.

echo Testing server functionality without Redis...
echo.

echo 1. Testing Basic Health Check...
curl -s http://localhost:3003/health
echo.
echo.

echo 2. Testing Redis Health Check...
curl -s http://localhost:3003/health/redis
echo.
echo.

echo 3. Testing Tools API...
curl -s http://localhost:3003/api/tools | findstr /C:"length"
echo.

echo 4. Testing Blogs API...
curl -s http://localhost:3003/api/blogs | findstr /C:"length"
echo.

echo ========================================
echo Test Complete!
echo ========================================
echo.
echo If you see JSON responses above, your server is working correctly.
echo The Redis connection errors in the server logs are expected since Redis is not running.
echo.
echo To enable Redis features:
echo 1. Install Redis locally or use a cloud provider
echo 2. Set ENABLE_REDIS=true in your .env file
echo 3. Restart the server
echo.
pause 
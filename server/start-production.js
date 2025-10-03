#!/usr/bin/env node

// Script to start both the API server and SSR server in production

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting AI Territory production servers...');

// Start the API server
const apiServer = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: process.env.API_PORT || '3001',
    NODE_ENV: 'production'
  }
});

// Start the SSR server
const ssrServer = spawn('node', ['production-ssr.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: process.env.PORT || '3000',
    API_PORT: process.env.API_PORT || '3001',
    NODE_ENV: 'production'
  }
});

// Handle errors
apiServer.on('error', (error) => {
  console.error('❌ API server error:', error);
  process.exit(1);
});

ssrServer.on('error', (error) => {
  console.error('❌ SSR server error:', error);
  process.exit(1);
});

// Handle exit events
apiServer.on('exit', (code) => {
  console.log(`API server exited with code ${code}`);
  if (code !== 0) {
    process.exit(code);
  }
});

ssrServer.on('exit', (code) => {
  console.log(`SSR server exited with code ${code}`);
  if (code !== 0) {
    process.exit(code);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  apiServer.kill('SIGTERM');
  ssrServer.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  apiServer.kill('SIGTERM');
  ssrServer.kill('SIGTERM');
  process.exit(0);
});

console.log('✅ Both servers started successfully');
console.log(`🌐 API server running on port ${process.env.API_PORT || '3001'}`);
console.log(`🌐 SSR server running on port ${process.env.PORT || '3000'}`);
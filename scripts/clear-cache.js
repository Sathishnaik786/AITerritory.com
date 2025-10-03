#!/usr/bin/env node

// Script to help with cache busting during deployment

const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing build cache...');

// Function to delete folder recursively
function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const filePath = path.join(folderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        deleteFolderRecursive(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
    fs.rmdirSync(folderPath);
    console.log(`Deleted folder: ${folderPath}`);
  }
}

// Clear dist folder
const distPath = path.join(__dirname, '..', 'dist');
deleteFolderRecursive(distPath);

// Clear node_modules/.vite cache
const viteCachePath = path.join(__dirname, '..', 'node_modules', '.vite');
if (fs.existsSync(viteCachePath)) {
  deleteFolderRecursive(viteCachePath);
  console.log('Cleared Vite cache');
}

console.log('✅ Cache clearing complete. Ready for fresh build.');
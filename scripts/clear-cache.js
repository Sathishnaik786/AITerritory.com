// Script to help with cache busting during deployment

import { existsSync, readdirSync, lstatSync, unlinkSync, rmdirSync } from 'fs';
import { join } from 'path';

console.log('🧹 Clearing build cache...');

// Function to delete folder recursively
function deleteFolderRecursive(folderPath) {
  if (existsSync(folderPath)) {
    readdirSync(folderPath).forEach((file) => {
      const filePath = join(folderPath, file);
      if (lstatSync(filePath).isDirectory()) {
        deleteFolderRecursive(filePath);
      } else {
        unlinkSync(filePath);
      }
    });
    rmdirSync(folderPath);
    console.log(`Deleted folder: ${folderPath}`);
  }
}

// Clear dist folder
const distPath = join(process.cwd(), 'dist');
deleteFolderRecursive(distPath);

// Clear node_modules/.vite cache
const viteCachePath = join(process.cwd(), 'node_modules', '.vite');
if (existsSync(viteCachePath)) {
  deleteFolderRecursive(viteCachePath);
  console.log('Cleared Vite cache');
}

console.log('✅ Cache clearing complete. Ready for fresh build.');
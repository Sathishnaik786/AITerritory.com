// Simple validation script for ShareButton component
console.log('Validating ShareButton component...');

// Check that the component file exists
const fs = require('fs');
const path = require('path');

const componentPath = path.join(__dirname, '../../../src/components/ShareButton.tsx');

if (fs.existsSync(componentPath)) {
  console.log('✓ ShareButton.tsx exists');
  
  // Read the file content
  const content = fs.readFileSync(componentPath, 'utf8');
  
  // Check for key components
  const hasShareButton = content.includes('export const ShareButton');
  const hasSharePlatforms = content.includes('SHARE_PLATFORMS');
  const hasVariants = content.includes('variant');
  
  if (hasShareButton) {
    console.log('✓ ShareButton component is exported');
  } else {
    console.log('✗ ShareButton component is not exported');
  }
  
  if (hasSharePlatforms) {
    console.log('✓ SHARE_PLATFORMS constant is defined');
  } else {
    console.log('✗ SHARE_PLATFORMS constant is not defined');
  }
  
  if (hasVariants) {
    console.log('✓ Component supports variants');
  } else {
    console.log('✗ Component does not support variants');
  }
  
  console.log('Validation complete.');
} else {
  console.log('✗ ShareButton.tsx does not exist');
}
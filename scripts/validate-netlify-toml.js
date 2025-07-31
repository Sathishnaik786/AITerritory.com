#!/usr/bin/env node

/**
 * Validate netlify.toml file for syntax errors
 * This script checks the TOML file before deployment to catch any issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function validateNetlifyToml() {
  console.log('🔍 Validating netlify.toml file...');
  
  try {
    const tomlPath = path.join(process.cwd(), 'netlify.toml');
    
    if (!fs.existsSync(tomlPath)) {
      console.error('❌ netlify.toml file not found');
      process.exit(1);
    }
    
    const content = fs.readFileSync(tomlPath, 'utf8');
    
    // Basic syntax checks
    const lines = content.split('\n');
    let lineNumber = 0;
    let inSection = false;
    let sectionStack = [];
    
    for (const line of lines) {
      lineNumber++;
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }
      
      // Check for section headers
      if (trimmedLine.startsWith('[')) {
        if (trimmedLine.startsWith('[[')) {
          // Array section
          const sectionName = trimmedLine.slice(2, -2);
          sectionStack.push(sectionName);
          console.log(`  ✅ Found array section: ${sectionName}`);
        } else {
          // Regular section
          const sectionName = trimmedLine.slice(1, -1);
          sectionStack.push(sectionName);
          console.log(`  ✅ Found section: ${sectionName}`);
        }
      } else if (trimmedLine.startsWith(']')) {
        // End of section
        if (sectionStack.length > 0) {
          sectionStack.pop();
        }
      }
      
      // Check for key-value pairs
      if (trimmedLine.includes('=') && !trimmedLine.startsWith('[')) {
        const [key, value] = trimmedLine.split('=', 2);
        if (!key.trim() || !value.trim()) {
          console.error(`  ❌ Invalid key-value pair at line ${lineNumber}: ${trimmedLine}`);
        }
      }
    }
    
    // Check for common issues
    const issues = [];
    
    // Check for duplicate regular sections (not array sections)
    const regularSections = content.match(/^\[([^\]]+)\]/gm);
    if (regularSections) {
      const sectionCounts = {};
      regularSections.forEach(section => {
        const sectionName = section.slice(1, -1);
        // Only count non-array sections as duplicates (array sections use [[ ]])
        // Skip sections that contain dots (like context.production.environment)
        if (!sectionName.includes('.') && !sectionName.includes('edge_functions') && !sectionName.includes('redirects')) {
          sectionCounts[sectionName] = (sectionCounts[sectionName] || 0) + 1;
        }
      });
      
      Object.entries(sectionCounts).forEach(([section, count]) => {
        if (count > 1) {
          issues.push(`Duplicate section: [${section}] appears ${count} times`);
        }
      });
    }
    
    // Check for unclosed quotes
    const quoteCount = (content.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) {
      issues.push('Unmatched quotes detected');
    }
    
    // Check for missing closing brackets
    const openBrackets = (content.match(/\[/g) || []).length;
    const closeBrackets = (content.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      issues.push('Unmatched brackets detected');
    }
    
    if (issues.length > 0) {
      console.error('❌ Found issues in netlify.toml:');
      issues.forEach(issue => console.error(`  - ${issue}`));
      process.exit(1);
    }
    
    console.log('✅ netlify.toml file is valid');
    console.log(`📊 File statistics:`);
    console.log(`  - Total lines: ${lines.length}`);
    console.log(`  - Sections found: ${sectionStack.length}`);
    console.log(`  - File size: ${(content.length / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Error validating netlify.toml:', error.message);
    process.exit(1);
  }
}

// Run validation if this script is executed directly
validateNetlifyToml();

export default validateNetlifyToml; 
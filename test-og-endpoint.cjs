const express = require('express');
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Test function to generate a category OG image
function generateCategoryOGImage(category) {
  try {
    // Capitalize category name
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    
    // Create canvas
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Draw background based on category
    let bgColor = '#1e40af'; // Default blue
    let borderColor = '#3b82f6';
    
    switch (category.toLowerCase()) {
      case 'men':
        bgColor = '#2563eb'; // Blue for men
        borderColor = '#3b82f6';
        break;
      case 'women':
        bgColor = '#ec4899'; // Pink for women
        borderColor = '#f472b6';
        break;
      case 'couple':
        bgColor = '#8b5cf6'; // Purple for couple
        borderColor = '#a78bfa';
        break;
    }
    
    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // Draw border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, width - 8, height - 8);
    
    // Draw text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AITerritory.org', width / 2, 120);
    
    // Draw category title
    ctx.font = 'bold 50px Arial';
    ctx.fillText(`${categoryName} Prompts`, width / 2, 250);
    
    // Draw description
    ctx.font = '30px Arial';
    ctx.fillText('Explore AI prompts for Google Gemini', width / 2, 320);
    
    // Draw footer
    ctx.font = '24px Arial';
    ctx.fillText('AI Prompts for Google Gemini', width / 2, height - 50);
    
    // Convert to buffer and save
    const buffer = canvas.toBuffer('image/png');
    
    // Save to public directory for static serving
    const publicDir = path.join(__dirname, 'public');
    const ogDir = path.join(publicDir, 'og');
    
    // Create directories if they don't exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    
    if (!fs.existsSync(ogDir)) {
      fs.mkdirSync(ogDir);
    }
    
    const imagePath = path.join(ogDir, `${category}.png`);
    fs.writeFileSync(imagePath, buffer);
    
    console.log(`✅ Generated OG image for ${category} at ${imagePath}`);
  } catch (error) {
    console.error('Error generating category OG image:', error);
  }
}

// Generate images for all categories
const categories = ['men', 'women', 'couple'];
categories.forEach(category => {
  generateCategoryOGImage(category);
});

console.log('✅ All category OG images generated successfully!');
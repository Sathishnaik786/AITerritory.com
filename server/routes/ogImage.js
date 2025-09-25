const express = require('express');
const router = express.Router();
const { createCanvas, registerFont } = require('canvas');
const path = require('path');
const fs = require('fs');
const { supabase } = require('../lib/supabase');

// Register a font if needed (you might need to add fonts to your project)
// registerFont(path.join(__dirname, '../fonts/Roboto-Regular.ttf'), { family: 'Roboto' });

// Generate OG image for a prompt
router.get('/prompts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch the prompt from the database
    const { data: prompt, error } = await supabase
      .from('gemini_prompts')
      .select('prompt, category')
      .eq('id', id)
      .single();
      
    if (error || !prompt) {
      // Fallback to default image if prompt not found
      return res.redirect('/og-default.png');
    }
    
    const promptTitle = prompt.prompt.substring(0, 100) + (prompt.prompt.length > 100 ? '...' : '');
    const promptCategory = prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1);
    
    // Create canvas
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Draw background based on category
    let bgColor = '#1e40af'; // Default blue
    let borderColor = '#3b82f6';
    
    switch (prompt.category.toLowerCase()) {
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
    
    // Draw prompt title (wrapped)
    ctx.font = 'bold 40px Arial';
    
    // Simple text wrapping
    const words = promptTitle.split(' ');
    let line = '';
    let y = 250;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > width - 100 && i > 0) {
        ctx.fillText(line, width / 2, y);
        line = words[i] + ' ';
        y += 50;
      } else {
        line = testLine;
      }
    }
    
    ctx.fillText(line, width / 2, y);
    
    // Draw category
    ctx.font = '30px Arial';
    ctx.fillText(`Category: ${promptCategory}`, width / 2, y + 70);
    
    // Draw footer
    ctx.font = '24px Arial';
    ctx.fillText('AI Prompts for Google Gemini', width / 2, height - 50);
    
    // Convert to buffer and send
    const buffer = canvas.toBuffer('image/png');
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(buffer);
  } catch (error) {
    console.error('Error generating OG image:', error);
    // Fallback to default image
    res.redirect('/og-default.png');
  }
});

// Generate category-specific OG image
router.get('/categories/:category', (req, res) => {
  try {
    const { category } = req.params;
    
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
    
    // Convert to buffer and send
    const buffer = canvas.toBuffer('image/png');
    
    // Save to public directory for static serving
    const imagePath = path.join(__dirname, '../../public/og', `${category}.png`);
    fs.writeFileSync(imagePath, buffer);
    
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(buffer);
  } catch (error) {
    console.error('Error generating category OG image:', error);
    // Fallback to default image
    res.redirect('/og-default.png');
  }
});

module.exports = router;
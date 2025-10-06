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
    
    // Fetch the prompt from the database including image_url
    const { data: prompt, error } = await supabase
      .from('gemini_prompts')
      .select('prompt, category, image_url')
      .eq('id', id)
      .single();
      
    if (error || !prompt) {
      // Fallback to default image if prompt not found
      return res.redirect('/og-default.png');
    }
    
    // If prompt has an image_url, redirect to it
    if (prompt.image_url && prompt.image_url.trim() !== '') {
      // Redirect to the prompt's image
      return res.redirect(prompt.image_url);
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
      default:
        bgColor = '#1e40af'; // Default blue
        borderColor = '#3b82f6';
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

// Generate OG image for a blog
router.get('/blogs/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Fetch the blog from the database
    const { data: blog, error } = await supabase
      .from('blogs')
      .select('title, description, cover_image_url, category, author_name')
      .eq('slug', slug)
      .single();
      
    if (error || !blog) {
      // Fallback to default image if blog not found
      return res.redirect('/og-default.png');
    }
    
    // If blog has a cover_image_url, redirect to it
    if (blog.cover_image_url && blog.cover_image_url.trim() !== '') {
      // Redirect to the blog's cover image
      return res.redirect(blog.cover_image_url);
    }
    
    const blogTitle = blog.title.substring(0, 100) + (blog.title.length > 100 ? '...' : '');
    const blogAuthor = blog.author_name || 'AITerritory';
    const blogCategory = blog.category ? blog.category.charAt(0).toUpperCase() + blog.category.slice(1) : 'Blog';
    
    // Create canvas
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Draw background - using a gradient for blogs
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#4b6cb7');
    gradient.addColorStop(1, '#182848');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, width - 8, height - 8);
    
    // Draw text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AITerritory.org', width / 2, 120);
    
    // Draw blog title (wrapped)
    ctx.font = 'bold 40px Arial';
    
    // Simple text wrapping
    const words = blogTitle.split(' ');
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
    
    // Draw author and category
    ctx.font = '30px Arial';
    ctx.fillText(`By ${blogAuthor}`, width / 2, y + 70);
    if (blogCategory) {
      ctx.fillText(`Category: ${blogCategory}`, width / 2, y + 120);
    }
    
    // Draw footer
    ctx.font = '24px Arial';
    ctx.fillText('AI Tools & Insights', width / 2, height - 50);
    
    // Convert to buffer and send
    const buffer = canvas.toBuffer('image/png');
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(buffer);
  } catch (error) {
    console.error('Error generating blog OG image:', error);
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
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import dotenv from 'dotenv';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Initialize Supabase client with VITE_ prefixed variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Using anon key for read access

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing required environment variables. Please check your .env file.');
  console.log('Required variables:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Base URL for your site
const siteUrl = 'https://aiterritory.org';

// Static pages to include in the sitemap
const staticPages = [
  { url: '/', lastmod: '2025-09-18', changefreq: 'daily', priority: '1.0' },
  { url: '/blog', lastmod: '2025-09-18', changefreq: 'daily', priority: '0.9' },
  { url: '/gemini-prompts', lastmod: '2025-01-15', changefreq: 'daily', priority: '0.9' },
  { url: '/gemini-prompts/men', lastmod: '2025-01-15', changefreq: 'daily', priority: '0.8' },
  { url: '/gemini-prompts/women', lastmod: '2025-01-15', changefreq: 'daily', priority: '0.8' },
  { url: '/gemini-prompts/couple', lastmod: '2025-01-15', changefreq: 'daily', priority: '0.8' },
  { url: '/gemini-prompts/all', lastmod: '2025-01-15', changefreq: 'daily', priority: '0.8' },
  { url: '/about', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.8' },
  { url: '/contact', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.8' },
  { url: '/privacy', lastmod: '2024-01-01', changefreq: 'yearly', priority: '0.5' },
  { url: '/terms', lastmod: '2024-01-01', changefreq: 'yearly', priority: '0.5' },
  
  // Company pages
  { url: '/company/contact-us', lastmod: '2025-01-15', changefreq: 'monthly', priority: '0.8' },
  { url: '/company/submit-tool', lastmod: '2025-01-15', changefreq: 'weekly', priority: '0.7' },
  { url: '/company/advertise', lastmod: '2025-01-15', changefreq: 'monthly', priority: '0.6' },
  { url: '/company/youtube-channel', lastmod: '2025-01-15', changefreq: 'monthly', priority: '0.6' },
  
  // Tool category pages
  { url: '/all-ai-tools', lastmod: '2025-01-15', changefreq: 'daily', priority: '0.9' },
  { url: '/video-tools', lastmod: '2025-01-15', changefreq: 'daily', priority: '0.8' },
  { url: '/categories/productivity-tools', lastmod: '2025-01-15', changefreq: 'daily', priority: '0.8' },
  { url: '/categories/image-generators', lastmod: '2025-01-15', changefreq: 'daily', priority: '0.8' },
  { url: '/categories/text-generators', lastmod: '2025-01-15', changefreq: 'daily', priority: '0.8' },
  
  // Resource pages
  { url: '/resources', lastmod: '2025-01-15', changefreq: 'weekly', priority: '0.7' },
  { url: '/resources/ai-automation', lastmod: '2025-01-15', changefreq: 'weekly', priority: '0.7' },
  { url: '/resources/ai-tutorials', lastmod: '2025-01-15', changefreq: 'weekly', priority: '0.7' },
  { url: '/resources/ai-innovation', lastmod: '2025-01-15', changefreq: 'weekly', priority: '0.7' },
  { url: '/resources/ai-agents', lastmod: '2025-01-15', changefreq: 'weekly', priority: '0.7' },
];

// Simple slugify function
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Fetch all published blog posts from Supabase
async function fetchBlogPosts() {
  try {
    const { data: posts, error } = await supabase
      .from('blogs')
      .select('slug, created_at, title, featured')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return posts.map(post => ({
      url: `/blog/${post.slug}`,
      lastmod: post.created_at,
      changefreq: 'weekly',
      priority: post.featured ? '0.9' : '0.8',
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Fetch high-quality Gemini prompts from Supabase
async function fetchGeminiPrompts() {
  try {
    const { data: prompts, error } = await supabase
      .from('gemini_prompts')
      .select('id, prompt, category, created_at, status, submitted_via, submitter_name')
      .eq('status', 'published')
      .not('prompt', 'is', null)
      .gte('length(prompt)', 30) // Only prompts with meaningful content
      .order('created_at', { ascending: false })
      .limit(100); // Increased limit for better coverage

    if (error) throw error;
    
    return prompts
      .filter(prompt => {
        // Enhanced quality checks
        const placeholderTexts = ['test', 'example', 'sample', 'placeholder', 'lorem ipsum', 'demo'];
        const isPlaceholder = placeholderTexts.some(text => 
          prompt.prompt.toLowerCase().includes(text)
        );
        
        // Check for meaningful content
        const hasMeaningfulContent = prompt.prompt.length > 30 && 
                                   !isPlaceholder && 
                                   prompt.prompt.trim().length > 0;
        
        // Check if not test data
        const isNotTestData = prompt.submitted_via !== 'test' && 
                             prompt.submitted_via !== 'demo';
        
        return hasMeaningfulContent && isNotTestData;
      })
      .map(prompt => {
        // Create a slug from the first 50 characters of the prompt
        const promptSlug = slugify(prompt.prompt.substring(0, 50)) || prompt.id;
        return {
          url: `/gemini-prompts/${prompt.category}/${promptSlug}-${prompt.id}`,
          lastmod: prompt.created_at,
          changefreq: 'weekly', // More frequent updates for prompts
          priority: '0.6', // Higher priority for quality prompts
        };
      });
  } catch (error) {
    console.error('Error fetching Gemini prompts:', error);
    return [];
  }
}

// Generate the sitemap XML
function generateSitemap(pages) {
  const urls = pages.map(page => {
    const lastmod = page.lastmod ? format(new Date(page.lastmod), 'yyyy-MM-dd') : null;
    return `
    <url>
      <loc>${siteUrl}${page.url}</loc>
      ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${urls}
</urlset>`;
}

// Main function to generate and save the sitemap
async function generateAndSaveSitemap() {
  try {
    console.log('Generating sitemap...');
    
    // Fetch dynamic content
    const blogPosts = await fetchBlogPosts();
    const geminiPrompts = await fetchGeminiPrompts();
    
    // Combine static and dynamic pages
    const allPages = [...staticPages, ...blogPosts, ...geminiPrompts];
    
    // Generate the sitemap XML
    const sitemap = generateSitemap(allPages);
    
    // Ensure public directory exists
    const publicDir = join(process.cwd(), 'public');
    try {
      await import('fs').then(fs => fs.promises.mkdir(publicDir, { recursive: true }));
    } catch (err) {
      // Directory already exists
    }
    
    // Write to public directory
    const sitemapPath = join(publicDir, 'sitemap.xml');
    writeFileSync(sitemapPath, sitemap);
    
    console.log(`✅ Sitemap generated successfully at: ${sitemapPath}`);
    console.log(`📊 Total URLs: ${allPages.length}`);
    console.log(`📁 Breakdown:
   - Static pages: ${staticPages.length}
   - Blog posts: ${blogPosts.length}
   - Gemini prompts: ${geminiPrompts.length}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the script
generateAndSaveSitemap();
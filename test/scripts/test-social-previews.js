import { createClient } from '@supabase/supabase-js';
import open from 'open';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Initialize Supabase client with VITE_ prefixed variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing required environment variables. Please check your .env file.');
  console.log('Required variables:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Get the first published blog post
async function getLatestBlogPost() {
  try {
    console.log('🔍 Fetching latest blog post...');
    const { data: post, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    if (!post) {
      console.log('ℹ️ No published blog posts found');
      return null;
    }
    
    console.log(`✅ Found blog post: "${post.title}"`);
    return post;
  } catch (error) {
    console.error('❌ Error fetching blog post:', error.message);
    return null;
  }
}

// Test social previews
async function testSocialPreviews() {
  try {
    console.log('🚀 Starting social media preview test...');
    
    const post = await getLatestBlogPost();
    if (!post) {
      console.error('❌ No published blog posts available for testing');
      return;
    }

    const siteUrl = 'https://aiterritory.org';
    const postUrl = `${siteUrl}/blog/${post.slug}`;
    
    console.log(`\n🌐 Blog Post URL: ${postUrl}`);
    
    // Facebook Sharing Debugger
    const facebookDebuggerUrl = `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(postUrl)}`;
    
    // Twitter Card Validator
    const twitterValidatorUrl = `https://cards-dev.twitter.com/validator?url=${encodeURIComponent(postUrl)}`;
    
    // LinkedIn Post Inspector
    const linkedinInspectorUrl = `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(postUrl)}`;

    console.log('\n🔗 Social Media Preview Links:');
    console.log('1. Facebook Sharing Debugger:');
    console.log(`   ${facebookDebuggerUrl}`);
    
    console.log('\n2. Twitter Card Validator:');
    console.log(`   ${twitterValidatorUrl}`);
    
    console.log('\n3. LinkedIn Post Inspector:');
    console.log(`   ${linkedinInspectorUrl}`);
    
    // Open the URLs in the default browser
    console.log('\n🌐 Opening URLs in your default browser...');
    try {
      await open(facebookDebuggerUrl);
      await open(twitterValidatorUrl);
      await open(linkedinInspectorUrl);
      console.log('\n✅ All social media preview tools opened successfully!');
    } catch (error) {
      console.error('❌ Error opening browser windows:', error.message);
      console.log('\n⚠️  Please manually visit the following URLs to test social media previews:');
      console.log(`- Facebook: ${facebookDebuggerUrl}`);
      console.log(`- Twitter: ${twitterValidatorUrl}`);
      console.log(`- LinkedIn: ${linkedinInspectorUrl}`);
    }
    
    console.log('\n🔍 What to check for each platform:');
    console.log('- Facebook: Verify the correct title, description, and image appear');
    console.log('- Twitter: Check that the card type is "summary_large_image"');
    console.log('- LinkedIn: Ensure the preview matches your OpenGraph tags');
    
  } catch (error) {
    console.error('❌ Unexpected error during social preview test:', error);
  } finally {
    console.log('\n✨ Social media preview test completed!');
  }
}

// Run the script
testSocialPreviews();

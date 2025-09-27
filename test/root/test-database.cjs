require('dotenv').config({path: './server/.env'});
const { createClient } = require('@supabase/supabase-js');

console.log('Testing database connection...');

// Check if environment variables are loaded
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Present' : 'Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testConnection() {
  try {
    // Test apple_carousel_cards table
    console.log('\n--- Testing apple_carousel_cards table ---');
    const { data: appleData, error: appleError } = await supabase
      .from('apple_carousel_cards')
      .select('*')
      .limit(1);
    
    if (appleError) {
      console.error('Apple Carousel Error:', appleError.message);
    } else {
      console.log('Apple Carousel Success:', appleData ? `Found ${appleData.length} records` : 'No data');
    }
    
    // Test testimonials table
    console.log('\n--- Testing testimonials table ---');
    const { data: testimonialsData, error: testimonialsError } = await supabase
      .from('testimonials')
      .select('*')
      .limit(1);
    
    if (testimonialsError) {
      console.error('Testimonials Error:', testimonialsError.message);
    } else {
      console.log('Testimonials Success:', testimonialsData ? `Found ${testimonialsData.length} records` : 'No data');
    }
    
    // Test gemini_prompts table
    console.log('\n--- Testing gemini_prompts table ---');
    const { data: geminiData, error: geminiError } = await supabase
      .from('gemini_prompts')
      .select('*')
      .limit(1);
    
    if (geminiError) {
      console.error('Gemini Prompts Error:', geminiError.message);
    } else {
      console.log('Gemini Prompts Success:', geminiData ? `Found ${geminiData.length} records` : 'No data');
    }
    
  } catch (error) {
    console.error('Database connection error:', error.message);
  }
}

testConnection();
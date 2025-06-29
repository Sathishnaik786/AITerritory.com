require('dotenv').config();
const supabase = require('../config/database');

async function testTestimonials() {
  try {
    console.log('Testing testimonials functionality...');
    
    // Test 1: Check if testimonials table exists and has data
    const { data: testimonials, error: fetchError } = await supabase
      .from('testimonials')
      .select('*')
      .limit(5);
    
    if (fetchError) {
      console.error('Error fetching testimonials:', fetchError);
      return;
    }
    
    console.log('Current testimonials in database:', testimonials?.length || 0);
    if (testimonials && testimonials.length > 0) {
      testimonials.forEach((t, i) => {
        console.log(`${i + 1}. ${t.user_name} - ${t.content.substring(0, 50)}...`);
      });
    }
    
    console.log('✅ Testimonials test completed!');
    
  } catch (error) {
    console.error('❌ Testimonials test failed:', error);
  }
}

testTestimonials()
  .then(() => {
    console.log('Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  }); 
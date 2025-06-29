require('dotenv').config();
const supabase = require('./config/database');

async function testCategories() {
  try {
    console.log('Testing categories...');
    const { data, error } = await supabase.from('categories').select('*');
    
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Categories found:', data.length);
      data.forEach(cat => {
        console.log(`- ${cat.name} (slug: ${cat.slug}, id: ${cat.id})`);
      });
    }
  } catch (err) {
    console.error('Exception:', err);
  }
  process.exit();
}

testCategories(); 
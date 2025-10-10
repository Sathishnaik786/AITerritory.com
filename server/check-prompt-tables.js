const { supabase } = require('./lib/supabase');

async function checkPromptTables() {
  console.log('Checking prompt interaction tables...');
  
  const tables = ['prompt_likes', 'prompt_shares', 'prompt_comments', 'apple_carousel_cards', 'testimonials'];
  
  for (const table of tables) {
    try {
      console.log(`\nChecking table: ${table}`);
      
      // Try to get table info
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.log(`  Error accessing table ${table}:`, error.message);
      } else {
        console.log(`  Table ${table} exists and is accessible`);
        if (data && data.length > 0) {
          console.log(`  Sample row from ${table}:`, Object.keys(data[0]));
        } else {
          console.log(`  Table ${table} is empty`);
        }
      }
    } catch (err) {
      console.error(`  Unexpected error with table ${table}:`, err.message);
    }
  }
}

checkPromptTables();
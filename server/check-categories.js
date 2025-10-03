const { supabase } = require('./lib/supabase');

async function checkCategories() {
  console.log('Checking valid categories in gemini_prompts table...');
  
  try {
    // Get distinct categories
    const { data, error } = await supabase
      .from('gemini_prompts')
      .select('category')
      .neq('category', null);
      
    if (error) {
      console.error('Error querying categories:', error);
      return;
    }
    
    // Get unique categories
    const uniqueCategories = [...new Set(data.map(item => item.category))];
    console.log('Valid categories:', uniqueCategories);
    
    // Check constraint details
    console.log('Sample rows with different categories:');
    for (const category of uniqueCategories.slice(0, 3)) {
      const { data: sampleData, error: sampleError } = await supabase
        .from('gemini_prompts')
        .select('*')
        .eq('category', category)
        .limit(1);
        
      if (!sampleError && sampleData && sampleData.length > 0) {
        console.log(`  ${category}:`, sampleData[0]);
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkCategories();
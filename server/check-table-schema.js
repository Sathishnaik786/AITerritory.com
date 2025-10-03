const { supabase } = require('./lib/supabase');

async function checkTableSchema() {
  console.log('Checking gemini_prompts table schema...');
  
  try {
    // Get column information from Supabase
    const { data, error } = await supabase.rpc('get_columns', {
      table_name: 'gemini_prompts'
    });
    
    if (error) {
      console.log('Error using get_columns RPC:', error);
      console.log('Trying alternative method...');
      
      // Alternative method - get a sample row and check its properties
      const { data: sampleData, error: sampleError } = await supabase
        .from('gemini_prompts')
        .select('*')
        .limit(1);
        
      if (sampleError) {
        console.error('Error getting sample data:', sampleError);
        return;
      }
      
      if (sampleData && sampleData.length > 0) {
        console.log('Sample row structure:');
        const row = sampleData[0];
        Object.keys(row).forEach(key => {
          console.log(`  ${key}: ${typeof row[key]}`);
        });
      } else {
        console.log('No data found in table');
      }
      
      return;
    }
    
    console.log('Table columns:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkTableSchema();
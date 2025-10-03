const { supabase } = require('./lib/supabase');

async function testGeminiTable() {
  console.log('Testing Gemini Prompts table structure...');
  
  try {
    // Try to get table info
    const { data, error } = await supabase
      .from('gemini_prompts')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('Error querying gemini_prompts table:', error);
      return;
    }
    
    console.log('Table exists and is accessible');
    console.log('Sample row structure:', data[0]);
    
    // Try to get table schema
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'gemini_prompts');
      
    if (columnsError) {
      console.error('Error getting table schema:', columnsError);
      return;
    }
    
    console.log('Table columns:');
    columns.forEach(column => {
      console.log(`  ${column.column_name}: ${column.data_type} (${column.is_nullable})`);
    });
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testGeminiTable();
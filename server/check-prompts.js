const { supabase } = require('./lib/supabase');

async function checkPrompts() {
  console.log('Checking existing prompts...');
  
  try {
    const { data, error } = await supabase
      .from('gemini_prompts')
      .select('*')
      .limit(5);
      
    if (error) {
      console.log('Error fetching prompts:', error.message);
      return;
    }
    
    console.log('Found prompts:');
    data.forEach(prompt => {
      console.log(`  ID: ${prompt.id}, Prompt: ${prompt.prompt.substring(0, 50)}...`);
    });
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

checkPrompts();
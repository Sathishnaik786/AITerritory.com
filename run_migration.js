const fs = require('fs');
const { supabase } = require('./server/lib/supabase');

async function runMigration() {
  try {
    console.log('Reading SQL migration file...');
    const sqlContent = fs.readFileSync('./fix_all_likes_bookmarks_comments.sql', 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error(`Error in statement ${i + 1}:`, error);
          console.error('Statement:', statement);
        } else {
          console.log(`Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`Error executing statement ${i + 1}:`, err);
        console.error('Statement:', statement);
      }
    }
    
    console.log('Migration completed!');
  } catch (error) {
    console.error('Error running migration:', error);
  }
}

runMigration(); 
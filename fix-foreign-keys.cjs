import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixForeignKeys() {
  console.log('🔧 Fixing foreign key constraints...');
  
  try {
    // Drop existing constraints
    console.log('🗑️  Dropping existing constraints...');
    let { error: dropError1 } = await supabase.rpc('execute_sql', {
      sql: 'ALTER TABLE prompt_likes DROP CONSTRAINT IF EXISTS prompt_likes_prompt_id_fkey'
    });
    
    if (dropError1) {
      console.warn('Warning dropping prompt_likes constraint:', dropError1);
    }
    
    let { error: dropError2 } = await supabase.rpc('execute_sql', {
      sql: 'ALTER TABLE prompt_bookmarks DROP CONSTRAINT IF EXISTS prompt_bookmarks_prompt_id_fkey'
    });
    
    if (dropError2) {
      console.warn('Warning dropping prompt_bookmarks constraint:', dropError2);
    }
    
    let { error: dropError3 } = await supabase.rpc('execute_sql', {
      sql: 'ALTER TABLE prompt_comments DROP CONSTRAINT IF EXISTS prompt_comments_prompt_id_fkey'
    });
    
    if (dropError3) {
      console.warn('Warning dropping prompt_comments constraint:', dropError3);
    }
    
    // Add new constraints
    console.log('🔗 Adding new constraints...');
    let { error: addError1 } = await supabase.rpc('execute_sql', {
      sql: 'ALTER TABLE prompt_likes ADD CONSTRAINT prompt_likes_prompt_id_fkey FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) ON DELETE CASCADE'
    });
    
    if (addError1) {
      console.error('Error adding prompt_likes constraint:', addError1);
    } else {
      console.log('✅ Added prompt_likes constraint');
    }
    
    let { error: addError2 } = await supabase.rpc('execute_sql', {
      sql: 'ALTER TABLE prompt_bookmarks ADD CONSTRAINT prompt_bookmarks_prompt_id_fkey FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) ON DELETE CASCADE'
    });
    
    if (addError2) {
      console.error('Error adding prompt_bookmarks constraint:', addError2);
    } else {
      console.log('✅ Added prompt_bookmarks constraint');
    }
    
    let { error: addError3 } = await supabase.rpc('execute_sql', {
      sql: 'ALTER TABLE prompt_comments ADD CONSTRAINT prompt_comments_prompt_id_fkey FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) ON DELETE CASCADE'
    });
    
    if (addError3) {
      console.error('Error adding prompt_comments constraint:', addError3);
    } else {
      console.log('✅ Added prompt_comments constraint');
    }
    
    console.log('✅ Foreign key constraints fixed!');
  } catch (error) {
    console.error('❌ Error fixing foreign keys:', error);
  }
}

fixForeignKeys();
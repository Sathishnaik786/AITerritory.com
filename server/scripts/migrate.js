import { readFileSync } from 'fs';
import { supabaseAdmin } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function runMigrations() {
  try {
    console.log('🚀 Running database migrations...');

    // Read the migration file
    const migrationSQL = readFileSync('./database/migrations/001_initial_schema.sql', 'utf8');

    // Execute the migration
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      console.error('❌ Migration failed:', error);
      return;
    }

    console.log('✅ Migration completed successfully!');
    console.log('📋 Created tables:');
    console.log('   - categories');
    console.log('   - tools');
    console.log('   - tags');
    console.log('   - tool_tags');
    console.log('   - sub_tools');
    console.log('   - reviews');
    console.log('🔒 Row Level Security enabled');
    console.log('📈 Indexes created for performance');

  } catch (error) {
    console.error('❌ Error running migrations:', error);
  }
}

// Alternative method if rpc doesn't work
async function runMigrationsAlternative() {
  try {
    console.log('🚀 Running database migrations (alternative method)...');
    console.log('⚠️  Please run the SQL migration manually in Supabase dashboard:');
    console.log('   1. Go to your Supabase project dashboard');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Copy and paste the contents of ./database/migrations/001_initial_schema.sql');
    console.log('   4. Execute the SQL');
    console.log('   5. Then run: npm run seed');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Try main method first, fallback to alternative
runMigrations().catch(() => {
  console.log('\n🔄 Trying alternative migration method...');
  runMigrationsAlternative();
});
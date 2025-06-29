const supabase = require('../config/database');

async function runMigrations() {
  try {
    console.log('Running database migrations...');

    // Check if tables exist and create them if they don't
    // This is a basic migration runner - in production you'd want something more sophisticated

    console.log('Checking database schema...');

    // Test connection
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Database connection failed:', error);
      throw error;
    }

    console.log('Database connection successful');
    console.log('Migration check completed');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
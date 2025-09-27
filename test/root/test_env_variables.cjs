require('dotenv').config();

console.log('Testing environment variables...\n');

console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
console.log('PORT:', process.env.PORT || '8080 (default)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development (default)');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('\n❌ Missing Supabase environment variables!');
  console.log('Please check that your .env file is in the server directory and contains:');
  console.log('SUPABASE_URL=https://ckahkadgnaxzcfhmsdaj.supabase.co');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key');
} else {
  console.log('\n✅ Environment variables are properly set!');
} 
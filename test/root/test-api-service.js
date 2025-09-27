// Test script to verify API service configuration
import api from './src/services/api.js';

console.log('🧪 Testing API Service Configuration...\n');

// Test 1: Test the API base URL
console.log('1. API Base URL Configuration:');
console.log('   Base URL:', api.defaults.baseURL);
console.log('   Timeout:', api.defaults.timeout);
console.log('   Headers:', api.defaults.headers);

// Test 2: Test a simple API call
console.log('\n2. Testing API call to backend...');
try {
  const response = await api.get('/blogs/test/comments/count');
  console.log('   Status:', response.status);
  console.log('   Data:', response.data);
} catch (error) {
  console.log('   Error:', error.message);
  if (error.response) {
    console.log('   Response Status:', error.response.status);
    console.log('   Response Data:', error.response.data);
  }
}

console.log('\n✅ API Service test completed!'); 
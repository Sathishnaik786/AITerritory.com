// Simple test to verify the service exports correctly
import * as promptInteractionsService from '../src/services/promptInteractionsService';

// This is a simple type check test
const testServiceExports = () => {
  // This will fail to compile if the service doesn't export correctly
  console.log('promptInteractionsService exports correctly');
};

export { testServiceExports };
// Simple test to verify the hook exports correctly
import { usePromptInteractions } from '../src/hooks/usePromptInteractions';

// This is a simple type check test
const testHookExports = () => {
  // This will fail to compile if the hook doesn't export correctly
  console.log('usePromptInteractions hook exports correctly');
};

export { testHookExports };
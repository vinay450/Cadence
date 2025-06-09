import { testClaudeAnalysis } from './lib/test-claude';

console.log('Starting Claude Integration Test...\n');

testClaudeAnalysis()
  .then(() => {
    console.log('\nTest completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nTest failed:', error);
    process.exit(1);
  }); 
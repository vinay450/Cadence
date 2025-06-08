import { analyzeDataset } from './claude';

// Sample CSV data
const sampleData = `
date,temperature,humidity,air_quality
2024-01-01,72,65,good
2024-01-02,75,70,moderate
2024-01-03,68,75,good
2024-01-04,70,68,good
2024-01-05,73,72,moderate
`;

export async function testClaudeAnalysis() {
  try {
    console.log('Testing Claude Integration...');
    console.log('Analyzing sample weather data...\n');

    const response = await analyzeDataset({
      dataContent: sampleData,
      fileType: 'csv',
      question: 'What are the trends in temperature and humidity? Is there any correlation with air quality?'
    });

    console.log('Analysis Results:');
    console.log('----------------');
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error during analysis:', error);
    throw error;
  }
}

// Run the test
testClaudeAnalysis(); 
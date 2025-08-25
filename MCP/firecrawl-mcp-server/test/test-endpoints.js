#!/usr/bin/env node

/**
 * Simple test script to verify the versioned endpoints are working correctly
 * This script tests the health endpoint and basic connectivity
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const TEST_API_KEY = process.env.TEST_API_KEY || 'test-api-key';

async function testHealthEndpoint() {
  console.log('🏥 Testing health endpoint...');
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Health endpoint working');
      console.log('📋 Available versions:', data.versions);
      console.log('🔗 Endpoints:', JSON.stringify(data.endpoints, null, 2));
      return true;
    } else {
      console.log('❌ Health endpoint failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Health endpoint error:', error.message);
    return false;
  }
}

async function testSSEEndpoint(version = '') {
  const versionPath = version === 'v2' ? '/v2' : '';
  const endpoint = `${BASE_URL}/${TEST_API_KEY}${versionPath}/sse`;
  
  console.log(`🔌 Testing ${version || 'V1'} SSE endpoint: ${endpoint}`);
  
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(endpoint, {
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });
    
    if (response.ok) {
      console.log(`✅ ${version || 'V1'} SSE endpoint accessible`);
      // Close the connection immediately for testing
      response.body?.destroy();
      return true;
    } else {
      console.log(`❌ ${version || 'V1'} SSE endpoint failed:`, response.status);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${version || 'V1'} SSE endpoint error:`, error.message);
    return false;
  }
}

async function testInvalidEndpoint() {
  console.log('🚫 Testing invalid endpoint...');
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${BASE_URL}/invalid-endpoint`);
    const data = await response.json();
    
    if (response.status === 404) {
      console.log('✅ Invalid endpoint correctly returns 404');
      console.log('📋 Error response:', data.error);
      return true;
    } else {
      console.log('❌ Invalid endpoint should return 404, got:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Invalid endpoint test error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Starting endpoint tests...');
  console.log(`🎯 Base URL: ${BASE_URL}`);
  console.log(`🔑 Test API Key: ${TEST_API_KEY}`);
  console.log('');
  
  const results = [];
  
  // Test health endpoint
  results.push(await testHealthEndpoint());
  console.log('');
  
  // Test V1 SSE endpoint
  results.push(await testSSEEndpoint(''));
  console.log('');
  
  // Test V2 SSE endpoint
  results.push(await testSSEEndpoint('v2'));
  console.log('');
  
  // Test invalid endpoint
  results.push(await testInvalidEndpoint());
  console.log('');
  
  // Summary
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('💥 Some tests failed!');
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node test-endpoints.js [options]

Options:
  --help, -h     Show this help message
  
Environment Variables:
  TEST_BASE_URL  Base URL for testing (default: http://localhost:3000)
  TEST_API_KEY   API key for testing (default: test-api-key)

Examples:
  node test-endpoints.js
  TEST_BASE_URL=http://localhost:8080 node test-endpoints.js
  TEST_API_KEY=my-real-key node test-endpoints.js
`);
  process.exit(0);
}

// Run the tests
runTests().catch((error) => {
  console.error('💥 Test runner error:', error);
  process.exit(1);
});

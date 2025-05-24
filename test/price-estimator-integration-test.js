// filepath: e:\realestate\test\price-estimator-integration-test.js
/**
 * Price Estimator Integration Test
 * 
 * This script tests the full integration between:
 * 1. The ML API endpoints
 * 2. The backend proxy API
 * 3. The frontend PriceEstimator component
 * 
 * To run this test:
 * 1. Ensure the ML API is running: cd e:/realestate/ML-api && python app.py
 * 2. Ensure the backend API is running: cd e:/realestate/api && npm start
 * 3. Run this test: cd e:/realestate && node test/price-estimator-integration-test.js
 */

import fetch from 'node-fetch';
import chalk from 'chalk';

const ML_API_URL = 'http://localhost:5001/predict';
const BACKEND_API_URL = 'http://localhost:3000/api/ml/predict';

const testProperty = {
  house_square_feet: 2500,
  bed_rooms: 4,
  bathrooms: 3,
  land_size_perch: 15,
  property_type: 'Residential',
  stories: 2,
  furnished: 1,
  pool: 1,
  build_year: 2015,
  location: 'Colombo'
};

const logSuccess = (message) => console.log(chalk.green('✓ ' + message));
const logError = (message) => console.log(chalk.red('✗ ' + message));
const logInfo = (message) => console.log(chalk.blue('ℹ ' + message));

async function runTests() {
  console.log(chalk.yellow.bold('===== PRICE ESTIMATOR INTEGRATION TESTS ====='));
  let allTestsPassed = true;
  
  // Test 1: Direct ML API connection
  try {
    logInfo('TEST 1: Direct ML API connection');
    const response = await fetch(ML_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testProperty)
    });
    
    if (!response.ok) {
      throw new Error(`ML API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data && typeof data.predicted_price === 'number') {
      logSuccess(`ML API returned predicted price: ${data.predicted_price}`);
    } else {
      throw new Error('ML API did not return a valid predicted price');
    }
  } catch (error) {
    logError(`ML API test failed: ${error.message}`);
    allTestsPassed = false;
  }
  
  // Test 2: Backend Proxy API connection
  try {
    logInfo('TEST 2: Backend Proxy API connection');
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testProperty)
    });
    
    if (!response.ok) {
      throw new Error(`Backend API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data && typeof data.predicted_price === 'number') {
      logSuccess(`Backend API returned predicted price: ${data.predicted_price}`);
      
      // Check if the response includes the enriched data we added
      if (data.timestamp && data.request_params) {
        logSuccess('Backend API correctly enriched the response with metadata');
      } else {
        logError('Backend API did not enrich the response with expected metadata');
        allTestsPassed = false;
      }
    } else {
      throw new Error('Backend API did not return a valid predicted price');
    }
  } catch (error) {
    logError(`Backend API test failed: ${error.message}`);
    allTestsPassed = false;
  }
  
  // Test 3: Error handling test - missing required fields
  try {
    logInfo('TEST 3: Error handling - missing required fields');
    const invalidProperty = {
      // Missing bedrooms and bathrooms
      house_square_feet: 2000
    };
    
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidProperty)
    });
    
    const data = await response.json();
    
    if (response.status === 400 && data.status === 'error' && data.error) {
      logSuccess('Backend API correctly returned error for missing required fields');
    } else {
      throw new Error('Backend API did not return proper error response for invalid input');
    }
  } catch (error) {
    logError(`Error handling test failed: ${error.message}`);
    allTestsPassed = false;
  }
  
  // Final results
  console.log(chalk.yellow('===== TEST RESULTS ====='));
  if (allTestsPassed) {
    logSuccess('All integration tests passed successfully');
    console.log(chalk.green('The price estimator integration is working properly!'));
  } else {
    logError('Some integration tests failed');
    console.log(chalk.red('Please check the issues above and fix them before proceeding.'));
  }
}

runTests().catch(error => {
  logError(`Test runner encountered an error: ${error.message}`);
  process.exit(1);
});

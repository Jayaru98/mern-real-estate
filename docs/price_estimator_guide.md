# AI Price Estimator Feature Guide

## Overview
The AI Price Estimator is a machine learning-powered feature that helps property owners and agents determine optimal listing prices based on property features and market trends. This guide explains how to use the feature and provides technical details about the implementation.

## For Users: How to Use the Price Estimator

### When Creating a New Listing:
1. Navigate to the "Create Listing" page
2. Fill in your property details (at minimum: square feet, bedrooms, bathrooms)
3. Click the "Show Price Estimator" button in the property details section
4. Click the "Estimate Price" button to get an AI-powered price prediction
5. If you like the suggested price, click "Use this estimate as my listing price" to automatically apply it
6. Continue filling in the remaining listing details and submit your listing

### When Updating an Existing Listing:
1. Navigate to the "Update Listing" page for your property
2. The existing property details will be loaded
3. Click the "Show Price Estimator" button
4. Click "Estimate Price" to get an updated price prediction based on current market data
5. Apply the suggested price if desired
6. Save your updated listing

## For Developers: Technical Implementation

### Architecture Overview:
- **Frontend**: React components with UI elements for triggering price estimation
- **Backend Proxy**: Node.js/Express API that forwards requests to ML service
- **ML API**: Python Flask service that processes data and returns price predictions

### Key Components:
1. **PriceEstimator.jsx**: React component that handles user interaction and API communication
2. **ML Controllers/Routes**: Backend proxy that forwards requests to the ML API
3. **app.py**: Flask API that provides the ML prediction endpoint
4. **data_cleaner.py**: Handles data preprocessing and price rounding

### Data Flow:
1. User enters property details in the React UI
2. Frontend sends property data to backend proxy (`/api/ml/predict`)
3. Backend forwards request to ML API (`http://localhost:5001/predict`)
4. ML API processes data through the trained model and returns a prediction
5. Prediction is displayed to the user who can choose to apply it

### Price Rounding Logic:
The system applies intelligent price rounding based on the property's price range:
- 100,000-1,000,000: round to nearest 1,000
- 1,000,000-10,000,000: round to nearest 10,000
- 10,000,000-100,000,000: round to nearest 100,000
- 100,000,000-1,000,000,000: round to nearest 1,000,000

## Troubleshooting

### Common Issues:
1. **Price Estimator Not Showing**:
   - Ensure you've entered at least the square footage, bedrooms, and bathrooms
   - Check that the ML API service is running at localhost:5001

2. **Estimation Errors**:
   - Verify that all numeric inputs contain valid numbers
   - Check server logs for specific error messages
   - Ensure the ML API service is running

3. **Unexpected Price Estimates**:
   - The model works best with properties similar to those in the training data
   - Very unique or unusual properties may receive less accurate estimates

### Server Requirements:
- ML API must be running on port 5001
- Backend API must be running on port 3000
- Frontend development server typically runs on port 5173

## Future Enhancements
- Integration with external market data APIs for more accurate predictions
- Adding historical price trends visualization
- Support for more property types and features
- Confidence scores with price estimates
- Automated periodic model retraining with new data

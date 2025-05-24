# Real Estate Platform with ML Price Prediction

This project is a real estate listing platform with AI-powered price prediction capabilities. It allows users to create property listings with assistance from a machine learning model that suggests optimal listing prices based on property details.

## Features

- User authentication and profile management
- Property listings creation and management 
- Advanced search with filtering options
- ML-powered price prediction for new/updated listings
- Intelligent price rounding based on property value range

## Project Structure

- **Frontend**: React.js application with Redux for state management
- **Backend API**: Express.js server with MongoDB database
- **ML API**: Python Flask API with scikit-learn for price predictions

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- Python 3.8+ with pip
- MongoDB database

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd realestate
   ```

2. Install backend dependencies:
   ```
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd client
   npm install
   ```

4. Install ML API dependencies:
   ```
   cd ../ML-api
   pip install -r requirements.txt
   ```

5. Create .env file in the root directory and add your MongoDB connection string and JWT secret:
   ```
   MONGO=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret
   ```

### Running the Application

1. Start the ML API:
   ```
   cd ML-api
   python app.py
   ```

2. Start the backend server:
   ```
   cd ..
   npm start
   ```

3. Start the frontend client:
   ```
   cd client
   npm run dev
   ```

## The Price Estimator Feature

The AI Price Estimator helps users determine optimal listing prices for their properties based on machine learning analysis of similar properties in the market.

### How to Use

1. When creating or updating a property listing, fill in the property details.
2. Click "Show Price Estimator" to reveal the AI estimator panel.
3. Click "Estimate Price" to get an AI-powered price prediction.
4. If you're satisfied with the estimate, click "Use this estimate as my listing price".

### How It Works

The price estimator uses a Random Forest model trained on thousands of real estate listings. The model:

- Takes into account features like square footage, bedrooms, bathrooms, location, etc.
- Applies feature engineering to extract additional insights
- Removes outliers to increase accuracy
- Rounds prices intelligently based on the property's price range:
  - 100,000-1,000,000: round to nearest 1,000
  - 1,000,000-10,000,000: round to nearest 10,000
  - 10,000,000-100,000,000: round to nearest 100,000
  - 100,000,000-1,000,000,000: round to nearest 1,000,000

## Testing

You can test the application's integration points with:

```
npm test
```

Or use the automated test runner:

```
# On Linux/macOS:
./run_tests.sh

# On Windows:
.\run_tests.ps1
```

## Documentation

For more detailed documentation, see:

- [Price Estimator Guide](./docs/price_estimator_guide.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Real Estate Price Prediction API

This is a Flask API for predicting real estate prices using a Random Forest Regressor model.

## Features

- Predict house prices based on area, bedrooms, bathrooms, location, and age
- Sample dataset included
- CORS enabled for frontend integration
- Simple and easy to use endpoints

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the API:
```bash
python app.py
```

The API will run on `http://localhost:5000`

## API Endpoints

### 1. Predict Price
- **URL**: `/predict`
- **Method**: `POST`
- **Data**: 
```json
{
    "area": 1500,
    "bedrooms": 3,
    "bathrooms": 2,
    "location": 1,
    "age": 5
}
```
- **Response**:
```json
{
    "predicted_price": 250000,
    "status": "success"
}
```

### 2. Get Sample Data
- **URL**: `/sample-data`
- **Method**: `GET`
- **Response**: Returns the sample dataset used for training

## Location Codes
- 1: Suburban
- 2: Urban
- 3: Downtown

## Note
This is a sample implementation with a small dataset. For production use, you should:
1. Use a larger, more diverse dataset
2. Add more features
3. Implement proper model validation
4. Add authentication
5. Add rate limiting
6. Use a proper database 
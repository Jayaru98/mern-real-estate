from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

app = Flask(__name__)
CORS(app)

# Sample dataset
data = {
    'area': [1500, 2000, 1200, 1800, 2200, 1600, 1900, 2100, 1400, 1700],
    'bedrooms': [3, 4, 2, 3, 4, 3, 3, 4, 2, 3],
    'bathrooms': [2, 2.5, 1.5, 2, 2.5, 2, 2, 2.5, 1.5, 2],
    'location': [1, 2, 1, 2, 3, 1, 2, 3, 1, 2],  # 1: Suburban, 2: Urban, 3: Downtown
    'age': [5, 10, 2, 8, 15, 3, 7, 12, 1, 6],
    'price': [250000, 350000, 180000, 300000, 400000, 220000, 320000, 380000, 200000, 280000]
}

# Create DataFrame
df = pd.DataFrame(data)

# Features and target
X = df[['area', 'bedrooms', 'bathrooms', 'location', 'age']]
y = df['price']

# Train the model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# Save the model
model_path = 'model.joblib'
joblib.dump(model, model_path)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Extract features from request
        area = float(data['area'])
        bedrooms = int(data['bedrooms'])
        bathrooms = float(data['bathrooms'])
        location = int(data['location'])
        age = int(data['age'])
        
        # Create feature array
        features = np.array([[area, bedrooms, bathrooms, location, age]])
        
        # Load the model
        model = joblib.load(model_path)
        
        # Make prediction
        prediction = model.predict(features)
        
        # Return prediction
        return jsonify({
            'predicted_price': float(prediction[0]),
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400

@app.route('/sample-data', methods=['GET'])
def get_sample_data():
    return jsonify(data)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 
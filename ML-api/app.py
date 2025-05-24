from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os
from data_cleaner import clean_data

app = Flask(__name__)
CORS(app)

# process dataset and save
print("Cleaning dataset and rounding prices...")
df = clean_data()  # This loads, cleans and returns the dataset

# Calculate feature importance and select features
print("Selecting features for model training...")

# Features selection based on domain knowledge
numerical_features = ['house_square_feet', 'bed_rooms', 'bathrooms', 'land_size_perch', 'property_age']
categorical_features = ['location', 'stories', 'property_type']
binary_features = ['pool', 'furnished']

# Check that all features exist in the dataset
features_to_use = []
for feature in numerical_features + categorical_features + binary_features:
    if feature in df.columns:
        features_to_use.append(feature)
    else:
        print(f"Warning: Feature '{feature}' not found in dataset")

# Add engineered features if they exist
engineered_features = ['price_per_sqft', 'total_rooms']
for feature in engineered_features:
    if feature in df.columns:
        features_to_use.append(feature)
        print(f"Added engineered feature: {feature}")

# Convert categorical features to one-hot encoding
print("Converting categorical features to one-hot encoding...")
df_encoded = pd.get_dummies(df, columns=categorical_features, drop_first=True)

# Select the features for the model
X = df_encoded[[col for col in df_encoded.columns if col != 'price']]
y = df_encoded['price']

print(f"Training model with {X.shape[1]} features and {len(y)} samples")

# Train the model with more trees and improved parameters
model = RandomForestRegressor(
    n_estimators=200,  # More trees for better accuracy
    max_depth=20,      # Control depth to prevent overfitting
    min_samples_split=5,
    min_samples_leaf=2,
    n_jobs=-1,         # Use all available cores
    random_state=42
)

# Train the model
model.fit(X, y)

# Print feature importance
feature_importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': model.feature_importances_
})
feature_importance = feature_importance.sort_values('Importance', ascending=False)
print("\nTop 10 important features:")
print(feature_importance.head(10))

# Save the model
model_path = 'model.joblib'
joblib.dump(model, model_path)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Extract features from request
        input_data = {}
        for feature in features_to_use:
            if feature in data:
                input_data[feature] = data[feature]
            else:
                print(f"Warning: Feature '{feature}' not provided in request")
        
        # Handle categorical features - encode them same way as training data
        # Create a DataFrame to use pandas get_dummies
        input_df = pd.DataFrame([input_data])
        
        # Calculate engineered features if not provided
        if 'property_age' not in input_df.columns and 'build_year' in input_df.columns:
            input_df['property_age'] = 2025 - input_df['build_year']
        
        if 'price_per_sqft' not in input_df.columns and 'house_square_feet' in input_df.columns:
            # Set a default price for calculation (will be overwritten by prediction)
            input_df['price_per_sqft'] = 0
            
        if 'total_rooms' not in input_df.columns and 'bed_rooms' in input_df.columns and 'bathrooms' in input_df.columns:
            input_df['total_rooms'] = input_df['bed_rooms'] + input_df['bathrooms']
        
        # One-hot encode categorical features
        for cat_feature in categorical_features:
            if cat_feature in input_df.columns:
                input_df = pd.get_dummies(input_df, columns=[cat_feature], drop_first=True)
        
        # Ensure all columns from training set exist in the input data
        for column in X.columns:
            if column not in input_df.columns:
                input_df[column] = 0
        
        # Reorder columns to match training data
        input_df = input_df[X.columns]
        
        # Load the model
        model = joblib.load(model_path)
        
        # Make prediction
        prediction = model.predict(input_df)
        
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
    sample = df.head(10).to_dict(orient='records')
    return jsonify(sample)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True) 
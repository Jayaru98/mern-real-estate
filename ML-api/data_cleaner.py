import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

def round_price(price):
    """
    Round the price based on its range:
    - 100,000 to 1,000,000: round to nearest 1,000
    - 1,000,000 to 10,000,000: round to nearest 10,000
    - 10,000,000 to 100,000,000: round to nearest 100,000
    - 100,000,000 to 1,000,000,000: round to nearest 1,000,000
    """
    if 100_000 <= price < 1_000_000:
        return round(price / 1_000) * 1_000
    elif 1_000_000 <= price < 10_000_000:
        return round(price / 10_000) * 10_000
    elif 10_000_000 <= price < 100_000_000:
        return round(price / 100_000) * 100_000
    elif 100_000_000 <= price < 1_000_000_000:
        return round(price / 1_000_000) * 1_000_000
    else:
        return price  # Keep original price for values outside specified ranges

def clean_data():
    """
    Load the initial dataset, clean the price data by rounding according to criteria,
    and save the cleaned dataset.
    """
    # Define file paths
    input_path = os.path.join(os.path.dirname(__file__), 'data', 'initialDataset.csv')
    output_path = os.path.join(os.path.dirname(__file__), 'data', 'cleanedDataset.csv')    # Read the dataset
    df = None
    try:
        # Try to read the CSV without any comment handling first
        df = pd.read_csv(input_path)
        
        # Check if we have the price column
        if 'price' not in df.columns:
            print(f"Warning: 'price' column not found in headers: {df.columns.tolist()}")
            # Maybe the headers are in a different format - try with different parameter
            df = pd.read_csv(input_path, comment='/', encoding='utf-8')
    except Exception as e:
        print(f"Error reading CSV: {e}")
        # Try with a different approach - read raw text first
        with open(input_path, 'r') as f:
            lines = f.readlines()
            if lines and lines[0].startswith('//'):
                # If the first line is a comment, skip it
                df = pd.read_csv(input_path, skiprows=1)
            else:
                # Try again with explicit parameters
                df = pd.read_csv(input_path, encoding='utf-8', engine='python')
    
    # Print some information about the dataset
    print(f"Dataset loaded with {len(df)} records")
    print(f"Columns in dataset: {df.columns.tolist()}")
      # Apply the rounding function to the price column
    if 'price' in df.columns:
        print(f"Price range before rounding: {df['price'].min()} to {df['price'].max()}")
        df['price'] = df['price'].apply(round_price)
        print(f"Price range after rounding: {df['price'].min()} to {df['price'].max()}")
    
    # Additional preprocessing steps
    print("Applying additional preprocessing steps...")
    
    # 1. Handle missing values
    print("Checking for missing values...")
    missing_values = df.isnull().sum()
    print(f"Missing values before imputation:\n{missing_values[missing_values > 0]}")
    
    # 2. Convert categorical yes/no to binary
    binary_columns = ['pool', 'furnished']
    for col in binary_columns:
        if col in df.columns:
            df[col] = df[col].map({'yes': 1, 'no': 0})
    
    # 3. Calculate property age
    current_year = 2025  # Current year
    if 'build_year' in df.columns:
        df['property_age'] = current_year - df['build_year']
        print(f"Added property_age feature (current year: {current_year})")
    
    # 4. Create price per square foot feature
    if 'house_square_feet' in df.columns and 'price' in df.columns:
        df['price_per_sqft'] = df['price'] / df['house_square_feet']
        print("Added price_per_sqft feature")
    
    # 5. Create total rooms feature
    room_columns = ['bed_rooms', 'bathrooms']
    if all(col in df.columns for col in room_columns):
        df['total_rooms'] = df['bed_rooms'] + df['bathrooms']
        print("Added total_rooms feature")
    
    # 6. Remove outliers
    if 'price' in df.columns:
        # Calculate IQR for price
        Q1 = df['price'].quantile(0.25)
        Q3 = df['price'].quantile(0.75)
        IQR = Q3 - Q1
        
        # Define bounds for outliers
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        
        # Get initial length
        initial_len = len(df)
        
        # Filter out outliers
        df = df[(df['price'] >= lower_bound) & (df['price'] <= upper_bound)]
        
        # Print outlier information
        print(f"Removed {initial_len - len(df)} price outliers")
    
    # 7. Log transform skewed numerical features
    if 'price' in df.columns:
        # Check skewness before transformation
        price_skew = df['price'].skew()
        print(f"Price skewness before transformation: {price_skew:.2f}")
        
        # Apply log transformation to price (for analysis purposes, not stored)
        log_price = np.log1p(df['price'])
        log_price_skew = log_price.skew()
        print(f"Price skewness after log transformation: {log_price_skew:.2f}")
    
    # Save the cleaned dataset
    df.to_csv(output_path, index=False)
    print(f"Cleaned dataset with {len(df)} records saved to {output_path}")
    
    return df

if __name__ == "__main__":
    print("Running data_cleaner directly")
    # Execute data cleaning when run as a script
    clean_data()
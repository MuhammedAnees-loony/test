from flask import Flask, request, jsonify, send_file
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)

# Load the model
model = joblib.load('flaskapp/lgbm_model4.sav')

# Directory containing the CSV files
directory_path = r'user'  # Replace with your actual directory path

@app.route('/')
def home():
    return "Welcome to the LightGBM Model API!"

@app.route('/predict', methods=['POST'])
def predict():
    # Ensure the directory exists
    if not os.path.exists(directory_path):
        return jsonify({'error': 'CSV directory does not exist'}), 400

    # Features expected by the model
    features = ['vehicle_id', 'start_time', 'end_time', 'start_x', 'start_y', 'end_x', 'end_y', 'distance', 'average_speed']

    # Process each CSV file in the directory
    for file_name in os.listdir(directory_path):
        if file_name.endswith('.csv'):
            file_path = os.path.join(directory_path, file_name)
            df = pd.read_csv(file_path)

            # Check if the necessary features are in the DataFrame
            if not all(feature in df.columns for feature in features):
                return jsonify({'error': f'Missing required input features in {file_name}'}), 400

            # Extract the input features
            input_data = df[features].values

            # Predict the fee
            predictions = model.predict(input_data)

            # Add the predictions to the DataFrame
            df['fee'] = predictions

            # Save the updated DataFrame back to the CSV file
            df.to_csv(file_path, index=False)

    return jsonify({'success': 'Predictions made and files updated successfully'}), 200

@app.route('/users', methods=['GET'])
def get_users():
    # Path to the user CSV file
    user_csv_path = os.path.join(directory_path, 'users.csv')
    if not os.path.exists(user_csv_path):
        return jsonify({'error': 'User CSV file does not exist'}), 400

    # Read the user CSV file
    user_data = pd.read_csv(user_csv_path)
    user_json = user_data.to_json(orient='records')
    return jsonify(user_json), 200

@app.route('/journeys', methods=['GET'])
def get_journeys():
    # Path to the journey CSV file
    journey_csv_path = os.path.join(directory_path, 'journeys.csv')
    if not os.path.exists(journey_csv_path):
        return jsonify({'error': 'Journey CSV file does not exist'}), 400

    # Read the journey CSV file
    journey_data = pd.read_csv(journey_csv_path)
    journey_json = journey_data.to_json(orient='records')
    return jsonify(journey_json), 200

if name == '__main__':
    app.run(debug=True)

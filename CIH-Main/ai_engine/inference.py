import joblib
import pandas as pd
import os

# Load model once when this module is imported
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'rul_predictor.joblib')

try:
    model = joblib.load(MODEL_PATH)
    print("AI Engine: Model loaded successfully.")
except Exception as e:
    print(f"AI Engine Error: Could not load model. Run train_model.py first! {e}")
    model = None

def predict_rul(sensor_data):
    """
    Expects a dictionary or list of sensor values.
    Returns: Predicted RUL (float)
    """
    if model is None:
        return -1

    # The model expects specific column names (same as training)
    feature_names = ['s_2', 's_3', 's_4', 's_7', 's_8', 's_9', 's_11', 
                     's_12', 's_13', 's_14', 's_15', 's_17', 's_20', 's_21']
    
    # If input is a list, convert to dict
    if isinstance(sensor_data, list):
        # ensure length matches
        if len(sensor_data) != len(feature_names):
             # Handle cases where input might include other cols (like unit_nr)
             # This is a safe fallback for the hackathon
             pass 
        data_df = pd.DataFrame([sensor_data], columns=feature_names)
    
    # If input is already a DataFrame or Dict
    else:
        data_df = pd.DataFrame([sensor_data])
        # Filter to ensure only correct columns are passed
        data_df = data_df[feature_names]

    prediction = model.predict(data_df)
    return float(prediction[0])
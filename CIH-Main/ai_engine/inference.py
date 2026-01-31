import joblib
import pandas as pd
import numpy as np
import os
from collections import deque

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'rul_predictor.joblib')

# Load Model
try:
    model = joblib.load(MODEL_PATH)
    print("AI Engine: Hybrid Model loaded.")
except Exception as e:
    print(f"Error: {e}")
    model = None

# Define the exact features the model was trained on
# (Original Sensors + Rolling Mean Sensors)
ORIGINAL_SENSORS = [
    'LPC_Outlet_Temp', 'HPC_Outlet_Temp', 'LPT_Outlet_Temp', 
    'HPC_Outlet_Pressure', 'Fan_Speed', 'Core_Speed', 
    'Combustion_Pressure', 'Fuel_Flow_Ratio', 'Corrected_Fan_Speed', 
    'Corrected_Core_Speed', 'Bypass_Ratio', 'Bleed_Enthalpy', 
    'HPT_Coolant_Bleed', 'LPT_Coolant_Bleed'
]

# This is the order the model expects
SENSOR_ORDER = ORIGINAL_SENSORS

class StatefulPredictor:
    def __init__(self):
        self.history = deque(maxlen=10)

    def predict(self, current_sensor_data):
        if model is None: return 0.0
        
        # 1. Update History
        clean_row = {k: current_sensor_data.get(k, 0) for k in SENSOR_ORDER}
        self.history.append(clean_row)
        
        # 2. Calculate Rolling Means
        history_df = pd.DataFrame(list(self.history))
        rolling_means = history_df.mean().to_dict()
        
        # 3. Construct Input Data
        input_data = {}
        for sensor in SENSOR_ORDER:
            input_data[sensor] = clean_row[sensor]
        for sensor in SENSOR_ORDER:
            input_data[f"{sensor}_mean"] = rolling_means[sensor]
            
        # 4. Create DataFrame & FORCE Column Order
        # This prevents the "feature_names_in_" crash
        expected_cols = SENSOR_ORDER + [f"{s}_mean" for s in SENSOR_ORDER]
        input_df = pd.DataFrame([input_data])
        
        # Select columns in the exact order training used
        input_df = input_df[expected_cols]

        prediction = model.predict(input_df)
        return float(prediction[0])
    
    
# Create a global instance
predictor = StatefulPredictor()

def predict_rul(sensor_data):
    # Wrapper function to keep compatibility with backend
    return predictor.predict(sensor_data)

def reset_predictor():
    """Reset the predictor history to start fresh"""
    global predictor
    predictor = StatefulPredictor()
    return True
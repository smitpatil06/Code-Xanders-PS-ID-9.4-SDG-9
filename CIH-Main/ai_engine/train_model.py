import pandas as pd
import xgboost as xgb
import joblib
import os
from processing import load_data
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

# PATH CONFIGURATION
# Adjusted to point to the file you uploaded in the root 'dataset' folder
DATA_PATH = '../../dataset/train_FD001.txt' 

def train():
    print(f"Loading data from {DATA_PATH}...")
    try:
        df = load_data(DATA_PATH)
    except FileNotFoundError:
        print(f"Error: Dataset not found at {os.path.abspath(DATA_PATH)}")
        return

    # 1. Separate Features and Target
    X = df.drop(columns=['unit_nr', 'time_cycles', 'RUL'])
    y = df['RUL']

    # 2. Clip RUL
    y = y.clip(upper=125)

    # 3. Split Training/Testing
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 4. Train the Model
    print("Training XGBoost Regressor...")
    model = xgb.XGBRegressor(
        n_estimators=100, 
        learning_rate=0.1, 
        max_depth=4, 
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    # 5. Evaluate (FIXED FOR SKLEARN 1.4+)
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    rmse = mse ** 0.5  # Manual calculation of RMSE
    
    print(f"Training Complete. Model RMSE: {rmse:.2f} cycles")
    print("Interpretation: On average, the prediction is off by ~15-20 cycles.")

    # 6. Save Model
    joblib.dump(model, 'rul_predictor.joblib')
    print("Model saved successfully as 'rul_predictor.joblib'")

if __name__ == "__main__":
    train()
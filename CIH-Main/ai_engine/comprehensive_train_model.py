"""
COMPREHENSIVE NASA C-MAPSS RUL PREDICTION MODEL
================================================
This script trains on ALL 4 FD datasets (FD001, FD002, FD003, FD004)
and creates a robust multi-dataset model.

Dataset Characteristics:
- FD001: Single operating condition, single fault mode (HPC degradation)
- FD002: Six operating conditions, single fault mode
- FD003: Single operating condition, two fault modes (HPC + Fan degradation)
- FD004: Six operating conditions, two fault modes

By training on all datasets, the model becomes more robust and generalized.
"""

import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import warnings
warnings.filterwarnings('ignore')

# ============================================================================
# NASA C-MAPSS SENSOR ABBREVIATIONS
# ============================================================================
"""
Engine Components:
- LPC  = Low Pressure Compressor
- HPC  = High Pressure Compressor  
- HPT  = High Pressure Turbine
- LPT  = Low Pressure Turbine

Sensors (21 total, but we use 14 most informative ones):
1.  T2  = Total temperature at fan inlet (°R)
2.  T24 = Total temperature at LPC outlet (°R) -> LPC_Outlet_Temp
3.  T30 = Total temperature at HPC outlet (°R) -> HPC_Outlet_Temp
4.  T50 = Total temperature at LPT outlet (°R) -> LPT_Outlet_Temp
5.  P2  = Pressure at fan inlet (psia)
6.  P15 = Total pressure in bypass-duct (psia) -> HPC_Outlet_Pressure
7.  P30 = Total pressure at HPC outlet (psia)
8.  Nf  = Physical fan speed (rpm) -> Fan_Speed
9.  Nc  = Physical core speed (rpm) -> Core_Speed
10. Ps30 = Static pressure at HPC outlet (psia) -> Combustion_Pressure
11. phi = Ratio of fuel flow to Ps30 -> Fuel_Flow_Ratio
12. NRf = Corrected fan speed (rpm) -> Corrected_Fan_Speed
13. NRc = Corrected core speed (rpm) -> Corrected_Core_Speed
14. BPR = Bypass Ratio -> Bypass_Ratio
15. farB = Burner fuel-air ratio
16. htBleed = Bleed Enthalpy -> Bleed_Enthalpy
17. W31 = HPT coolant bleed (lbm/s) -> HPT_Coolant_Bleed
18. W32 = LPT coolant bleed (lbm/s) -> LPT_Coolant_Bleed (Vibration proxy)
"""

# Paths to all datasets
DATASET_PATHS = {
    'FD001': {
        'train': '../../dataset/train_FD001.txt',
        'test': '../../dataset/test_FD001.txt',
        'rul': '../../dataset/RUL_FD001.txt'
    },
    'FD002': {
        'train': '../../dataset/train_FD002.txt',
        'test': '../../dataset/test_FD002.txt',
        'rul': '../../dataset/RUL_FD002.txt'
    },
    'FD003': {
        'train': '../../dataset/train_FD003.txt',
        'test': '../../dataset/test_FD003.txt',
        'rul': '../../dataset/RUL_FD003.txt'
    },
    'FD004': {
        'train': '../../dataset/train_FD004.txt',
        'test': '../../dataset/test_FD004.txt',
        'rul': '../../dataset/RUL_FD004.txt'
    }
}

def load_and_process_data(filepath):
    """
    Load NASA C-MAPSS data and perform comprehensive preprocessing
    """
    # Standard NASA columns
    index_names = ['unit_nr', 'time_cycles']
    setting_names = ['setting_1', 'setting_2', 'setting_3']
    sensor_names = ['s_{}'.format(i) for i in range(1, 22)]
    col_names = index_names + setting_names + sensor_names
    
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset not found: {os.path.abspath(filepath)}")
    
    # Load data
    df = pd.read_csv(filepath, sep=r'\s+', header=None, names=col_names)
    
    # Calculate RUL
    max_cycles = df.groupby('unit_nr')['time_cycles'].max().reset_index()
    max_cycles.columns = ['unit_nr', 'max']
    df = df.merge(max_cycles, on='unit_nr', how='left')
    df['RUL'] = df['max'] - df['time_cycles']
    
    # Clip RUL to max 125 (as per NASA recommendations)
    df['RUL'] = df['RUL'].clip(upper=125)
    
    # Rename sensors to meaningful names
    sensor_map = {
        's_2': 'LPC_Outlet_Temp',
        's_3': 'HPC_Outlet_Temp',
        's_4': 'LPT_Outlet_Temp',
        's_7': 'HPC_Outlet_Pressure',
        's_8': 'Fan_Speed',
        's_9': 'Core_Speed',
        's_11': 'Combustion_Pressure',
        's_12': 'Fuel_Flow_Ratio',
        's_13': 'Corrected_Fan_Speed',
        's_14': 'Corrected_Core_Speed',
        's_15': 'Bypass_Ratio',
        's_17': 'Bleed_Enthalpy',
        's_20': 'HPT_Coolant_Bleed',
        's_21': 'LPT_Coolant_Bleed'  # This is vibration-related
    }
    df = df.rename(columns=sensor_map)
    
    # Drop useless columns (constant or very low variance)
    drop_cols = ['max', 'setting_1', 'setting_2', 'setting_3',
                 's_1', 's_5', 's_6', 's_10', 's_16', 's_18', 's_19']
    df = df.drop(columns=[c for c in drop_cols if c in df.columns])
    
    # Feature Engineering: Rolling averages (temporal features)
    sensors = list(sensor_map.values())
    df_rolling = df.groupby('unit_nr')[sensors].rolling(window=10, min_periods=1).mean().reset_index(drop=True)
    df_rolling.columns = [f"{col}_mean" for col in sensors]
    df = pd.concat([df, df_rolling], axis=1)
    
    # Additional features: Rate of change
    df_diff = df.groupby('unit_nr')[sensors].diff().reset_index(drop=True)
    df_diff.columns = [f"{col}_diff" for col in sensors]
    df = pd.concat([df, df_diff], axis=1)
    
    # Fill NaN values from diff operation
    df = df.fillna(0)
    
    return df

def train_multi_dataset_model():
    """
    Train a unified model on ALL NASA C-MAPSS datasets
    """
    print("="*80)
    print("MULTI-DATASET TURBOFAN RUL PREDICTION MODEL")
    print("="*80)
    print("\nLoading and processing all datasets...")
    
    all_train_data = []
    
    # Load all training datasets
    for dataset_name, paths in DATASET_PATHS.items():
        print(f"\nProcessing {dataset_name}...")
        try:
            df = load_and_process_data(paths['train'])
            df['dataset'] = dataset_name  # Add dataset identifier
            all_train_data.append(df)
            print(f"  ✓ {dataset_name}: {len(df)} samples, {df['unit_nr'].nunique()} engines")
        except FileNotFoundError as e:
            print(f"  ✗ {dataset_name}: {e}")
            continue
    
    if not all_train_data:
        raise ValueError("No datasets could be loaded!")
    
    # Combine all training data
    print("\nCombining all datasets...")
    combined_df = pd.concat(all_train_data, ignore_index=True)
    print(f"Total training samples: {len(combined_df)}")
    print(f"Total engines: {combined_df['unit_nr'].nunique()}")
    
    # Prepare features
    feature_cols = [col for col in combined_df.columns 
                   if col not in ['unit_nr', 'time_cycles', 'RUL', 'dataset']]
    
    X = combined_df[feature_cols]
    y = combined_df['RUL']
    
    print(f"\nFeature count: {len(feature_cols)}")
    print(f"Feature types: {len([c for c in feature_cols if '_mean' in c])} rolling means, "
          f"{len([c for c in feature_cols if '_diff' in c])} derivatives, "
          f"{len([c for c in feature_cols if '_mean' not in c and '_diff' not in c])} original")
    
    # Split for validation
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.15, random_state=42
    )
    
    # Train XGBoost model
    print("\nTraining XGBoost model...")
    print("Hyperparameters:")
    print("  - n_estimators: 200")
    print("  - max_depth: 6")
    print("  - learning_rate: 0.05")
    print("  - subsample: 0.8")
    print("  - colsample_bytree: 0.8")
    
    model = xgb.XGBRegressor(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        objective='reg:squarederror',
        n_jobs=-1,
        random_state=42
    )
    
    # Fit without early stopping for compatibility
    print("Training in progress...")
    model.fit(X_train, y_train, verbose=False)
    
    # Evaluate
    print("\nModel Performance:")
    print("-" * 50)
    
    # Training performance
    train_pred = model.predict(X_train)
    train_rmse = np.sqrt(mean_squared_error(y_train, train_pred))
    train_mae = mean_absolute_error(y_train, train_pred)
    train_r2 = r2_score(y_train, train_pred)
    
    print(f"Training Set:")
    print(f"  RMSE: {train_rmse:.2f} cycles")
    print(f"  MAE:  {train_mae:.2f} cycles")
    print(f"  R²:   {train_r2:.4f}")
    
    # Validation performance
    val_pred = model.predict(X_val)
    val_rmse = np.sqrt(mean_squared_error(y_val, val_pred))
    val_mae = mean_absolute_error(y_val, val_pred)
    val_r2 = r2_score(y_val, val_pred)
    
    print(f"\nValidation Set:")
    print(f"  RMSE: {val_rmse:.2f} cycles")
    print(f"  MAE:  {val_mae:.2f} cycles")
    print(f"  R²:   {val_r2:.4f}")
    
    # Feature importance
    print("\nTop 10 Most Important Features:")
    print("-" * 50)
    feature_importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    for idx, row in feature_importance.head(10).iterrows():
        print(f"  {row['feature']:30s} {row['importance']:.4f}")
    
    # Save model
    model_path = 'multi_dataset_rul_predictor.joblib'
    joblib.dump(model, model_path)
    print(f"\n✓ Model saved to: {model_path}")
    
    # Save feature names for inference
    feature_info = {
        'features': feature_cols,
        'sensor_mapping': {
            'LPC_Outlet_Temp': 'Low Pressure Compressor Outlet Temperature',
            'HPC_Outlet_Temp': 'High Pressure Compressor Outlet Temperature',
            'LPT_Outlet_Temp': 'Low Pressure Turbine Outlet Temperature',
            'HPC_Outlet_Pressure': 'High Pressure Compressor Outlet Pressure',
            'Fan_Speed': 'Physical Fan Speed',
            'Core_Speed': 'Physical Core Speed',
            'Combustion_Pressure': 'Combustion Chamber Pressure',
            'Fuel_Flow_Ratio': 'Fuel Flow to Pressure Ratio',
            'Corrected_Fan_Speed': 'Corrected Fan Speed (RPM)',
            'Corrected_Core_Speed': 'Corrected Core Speed (RPM)',
            'Bypass_Ratio': 'Bypass Ratio',
            'Bleed_Enthalpy': 'Bleed Air Enthalpy',
            'HPT_Coolant_Bleed': 'High Pressure Turbine Coolant Bleed',
            'LPT_Coolant_Bleed': 'Low Pressure Turbine Coolant Bleed (Vibration)'
        }
    }
    joblib.dump(feature_info, 'feature_info.joblib')
    
    return model, feature_importance

def test_on_individual_datasets(model):
    """
    Test the multi-dataset model on individual test sets
    """
    print("\n" + "="*80)
    print("TESTING ON INDIVIDUAL DATASETS")
    print("="*80)
    
    for dataset_name, paths in DATASET_PATHS.items():
        try:
            print(f"\n{dataset_name} Test Set:")
            print("-" * 50)
            
            # Load test data
            test_df = load_and_process_data(paths['test'])
            
            # Load ground truth RUL
            rul_true = pd.read_csv(paths['rul'], header=None)[0].values
            
            # Get last cycle of each engine
            last_cycles = test_df.groupby('unit_nr').last().reset_index()
            
            # Prepare features
            feature_cols = [col for col in last_cycles.columns 
                           if col not in ['unit_nr', 'time_cycles', 'RUL', 'dataset']]
            X_test = last_cycles[feature_cols]
            
            # Predict
            predictions = model.predict(X_test)
            
            # Calculate metrics
            rmse = np.sqrt(mean_squared_error(rul_true, predictions))
            mae = mean_absolute_error(rul_true, predictions)
            r2 = r2_score(rul_true, predictions)
            
            # NASA scoring function (asymmetric)
            errors = predictions - rul_true
            scores = []
            for error in errors:
                if error < 0:  # Early prediction
                    scores.append(np.exp(-error/13) - 1)
                else:  # Late prediction (more penalty)
                    scores.append(np.exp(error/10) - 1)
            nasa_score = np.sum(scores)
            
            print(f"  Engines: {len(rul_true)}")
            print(f"  RMSE: {rmse:.2f} cycles")
            print(f"  MAE:  {mae:.2f} cycles")
            print(f"  R²:   {r2:.4f}")
            print(f"  NASA Score: {nasa_score:.2f} (lower is better)")
            
        except FileNotFoundError:
            print(f"  ✗ Test files not found")
            continue

if __name__ == "__main__":
    # Train the model
    model, feature_importance = train_multi_dataset_model()
    
    # Test on individual datasets
    test_on_individual_datasets(model)
    
    print("\n" + "="*80)
    print("TRAINING COMPLETE!")
    print("="*80)
    print("\nGenerated files:")
    print("  1. multi_dataset_rul_predictor.joblib - Main model")
    print("  2. feature_info.joblib - Feature metadata")
    print("\nTo use in your application:")
    print("  model = joblib.load('multi_dataset_rul_predictor.joblib')")
import pandas as pd
import numpy as np
import os

def load_data(filepath):
    # 1. Standard Loading
    index_names = ['unit_nr', 'time_cycles']
    setting_names = ['setting_1', 'setting_2', 'setting_3']
    sensor_names = ['s_{}'.format(i) for i in range(1, 22)] 
    col_names = index_names + setting_names + sensor_names
    
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Could not find dataset at: {filepath}")
    
    # FIX: Added 'r' prefix to the separator string to fix SyntaxWarning
    df = pd.read_csv(filepath, sep=r'\s+', header=None, names=col_names)
    
    # 2. RUL Calculation
    max_cycles = df.groupby('unit_nr')['time_cycles'].max().reset_index()
    max_cycles.columns = ['unit_nr', 'max']
    df = df.merge(max_cycles, on='unit_nr', how='left')
    df['RUL'] = df['max'] - df['time_cycles']
    
    # 3. Rename Columns (Using readable names)
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
        's_21': 'LPT_Coolant_Bleed'
    }
    df = df.rename(columns=sensor_map)
    
    # 4. Drop Useless Columns
    drop_cols = ['max', 'setting_1', 'setting_2', 'setting_3', 
                 's_1', 's_5', 's_6', 's_10', 's_16', 's_18', 's_19']
    df = df.drop(columns=drop_cols)

    # 5. HYBRID FEATURE ENGINEERING
    # Create Rolling Averages (Window = 10 cycles)
    sensors = list(sensor_map.values())
    
    # Group by unit_nr to ensure rolling doesn't cross between different engines
    df_rolling = df.groupby('unit_nr')[sensors].rolling(window=10, min_periods=1).mean().reset_index()
    
    # Cleanup indexes and rename
    df_rolling = df_rolling.drop(columns=['level_1', 'unit_nr']) 
    df_rolling.columns = [f"{col}_mean" for col in sensors]
    
    # Join back to original data
    df = pd.concat([df, df_rolling], axis=1)
    
    return df
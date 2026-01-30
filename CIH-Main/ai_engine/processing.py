import pandas as pd
import numpy as np
import os

def load_data(filepath):
    # 1. Define Column Names (Standard for NASA CMAPSS)
    index_names = ['unit_nr', 'time_cycles']
    setting_names = ['setting_1', 'setting_2', 'setting_3']
    sensor_names = ['s_{}'.format(i) for i in range(1, 22)] 
    col_names = index_names + setting_names + sensor_names
    
    # 2. Read the Space-Separated Text File
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Could not find dataset at: {filepath}")
        
    df = pd.read_csv(filepath, sep='\s+', header=None, names=col_names)
    
    # 3. Calculate RUL (Remaining Useful Life)
    # Logic: Since this is run-to-failure data, the RUL is (Max Cycle - Current Cycle)
    max_cycles = df.groupby('unit_nr')['time_cycles'].max().reset_index()
    max_cycles.columns = ['unit_nr', 'max']
    
    df = df.merge(max_cycles, on='unit_nr', how='left')
    df['RUL'] = df['max'] - df['time_cycles']
    
    # 4. Drop Useless Columns
    # In FD001, these sensors are constant (0 variance), so they confuse the model.
    # We also drop 'max' helper column.
    drop_cols = ['max', 'setting_1', 'setting_2', 'setting_3', 
                 's_1', 's_5', 's_6', 's_10', 's_16', 's_18', 's_19']
    
    df = df.drop(columns=drop_cols)
    
    return df
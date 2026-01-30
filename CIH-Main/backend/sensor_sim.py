import pandas as pd
import time
import os

# CONSTANTS
DATA_PATH = '../../dataset/train_FD001.txt' 
# Unit 34 is a great example: it starts healthy and degrades clearly until cycle 195.
DEMO_UNIT_NR = 34 

class EngineSimulator:
    def __init__(self):
        self.data = self._load_and_process_data()
        self.current_cycle = 0
        self.max_cycles = len(self.data)
        print(f"Simulator Ready: Engine {DEMO_UNIT_NR} loaded ({self.max_cycles} cycles).")

    def _load_and_process_data(self):
        # 1. Define Names (Same as processing.py)
        index_names = ['unit_nr', 'time_cycles']
        setting_names = ['setting_1', 'setting_2', 'setting_3']
        sensor_names = ['s_{}'.format(i) for i in range(1, 22)] 
        col_names = index_names + setting_names + sensor_names

        # 2. Load
        if not os.path.exists(DATA_PATH):
            raise FileNotFoundError(f"Missing Data: {DATA_PATH}")
            
        df = pd.read_csv(DATA_PATH, sep='\s+', header=None, names=col_names)
        
        # 3. Filter for ONE specific engine (The Demo Unit)
        df = df[df['unit_nr'] == DEMO_UNIT_NR]
        
        # 4. Rename Columns (Match the Frontend/AI expectations)
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
            's_21': 'LPT_Coolant_Bleed' # The "Vibration" Sensor
        }
        df = df.rename(columns=sensor_map)
        
        # 5. Keep only relevant columns + time_cycles
        keep_cols = ['time_cycles'] + list(sensor_map.values())
        return df[keep_cols].reset_index(drop=True)

    def get_next_cycle(self):
        """Yields one row of data at a time"""
        if self.current_cycle >= self.max_cycles:
            # Loop the demo if it finishes
            self.current_cycle = 0
            
        row = self.data.iloc[self.current_cycle].to_dict()
        self.current_cycle += 1
        return row

# Test logic (Run this file directly to check)
if __name__ == "__main__":
    sim = EngineSimulator()
    print(sim.get_next_cycle())
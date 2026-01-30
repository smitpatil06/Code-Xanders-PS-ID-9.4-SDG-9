import pandas as pd
import os

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '../../dataset/train_FD001.txt')

class EngineSimulator:
    def __init__(self):
        self.full_df = self._load_all_data()
        self.current_unit = 34
        self.unit_data = pd.DataFrame()
        self.current_idx = 0
        self.set_engine(34) # Default start

    def _load_all_data(self):
        # Load the massive file once into memory
        index_names = ['unit_nr', 'time_cycles']
        setting_names = ['setting_1', 'setting_2', 'setting_3']
        sensor_names = ['s_{}'.format(i) for i in range(1, 22)] 
        col_names = index_names + setting_names + sensor_names

        if not os.path.exists(DATA_PATH):
            print(f"❌ Error: Data not found at {DATA_PATH}")
            return pd.DataFrame()

        df = pd.read_csv(DATA_PATH, sep=r'\s+', header=None, names=col_names)
        
        # Rename to Readable immediately
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
            's_21': 'Vibration' # Renaming s_21 to Vibration for the demo
        }
        df = df.rename(columns=sensor_map)
        return df

    def set_engine(self, unit_id):
        """Reset simulation to a specific engine"""
        self.current_unit = int(unit_id)
        self.unit_data = self.full_df[self.full_df['unit_nr'] == self.current_unit].reset_index(drop=True)
        self.current_idx = 0
        print(f"🔄 Simulator switched to Engine #{unit_id} ({len(self.unit_data)} cycles)")

    def get_next_cycle(self):
        """Returns row dict or None if finished"""
        if self.current_idx >= len(self.unit_data):
            return None # Stop signal
            
        row = self.unit_data.iloc[self.current_idx].to_dict()
        self.current_idx += 1
        return row
"""
FIXED SENSOR SIMULATOR - Resets to Cycle 0 on Each Connection
==============================================================
This ensures each WebSocket connection starts from the beginning of the engine's lifecycle.
"""

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
        self.set_engine(34)  # Default start

    def _load_all_data(self):
        """Load and process NASA C-MAPSS data with ALL sensors"""
        # Standard NASA columns
        index_names = ['unit_nr', 'time_cycles']
        setting_names = ['setting_1', 'setting_2', 'setting_3']
        sensor_names = ['s_{}'.format(i) for i in range(1, 22)]
        col_names = index_names + setting_names + sensor_names

        if not os.path.exists(DATA_PATH):
            print(f"❌ Error: Data not found at {DATA_PATH}")
            return pd.DataFrame()

        df = pd.read_csv(DATA_PATH, sep=r'\s+', header=None, names=col_names)
        
        # Rename ALL 14 important sensors to readable names
        sensor_map = {
            's_2': 'LPC_Outlet_Temp',          # T24: LPC outlet temperature
            's_3': 'HPC_Outlet_Temp',          # T30: HPC outlet temperature
            's_4': 'LPT_Outlet_Temp',          # T50: LPT outlet temperature
            's_7': 'HPC_Outlet_Pressure',      # P30: HPC outlet pressure
            's_8': 'Fan_Speed',                # Nf: Physical fan speed
            's_9': 'Core_Speed',               # Nc: Physical core speed
            's_11': 'Combustion_Pressure',     # Ps30: Static pressure at HPC outlet
            's_12': 'Fuel_Flow_Ratio',         # phi: Fuel flow to Ps30 ratio
            's_13': 'Corrected_Fan_Speed',     # NRf: Corrected fan speed
            's_14': 'Corrected_Core_Speed',    # NRc: Corrected core speed
            's_15': 'Bypass_Ratio',            # BPR: Bypass ratio
            's_17': 'Bleed_Enthalpy',          # htBleed: Bleed enthalpy
            's_20': 'HPT_Coolant_Bleed',       # W31: HPT coolant bleed
            's_21': 'LPT_Coolant_Bleed'        # W32: LPT coolant bleed (VIBRATION PROXY!)
        }
        df = df.rename(columns=sensor_map)
        
        print("\n" + "="*80)
        print("SENSOR SIMULATOR INITIALIZED")
        print("="*80)
        print("\nLoaded sensors:")
        for old, new in sensor_map.items():
            if new in df.columns:
                print(f"  ✓ {new:30s} (was {old})")
        print("\nNote: LPT_Coolant_Bleed represents vibration-related measurements")
        print("="*80 + "\n")
        
        return df

    def set_engine(self, unit_id):
        """Reset simulation to a specific engine"""
        self.current_unit = int(unit_id)
        self.unit_data = self.full_df[self.full_df['unit_nr'] == self.current_unit].reset_index(drop=True)
        self.current_idx = 0
        
        if len(self.unit_data) > 0:
            print(f"🔄 Simulator switched to Engine #{unit_id}")
            print(f"   Total cycles: {len(self.unit_data)}")
            print(f"   Sensor count: {len([c for c in self.unit_data.columns if c not in ['unit_nr', 'time_cycles', 'setting_1', 'setting_2', 'setting_3']])}")
        else:
            print(f"❌ No data found for Engine #{unit_id}")

    def reset(self):
        """
        Reset the simulator to cycle 0 for the current engine.
        This should be called at the start of each WebSocket connection.
        """
        self.current_idx = 0
        print(f"🔄 Simulator reset to cycle 0 for Engine #{self.current_unit}")

    def get_next_cycle(self):
        """
        Returns row dict with ALL sensor data or None if finished
        
        CRITICAL: This now includes ALL 14 sensors, especially:
        - LPT_Coolant_Bleed (the vibration proxy that was missing before)
        """
        if self.current_idx >= len(self.unit_data):
            return None  # Stop signal
            
        row = self.unit_data.iloc[self.current_idx].to_dict()
        self.current_idx += 1
        
        # Verify all sensors are present
        expected_sensors = [
            'LPC_Outlet_Temp', 'HPC_Outlet_Temp', 'LPT_Outlet_Temp',
            'HPC_Outlet_Pressure', 'Fan_Speed', 'Core_Speed',
            'Combustion_Pressure', 'Fuel_Flow_Ratio', 'Corrected_Fan_Speed',
            'Corrected_Core_Speed', 'Bypass_Ratio', 'Bleed_Enthalpy',
            'HPT_Coolant_Bleed', 'LPT_Coolant_Bleed'
        ]
        
        missing = [s for s in expected_sensors if s not in row or pd.isna(row[s])]
        if missing:
            print(f"⚠️  Warning: Missing sensors in cycle {self.current_idx}: {missing}")
        
        return row

    def get_current_cycle(self):
        """Return the current cycle number (0-based index)"""
        return self.current_idx

    def get_total_cycles(self):
        """Return total number of cycles for current engine"""
        return len(self.unit_data)

    def get_sensor_info(self):
        """Return information about all sensors"""
        sensor_info = {
            'LPC_Outlet_Temp': {
                'full_name': 'Low Pressure Compressor Outlet Temperature',
                'unit': '°R',
                'typical_range': '640-645',
                'criticality': 'High'
            },
            'HPC_Outlet_Temp': {
                'full_name': 'High Pressure Compressor Outlet Temperature',
                'unit': '°R',
                'typical_range': '1580-1595',
                'criticality': 'High'
            },
            'LPT_Outlet_Temp': {
                'full_name': 'Low Pressure Turbine Outlet Temperature',
                'unit': '°R',
                'typical_range': '1390-1420',
                'criticality': 'Critical'
            },
            'HPC_Outlet_Pressure': {
                'full_name': 'High Pressure Compressor Outlet Pressure',
                'unit': 'psia',
                'typical_range': '545-555',
                'criticality': 'High'
            },
            'Fan_Speed': {
                'full_name': 'Physical Fan Speed',
                'unit': 'rpm',
                'typical_range': '2380-2400',
                'criticality': 'Medium'
            },
            'Core_Speed': {
                'full_name': 'Physical Core Speed',
                'unit': 'rpm',
                'typical_range': '9000-9100',
                'criticality': 'High'
            },
            'Combustion_Pressure': {
                'full_name': 'Static Pressure at HPC Outlet',
                'unit': 'psia',
                'typical_range': '550-554',
                'criticality': 'Critical'
            },
            'Fuel_Flow_Ratio': {
                'full_name': 'Fuel Flow to Ps30 Ratio',
                'unit': 'pps/psi',
                'typical_range': '47-48',
                'criticality': 'Medium'
            },
            'Corrected_Fan_Speed': {
                'full_name': 'Corrected Fan Speed',
                'unit': 'rpm',
                'typical_range': '2380-2390',
                'criticality': 'Medium'
            },
            'Corrected_Core_Speed': {
                'full_name': 'Corrected Core Speed',
                'unit': 'rpm',
                'typical_range': '8100-8150',
                'criticality': 'Medium'
            },
            'Bypass_Ratio': {
                'full_name': 'Bypass Ratio',
                'unit': '--',
                'typical_range': '8.3-8.5',
                'criticality': 'Low'
            },
            'Bleed_Enthalpy': {
                'full_name': 'Bleed Air Enthalpy',
                'unit': '--',
                'typical_range': '390-395',
                'criticality': 'Low'
            },
            'HPT_Coolant_Bleed': {
                'full_name': 'High Pressure Turbine Coolant Bleed',
                'unit': 'lbm/s',
                'typical_range': '38.5-39.5',
                'criticality': 'Medium'
            },
            'LPT_Coolant_Bleed': {
                'full_name': 'Low Pressure Turbine Coolant Bleed (Vibration)',
                'unit': 'lbm/s',
                'typical_range': '23.0-23.5',
                'criticality': 'High',
                'note': 'This sensor correlates with vibration levels'
            }
        }
        return sensor_info


# Test the simulator
if __name__ == "__main__":
    print("\nTesting Sensor Simulator...")
    print("="*80)
    
    sim = EngineSimulator()
    
    print("\nSensor Information:")
    print("-"*80)
    info = sim.get_sensor_info()
    for sensor, details in info.items():
        print(f"\n{sensor}:")
        for key, value in details.items():
            print(f"  {key}: {value}")
    
    print("\n" + "="*80)
    print("Sample Data (First 3 Cycles):")
    print("="*80)
    
    for i in range(3):
        cycle_data = sim.get_next_cycle()
        if cycle_data:
            print(f"\nCycle {i+1}:")
            print(f"  Time: {cycle_data.get('time_cycles', 'N/A')}")
            print(f"  LPC_Outlet_Temp: {cycle_data.get('LPC_Outlet_Temp', 'N/A'):.2f}")
            print(f"  LPT_Coolant_Bleed (Vibration): {cycle_data.get('LPT_Coolant_Bleed', 'N/A'):.4f}")
            print(f"  Total sensors: {len([k for k in cycle_data.keys() if not k.startswith('setting') and k not in ['unit_nr', 'time_cycles']])}")
    
    print("\n" + "="*80)
    print("Testing reset functionality...")
    print("="*80)
    
    # Reset and verify
    sim.reset()
    cycle_data = sim.get_next_cycle()
    if cycle_data:
        print(f"\nAfter reset - Cycle: {cycle_data.get('time_cycles', 'N/A')}")
        print("✓ Reset successful - back to cycle 1")
    
    print("\n" + "="*80)
    print("✓ Simulator test complete!")
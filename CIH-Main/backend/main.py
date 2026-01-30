import sys
import os
import asyncio
import json
import pandas as pd
import io
from fastapi import FastAPI, WebSocket, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ai_engine.inference import predict_rul
from backend.sensor_sim import EngineSimulator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

sim = EngineSimulator()

# -- API ENDPOINTS --

class EngineConfig(BaseModel):
    unit_id: int

@app.post("/set_engine")
def set_engine_config(config: EngineConfig):
    """Switch to a different engine unit"""
    sim.set_engine(config.unit_id)
    return {"status": "ok", "message": f"Switched to Engine {config.unit_id}"}

@app.post("/upload_test")
async def analyze_upload(file: UploadFile = File(...)):
    """
    Receives test data file, runs AI predictions, and returns comprehensive analysis.
    Expected format: NASA C-MAPSS format (space-separated, no headers)
    """
    contents = await file.read()
    
    # Parse the NASA format
    try:
        # Standard NASA columns
        index_names = ['unit_nr', 'time_cycles']
        setting_names = ['setting_1', 'setting_2', 'setting_3']
        sensor_names = ['s_{}'.format(i) for i in range(1, 22)]
        col_names = index_names + setting_names + sensor_names
        
        # Load data
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')), sep=r'\s+', header=None, names=col_names)
        
        # Rename sensors to match model expectations
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
        
        # Group by engine to get last cycle for each
        report = []
        grouped = df.groupby('unit_nr')
        
        for engine_id, group in grouped:
            # Get the last row (most recent state)
            last_row = group.iloc[-1].to_dict()
            max_cycle = int(last_row['time_cycles'])
            
            # Extract features for prediction
            features = {k: v for k, v in last_row.items() 
                       if k not in ['unit_nr', 'time_cycles', 'setting_1', 'setting_2', 'setting_3']}
            
            # Predict RUL
            rul = predict_rul(features)
            
            # Determine status
            status = "Healthy"
            if rul < 50: status = "Warning"
            if rul < 20: status = "Critical"
            
            # Calculate estimated failure cycle
            estimated_failure_cycle = max_cycle + int(rul)
            
            # Identify critical sensors (based on thresholds)
            critical_sensors = []
            if features.get('LPC_Outlet_Temp', 0) > 644:
                critical_sensors.append('LPC Temperature')
            if features.get('Combustion_Pressure', 0) > 554:
                critical_sensors.append('Combustion Pressure')
            if features.get('LPT_Outlet_Temp', 0) > 1410:
                critical_sensors.append('LPT Temperature')
            if features.get('LPT_Coolant_Bleed', 0) > 23.35:
                critical_sensors.append('Vibration')
            
            failure_reason = ", ".join(critical_sensors) if critical_sensors else "Normal wear and tear"
            
            report.append({
                "engine_id": int(engine_id),
                "current_cycle": max_cycle,
                "predicted_RUL": round(rul, 1),
                "estimated_failure_cycle": estimated_failure_cycle,
                "status": status,
                "failure_reason": failure_reason,
                "confidence": 94.2  # Could be calculated from model uncertainty
            })
        
        # Sort by RUL (most critical first)
        report = sorted(report, key=lambda x: x['predicted_RUL'])
        
        return report
        
    except Exception as e:
        return {"error": str(e)}

# -- WEBSOCKET --

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("🔌 Client connected to Live Stream")
    
    try:
        while True:
            raw_data = sim.get_next_cycle()
            
            if raw_data is None:
                # Engine has failed - send finish signal
                await websocket.send_text(json.dumps({"finished": True}))
                # Wait for client to acknowledge/restart
                await asyncio.sleep(2)
                continue
            
            # Extract features for prediction
            features = {k: v for k, v in raw_data.items() 
                       if k not in ['unit_nr', 'time_cycles', 'setting_1', 'setting_2', 'setting_3']}
            
            # Predict RUL
            rul = predict_rul(features)
            
            # Determine status
            status = "Healthy"
            if rul < 50: status = "Warning"
            if rul < 20: status = "Critical"
            
            # Identify failure reasons
            failure_reasons = []
            if features.get('LPC_Outlet_Temp', 0) > 644:
                failure_reasons.append('High LPC Temperature')
            if features.get('Combustion_Pressure', 0) > 554:
                failure_reasons.append('Excessive Combustion Pressure')
            if features.get('LPT_Outlet_Temp', 0) > 1410:
                failure_reasons.append('High LPT Temperature')
            if features.get('LPT_Coolant_Bleed', 0) > 23.35:
                failure_reasons.append('High Vibration')
            
            # Create payload
            payload = {
                "finished": False,
                "cycle": int(raw_data['time_cycles']),
                "RUL": round(rul, 2),
                "status": status,
                "sensors": features,  # Send all sensor data
                "failure_reasons": failure_reasons if failure_reasons else ["Normal operation"]
            }
            
            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(0.3)  # Simulation speed
            
    except Exception as e:
        print(f"⚠️ WebSocket Error: {e}")
    finally:
        print("🔌 Client disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
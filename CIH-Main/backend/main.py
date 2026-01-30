import sys
import os
import asyncio
import json
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

# --- IMPORT HACK ---
# Allow importing from the sibling 'ai_engine' folder
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ai_engine.inference import predict_rul
from backend.sensor_sim import EngineSimulator

app = FastAPI()

# Enable CORS (Allows your React app to talk to this Python server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Simulator
simulator = EngineSimulator()

@app.get("/")
def read_root():
    return {"status": "AegisFlow Backend Running"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected to WebSocket")
    
    try:
        while True:
            # 1. Get Simulated Data
            raw_data = simulator.get_next_cycle()
            
            # 2. Run AI Prediction
            # Note: predict_rul expects the exact column names we mapped in sensor_sim.py
            # We strip 'time_cycles' because the model doesn't use it for prediction
            features_only = {k: v for k, v in raw_data.items() if k != 'time_cycles'}
            rul_prediction = predict_rul(features_only)
            
            # 3. Determine Health Status
            status = "Healthy"
            if rul_prediction < 50:
                status = "Warning"
            if rul_prediction < 20:
                status = "Critical"

            # 4. Payload to send to Frontend
            payload = {
                "cycle": int(raw_data['time_cycles']),
                "RUL": round(rul_prediction, 1),
                "status": status,
                "sensors": raw_data  # Send full sensor data for graphs
            }
            
            # 5. Send JSON
            await websocket.send_text(json.dumps(payload))
            
            # 6. Wait (Simulate 1 second = 1 engine cycle)
            # Reduce this to 0.5 or 0.1 to make the demo go faster!
            await asyncio.sleep(0.5)
            
    except Exception as e:
        print(f"WebSocket Error: {e}")
    finally:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    # Run on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
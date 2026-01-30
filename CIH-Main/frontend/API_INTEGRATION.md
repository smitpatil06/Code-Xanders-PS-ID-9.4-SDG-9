# Backend API Integration Guide

## Setup Instructions

### 1. Backend Setup (Python FastAPI)

The backend is already configured in `/CIH-Main/backend/main.py`. To run it:

```bash
# Navigate to backend directory
cd CIH-Main/backend

# Activate Python environment
source ../../CIHenv/bin/activate

# Install dependencies (if not already installed)
pip install fastapi uvicorn websockets

# Run the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: `http://localhost:8000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd CIH-Main/frontend

# Create .env file
cp .env.example .env

# Update .env with backend URL
# VITE_API_URL=http://localhost:8000

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

## API Integration Architecture

### Service Layer (`src/services/api.ts`)
- Centralized API client with error handling
- Organized API endpoints by domain (sensors, machines, alerts, etc.)
- Type-safe requests and responses

### Type Definitions (`src/types/api.ts`)
- TypeScript interfaces for all API responses
- Ensures type safety across the application
- Makes IDE autocomplete work perfectly

### Custom Hooks (`src/hooks/useApi.ts`)
- `useApi` - Generic hook for fetching data
- `useMachines` - Fetch all machines
- `useMachine` - Fetch single machine by ID
- `useAlerts` - Fetch all alerts
- `useDashboardMetrics` - Fetch dashboard metrics
- `usePolling` - Poll data at regular intervals

## Usage Examples

### Example 1: Fetch Dashboard Metrics

```typescript
import { useDashboardMetrics } from '../hooks/useApi';

const Dashboard = () => {
  const { data, loading, error } = useDashboardMetrics();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Total Machines: {data.totalMachines}</h1>
      <h2>Active Alerts: {data.activeAlerts}</h2>
    </div>
  );
};
```

### Example 2: Fetch Machine Details

```typescript
import { useMachine } from '../hooks/useApi';
import { useParams } from 'react-router-dom';

const AssetDetail = () => {
  const { id } = useParams();
  const { data: machine, loading, error } = useMachine(id);

  if (loading) return <div>Loading machine data...</div>;
  if (error) return <div>Error loading machine</div>;

  return (
    <div>
      <h1>{machine.name}</h1>
      <p>Status: {machine.status}</p>
    </div>
  );
};
```

### Example 3: Real-time Sensor Data with Polling

```typescript
import { usePolling } from '../hooks/useApi';
import api from '../services/api';

const SensorMonitor = () => {
  // Poll every 5 seconds
  const { data, error } = usePolling(
    () => api.sensors.getRealTimeData(),
    5000
  );

  return (
    <div>
      <h2>Live Sensor Data</h2>
      {data && (
        <div>
          <p>Temperature: {data.temperature}°C</p>
          <p>Vibration: {data.vibration} mm/s</p>
        </div>
      )}
    </div>
  );
};
```

### Example 4: Post Data (Acknowledge Alert)

```typescript
import api from '../services/api';
import { useState } from 'react';

const AlertsList = () => {
  const [loading, setLoading] = useState(false);

  const handleAcknowledge = async (alertId: string) => {
    try {
      setLoading(true);
      await api.alerts.acknowledge(alertId);
      // Refresh alerts or show success message
      alert('Alert acknowledged successfully');
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={() => handleAcknowledge('alert-123')}
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Acknowledge'}
    </button>
  );
};
```

### Example 5: WebSocket Connection (Real-time Updates)

```typescript
import { useEffect, useState } from 'react';

const WebSocketMonitor = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      setData(receivedData);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h2>Real-time Data via WebSocket</h2>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
```

## Backend API Endpoints

Based on the existing backend (`main.py`), you can add these endpoints:

### Current Endpoints
- `GET /` - Health check
- `WebSocket /ws` - Real-time sensor data stream

### Recommended Additional Endpoints

```python
# In backend/main.py, add:

@app.get("/api/sensors/realtime")
async def get_realtime_sensors():
    raw_data = simulator.get_next_cycle()
    return raw_data

@app.get("/api/machines")
async def get_all_machines():
    # Return list of machines
    return [{"id": "1", "name": "Turbine-01", "status": "healthy"}]

@app.get("/api/machines/{machine_id}")
async def get_machine(machine_id: str):
    # Return specific machine details
    return {"id": machine_id, "name": f"Machine-{machine_id}"}

@app.get("/api/predictions/rul/{machine_id}")
async def get_rul_prediction(machine_id: str):
    raw_data = simulator.get_next_cycle()
    features_only = {k: v for k, v in raw_data.items() if k != 'time_cycles'}
    rul_prediction = predict_rul(features_only)
    return {"rul": rul_prediction, "machineId": machine_id}

@app.get("/api/alerts")
async def get_alerts():
    # Return list of alerts
    return [{"id": "1", "severity": "warning", "message": "High vibration"}]
```

## Error Handling

All API calls include automatic error handling. Errors are caught and logged:

```typescript
try {
  const data = await api.machines.getAll();
  // Success - use data
} catch (error) {
  // Error automatically logged
  // Show user-friendly error message
  console.error('Failed to fetch machines:', error);
}
```

## Environment Variables

Create `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_POLLING_INTERVAL=5000
VITE_USE_MOCK_DATA=false
```

## Testing the Connection

1. Start the backend server
2. Start the frontend development server
3. Open browser console
4. Check for API requests in Network tab
5. Look for WebSocket connection

## Next Steps

1. ✅ Backend is running at `http://localhost:8000`
2. ✅ Frontend can make API calls using the service layer
3. ✅ Custom hooks simplify data fetching
4. ✅ Type safety ensures correct data usage
5. 🔄 Add more API endpoints as needed
6. 🔄 Implement authentication if required
7. 🔄 Add error boundaries for better UX

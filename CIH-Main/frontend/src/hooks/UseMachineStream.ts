import { useState, useEffect, useRef } from 'react';

// Define the shape of data coming from Python
interface SensorData {
  finished?: boolean;
  cycle: number;
  RUL: number;
  status: 'Healthy' | 'Warning' | 'Critical';
  sensors: Record<string, number>;
  failure_reasons?: string[];
}

export const useMachineStream = () => {
  const [data, setData] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<SensorData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to FastAPI Backend
    ws.current = new WebSocket('ws://localhost:8000/ws');

    ws.current.onopen = () => {
      console.log('Connected to AegisFlow Core');
      setIsConnected(true);
    };

    ws.current.onclose = () => {
      console.log('Disconnected from AegisFlow Core');
      setIsConnected(false);
    };

    ws.current.onmessage = (event) => {
      const parsedData: SensorData = JSON.parse(event.data);
      
      // If backend says "finished", mark current data as finished
      if (parsedData.finished) {
        setData((prev) => prev ? { ...prev, finished: true } : null);
        return;
      }

      setData(parsedData);
      
      // Keep last 50 cycles for the graph
      setHistory((prev) => {
        const newHistory = [...prev, parsedData];
        if (newHistory.length > 50) return newHistory.slice(newHistory.length - 50);
        return newHistory;
      });
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  return { data, history, isConnected };
};
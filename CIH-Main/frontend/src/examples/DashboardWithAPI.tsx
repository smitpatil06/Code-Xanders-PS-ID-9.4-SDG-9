// Example: Dashboard Component using API integration
import React, { useEffect, useState } from 'react';
import { useDashboardMetrics, usePolling } from '../hooks/useApi';
import api from '../services/api';
import type { SensorData, Machine } from '../types/api';

const DashboardExample: React.FC = () => {
  // Using custom hooks for data fetching
  const { data: metrics, loading, error } = useDashboardMetrics();
  
  // Polling real-time sensor data every 5 seconds
  const { data: sensorData } = usePolling<SensorData>(
    () => api.sensors.getRealTimeData(),
    5000
  );

  // Manual API calls with state management
  const [machines, setMachines] = useState<Machine[]>([]);

  useEffect(() => {
    // Fetch machines on component mount
    const fetchMachines = async () => {
      try {
        const data = await api.machines.getAll();
        setMachines(data as Machine[]);
      } catch (error) {
        console.error('Failed to fetch machines:', error);
      }
    };

    fetchMachines();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-400 text-xl">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-gray-400 text-sm mb-2">Total Machines</h3>
            <p className="text-4xl font-bold">{metrics.totalMachines}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-gray-400 text-sm mb-2">Average Health</h3>
            <p className="text-4xl font-bold text-green-400">
              {metrics.averageHealth}%
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-gray-400 text-sm mb-2">Active Alerts</h3>
            <p className="text-4xl font-bold text-red-400">
              {metrics.activeAlerts}
            </p>
          </div>
        </div>
      )}

      {/* Real-time Sensor Data */}
      {sensorData && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
          <h2 className="text-2xl font-bold mb-4">Real-time Sensor Data</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Temperature</p>
              <p className="text-2xl font-bold">{sensorData.temperature}°C</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Vibration</p>
              <p className="text-2xl font-bold">{sensorData.vibration} mm/s</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pressure</p>
              <p className="text-2xl font-bold">{sensorData.pressure} PSI</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">RPM</p>
              <p className="text-2xl font-bold">{sensorData.rpm}</p>
            </div>
          </div>
        </div>
      )}

      {/* Machines List */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Machines</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-t border-gray-800">
              <th className="text-left py-3 px-6 text-gray-400 font-medium">
                Machine ID
              </th>
              <th className="text-left py-3 px-6 text-gray-400 font-medium">
                Type
              </th>
              <th className="text-left py-3 px-6 text-gray-400 font-medium">
                Location
              </th>
              <th className="text-left py-3 px-6 text-gray-400 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {machines.map((machine) => (
              <tr
                key={machine.id}
                className="border-t border-gray-800 hover:bg-gray-850"
              >
                <td className="py-3 px-6 font-medium">{machine.name}</td>
                <td className="py-3 px-6 text-gray-400">{machine.type}</td>
                <td className="py-3 px-6 text-gray-400">{machine.location}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      machine.status === 'healthy'
                        ? 'bg-green-500/20 text-green-400'
                        : machine.status === 'warning'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {machine.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardExample;

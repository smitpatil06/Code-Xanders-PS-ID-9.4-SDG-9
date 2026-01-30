import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// Generic hook for fetching data
export function useApi<T>(apiCall: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [apiCall]);

  return { data, loading, error };
}

// Specific hooks for common API calls
export function useMachines() {
  const apiCall = useCallback(() => api.machines.getAll(), []);
  return useApi(apiCall);
}

export function useMachine(machineId: string) {
  const apiCall = useCallback(() => api.machines.getById(machineId), [machineId]);
  return useApi(apiCall);
}

export function useAlerts() {
  const apiCall = useCallback(() => api.alerts.getAll(), []);
  return useApi(apiCall);
}

export function useDashboardMetrics() {
  const apiCall = useCallback(() => api.analytics.getDashboardMetrics(), []);
  return useApi(apiCall);
}

export function useSensorData(timeRange: string = '6H') {
  const apiCall = useCallback(() => api.sensors.getHistoricalData(timeRange), [timeRange]);
  return useApi(apiCall);
}

export function useMaintenanceStats() {
  const apiCall = useCallback(() => api.analytics.getMaintenanceStats(), []);
  return useApi(apiCall);
}

// Hook for polling data at intervals
export function usePolling<T>(
  apiCall: () => Promise<T>,
  interval: number = 5000
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: number;

    const fetchData = async () => {
      try {
        const result = await apiCall();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
        }
      } finally {
        if (isMounted) {
          timeoutId = window.setTimeout(fetchData, interval);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [apiCall, interval]);

  return { data, error };
}

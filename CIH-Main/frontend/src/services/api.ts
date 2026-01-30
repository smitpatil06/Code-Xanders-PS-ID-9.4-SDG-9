import type {
  SensorData,
  Machine,
  MachineHealth,
  Prediction,
  Alert,
  DashboardMetrics,
  MaintenanceStats,
  DowntimeAnalysis,
  MaintenanceDriver,
  RULPrediction,
  InferenceRequest,
  InferenceResponse
} from '../types/api';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API Client with error handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'An error occurred',
        }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// API Service Functions
export const api = {
  // Sensor Data APIs
  sensors: {
    getRealTimeData: (): Promise<SensorData> => apiClient.get('/api/sensors/realtime'),
    getHistoricalData: (timeRange: string): Promise<SensorData[]> => 
      apiClient.get(`/api/sensors/historical?range=${timeRange}`),
    getSensorById: (sensorId: string): Promise<SensorData> => 
      apiClient.get(`/api/sensors/${sensorId}`),
  },

  // Machine/Asset APIs
  machines: {
    getAll: (): Promise<Machine[]> => apiClient.get('/api/machines'),
    getById: (machineId: string): Promise<Machine> => 
      apiClient.get(`/api/machines/${machineId}`),
    getHealth: (machineId: string): Promise<MachineHealth> => 
      apiClient.get(`/api/machines/${machineId}/health`),
    getPrediction: (machineId: string): Promise<Prediction> => 
      apiClient.get(`/api/machines/${machineId}/prediction`),
  },

  // Alerts APIs
  alerts: {
    getAll: (): Promise<Alert[]> => apiClient.get('/api/alerts'),
    getById: (alertId: string): Promise<Alert> => 
      apiClient.get(`/api/alerts/${alertId}`),
    acknowledge: (alertId: string): Promise<Alert> => 
      apiClient.post(`/api/alerts/${alertId}/acknowledge`),
    resolve: (alertId: string): Promise<Alert> => 
      apiClient.post(`/api/alerts/${alertId}/resolve`),
  },

  // Analytics APIs
  analytics: {
    getDashboardMetrics: (): Promise<DashboardMetrics> => 
      apiClient.get('/api/analytics/dashboard'),
    getMaintenanceStats: (): Promise<MaintenanceStats> => 
      apiClient.get('/api/analytics/maintenance'),
    getDowntimeAnalysis: (): Promise<DowntimeAnalysis> => 
      apiClient.get('/api/analytics/downtime'),
    getROI: (): Promise<MaintenanceStats> => 
      apiClient.get('/api/analytics/roi'),
  },

  // Maintenance APIs
  maintenance: {
    getSchedule: (): Promise<MaintenanceDriver[]> => apiClient.get('/api/maintenance/schedule'),
    createTask: (data: unknown): Promise<MaintenanceDriver> => 
      apiClient.post('/api/maintenance/tasks', data),
    updateTask: (taskId: string, data: unknown): Promise<MaintenanceDriver> => 
      apiClient.put(`/api/maintenance/tasks/${taskId}`, data),
    getDrivers: (): Promise<MaintenanceDriver[]> => 
      apiClient.get('/api/maintenance/drivers'),
  },

  // Predictions APIs
  predictions: {
    getRUL: (machineId: string): Promise<RULPrediction> => 
      apiClient.get(`/api/predictions/rul/${machineId}`),
    getFailureProbability: (machineId: string): Promise<Prediction> => 
      apiClient.get(`/api/predictions/failure-prob/${machineId}`),
    runInference: (data: InferenceRequest): Promise<InferenceResponse> => 
      apiClient.post('/api/predictions/inference', data),
  },
};

export default api;

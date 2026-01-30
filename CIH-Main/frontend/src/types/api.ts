// Type definitions for API responses

export interface SensorData {
  id: string;
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
  rpm: number;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'healthy' | 'warning' | 'critical';
  lastMaintenance: string;
  nextMaintenance: string;
}

export interface MachineHealth {
  machineId: string;
  healthScore: number;
  components: ComponentHealth[];
  recommendations: string[];
}

export interface ComponentHealth {
  name: string;
  currentValue: string;
  baseline: string;
  status: 'healthy' | 'warning' | 'critical';
  deviation: number;
}

export interface Prediction {
  machineId: string;
  failureProbability: number;
  estimatedDaysToFailure: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  predictedFailureDate: string;
}

export interface Alert {
  id: string;
  machineId: string;
  machineName: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
}

export interface DashboardMetrics {
  totalMachines: number;
  healthyMachines: number;
  warningMachines: number;
  criticalMachines: number;
  activeAlerts: number;
  averageHealth: number;
}

export interface MaintenanceStats {
  estimatedSavings: number;
  avoidedDowntime: number;
  maintenanceROI: number;
  completedTasks: number;
  pendingTasks: number;
}

export interface DowntimeAnalysis {
  totalDowntime: number;
  byCategory: {
    category: string;
    hours: number;
    percentage: number;
  }[];
  trend: {
    month: string;
    hours: number;
  }[];
}

export interface MaintenanceDriver {
  assetId: string;
  primaryIssue: string;
  frequency: number;
  status: 'monitoring' | 'optimized' | 'scheduled';
  lastOccurrence: string;
}

export interface RULPrediction {
  machineId: string;
  remainingUsefulLife: number;
  unit: 'hours' | 'days' | 'cycles';
  confidence: number;
  modelVersion: string;
}

export interface InferenceRequest {
  machineId: string;
  sensorData: SensorData[];
  modelType?: string;
}

export interface InferenceResponse {
  prediction: Prediction;
  processedAt: string;
  modelVersion: string;
}

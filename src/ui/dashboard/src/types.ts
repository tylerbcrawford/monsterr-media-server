export type HealthStatus = 'healthy' | 'warning' | 'critical' | 'unknown' | 'checking';

export interface ResourceMetric {
  usage: number;
  status: HealthStatus;
}

export interface Service {
  name: string;
  status: 'running' | 'stopped' | 'error';
  health: HealthStatus;
  lastCheck: string;
}

export interface Alert {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  source: string;
}

export interface NetworkStatus {
  status: HealthStatus;
  lastCheck?: string;
  latency?: number;
  errors?: string[];
}

export interface SystemState {
  cpu: ResourceMetric;
  memory: ResourceMetric;
  disk: ResourceMetric;
  services: Service[];
  alerts: Alert[];
  network: NetworkStatus;
}

export interface MetricDataPoint {
  timestamp: string;
  cpu: number;
  memory: number;
  disk: number;
}

export interface MetricsHook {
  metrics: MetricDataPoint[];
  addMetric: (state: SystemState) => void;
}

export interface WebSocketMessage {
  type: 'metrics' | 'alert' | 'status';
  data: SystemState;
}
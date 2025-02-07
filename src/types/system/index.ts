export interface SystemStatus {
  status: 'starting' | 'running' | 'stopping' | 'stopped' | 'error';
  uptime: number;
  version: string;
  lastUpdate: Date;
  services: ServiceStatus[];
  resources: SystemResources;
  ddns?: DDNSStatus;
}

export interface DDNSStatus {
  enabled: boolean;
  provider: 'dynu';
  currentIP: string;
  lastUpdate: Date;
  domain: string;
  updateInterval: number;
  status: 'active' | 'error' | 'disabled';
  lastError?: string;
}

export interface DDNSConfig {
  enabled: boolean;
  provider: 'dynu';
  domain: string;
  username: string;
  password: string;
  updateInterval: number; // in seconds
  ipType: 'dynamic' | 'static';
}

export interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  health: HealthStatus;
  uptime: number;
  version: string;
  port: number;
  containerInfo?: ContainerInfo;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'unknown';
  lastCheck: Date;
  message?: string;
  details?: Record<string, any>;
}

export interface SystemResources {
  cpu: {
    usage: number;
    cores: number;
    load: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    cached: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    paths: Record<string, DiskUsage>;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
  };
}

export interface DiskUsage {
  total: number;
  used: number;
  free: number;
  mountPoint: string;
}

export interface ContainerInfo {
  id: string;
  name: string;
  image: string;
  created: Date;
  state: ContainerState;
  ports: PortMapping[];
  volumes: VolumeInfo[];
  networks: string[];
}

export interface ContainerState {
  status: string;
  running: boolean;
  paused: boolean;
  restarting: boolean;
  exitCode: number;
  startedAt: string;
  finishedAt: string;
}

export interface PortMapping {
  internal: number;
  external: number;
  protocol: 'tcp' | 'udp';
}

export interface VolumeInfo {
  source: string;
  destination: string;
  mode: 'rw' | 'ro';
}

export interface SystemEvent {
  id: string;
  type: SystemEventType;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: Date;
  source: string;
  message: string;
  details?: Record<string, any>;
}

export enum SystemEventType {
  SERVICE_STATE_CHANGE = 'service_state_change',
  RESOURCE_THRESHOLD = 'resource_threshold',
  HEALTH_CHECK = 'health_check',
  SECURITY_EVENT = 'security_event',
  BACKUP_EVENT = 'backup_event',
  UPDATE_EVENT = 'update_event',
  USER_ACTION = 'user_action'
}

export interface SystemTask {
  id: string;
  type: 'backup' | 'update' | 'maintenance' | 'custom';
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  startTime?: Date;
  endTime?: Date;
  progress?: number;
  message?: string;
  error?: string;
}

export type SystemActionResult<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  error?: Error;
}
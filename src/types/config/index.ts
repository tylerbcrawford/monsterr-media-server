export interface SystemConfig {
  environment: 'development' | 'production' | 'test';
  port: number;
  host: string;
  baseUrl: string;
  mediaPath: string;
  logsPath: string;
  domain?: DomainConfig;
}

export interface DomainConfig {
  enabled: boolean;
  primaryDomain: string;
  subdomains: SubdomainConfig[];
  ssl: SSLConfig;
  ddns?: DDNSConfig;
}

export interface SubdomainConfig {
  name: string;
  service: string;
  enabled: boolean;
  customConfig?: {
    proxyPass?: string;
    extraHeaders?: Record<string, string>;
    websockets?: boolean;
  };
}

export interface SSLConfig {
  enabled: boolean;
  provider: 'letsencrypt' | 'custom';
  email?: string;
  cert?: string;
  key?: string;
  autoRenew?: boolean;
  forceSSL?: boolean;
}

export interface DDNSConfig {
  enabled: boolean;
  provider: 'dynu' | 'cloudflare' | 'duckdns';
  username?: string;
  password?: string;
  token?: string;
  updateInterval: number;
  ipType: 'dynamic' | 'static';
}

export interface ServiceConfig {
  name: string;
  enabled: boolean;
  port: number;
  version: string;
  dependencies: string[];
  volumes: VolumeMount[];
  environment: Record<string, string>;
  healthCheck?: HealthCheckConfig;
}

export interface VolumeMount {
  source: string;
  target: string;
  readonly?: boolean;
}

export interface HealthCheckConfig {
  endpoint: string;
  interval: number;
  timeout: number;
  retries: number;
  startPeriod: number;
}

export interface DatabaseConfig {
  type: 'sqlite' | 'postgres' | 'mysql';
  host?: string;
  port?: number;
  database: string;
  username?: string;
  password?: string;
  synchronize: boolean;
  logging: boolean;
}

export interface SecurityConfig {
  ssl: {
    enabled: boolean;
    cert: string;
    key: string;
  };
  cors: {
    enabled: boolean;
    origins: string[];
    methods: string[];
  };
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    max: number;
  };
}

export interface MonitoringConfig {
  metrics: {
    enabled: boolean;
    interval: number;
    retention: number;
  };
  alerts: {
    enabled: boolean;
    endpoints: string[];
    thresholds: Record<string, number>;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'text';
    destination: 'file' | 'console' | 'both';
  };
}

export type ConfigValidationResult = {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}
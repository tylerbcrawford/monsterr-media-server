import { HealthStatus } from '../system';

export interface BaseService {
  name: string;
  version: string;
  status: ServiceStatus;
  health: HealthStatus;
  config: ServiceConfig;
  initialize(): Promise<boolean>;
  start(): Promise<boolean>;
  stop(): Promise<boolean>;
  getStatus(): ServiceStatus;
  getHealth(): HealthStatus;
}

export type ServiceStatus = 'starting' | 'running' | 'stopping' | 'stopped' | 'error';

export interface ServiceConfig {
  enabled: boolean;
  port: number;
  host: string;
  basePath: string;
  apiKey?: string;
  ssl?: boolean;
  maxConnections?: number;
  timeout?: number;
  retryAttempts?: number;
}

export interface MediaService extends BaseService {
  scanLibrary(): Promise<void>;
  getLibraryStats(): Promise<LibraryStats>;
  refreshMetadata(): Promise<void>;
}

export interface LibraryStats {
  totalItems: number;
  categories: Record<string, number>;
  totalSize: number;
  lastScan: Date;
}

export interface PlexConfig extends ServiceConfig {
  claimToken?: string;
  libraries: {
    movies: string;
    tvShows: string;
    music: string;
  };
  transcoding: {
    enabled: boolean;
    hardwareAcceleration: boolean;
    maxSessions: number;
  };
}

export interface SonarrConfig extends ServiceConfig {
  mediaRoot: string;
  qualityProfile: string;
  languageProfile: string;
  downloadClient: string;
}

export interface RadarrConfig extends ServiceConfig {
  mediaRoot: string;
  qualityProfile: string;
  minimumAvailability: 'announced' | 'inCinemas' | 'released' | 'preDB';
  downloadClient: string;
}

export interface LidarrConfig extends ServiceConfig {
  mediaRoot: string;
  qualityProfile: string;
  metadataProfile: string;
  downloadClient: string;
}

export interface DownloadService extends BaseService {
  addDownload(url: string, options: DownloadOptions): Promise<string>;
  pauseDownload(id: string): Promise<boolean>;
  resumeDownload(id: string): Promise<boolean>;
  cancelDownload(id: string): Promise<boolean>;
  getDownloadStatus(id: string): Promise<DownloadStatus>;
}

export interface DownloadOptions {
  category?: string;
  priority?: 'low' | 'normal' | 'high';
  savePath?: string;
  filename?: string;
  tags?: string[];
}

export interface DownloadStatus {
  id: string;
  name: string;
  status: 'queued' | 'downloading' | 'paused' | 'completed' | 'error';
  progress: number;
  downloadSpeed: number;
  eta?: number;
  size: number;
  downloaded: number;
  category?: string;
  error?: string;
}

export interface QBittorrentConfig extends ServiceConfig {
  vpnEnabled: boolean;
  maxActiveDownloads: number;
  maxActiveUploads: number;
  defaultSavePath: string;
  categories: Record<string, string>;
}

export interface NzbgetConfig extends ServiceConfig {
  downloadPath: string;
  tempPath: string;
  scriptPath: string;
  maxConcurrentDownloads: number;
}

export interface MonitoringService extends BaseService {
  getMetrics(): Promise<ServiceMetrics>;
  setAlertThresholds(thresholds: AlertThresholds): Promise<void>;
  getAlerts(): Promise<ServiceAlert[]>;
}

export interface ServiceMetrics {
  timestamp: Date;
  cpu: number;
  memory: number;
  disk: number;
  network: {
    bytesIn: number;
    bytesOut: number;
  };
  customMetrics?: Record<string, number>;
}

export interface AlertThresholds {
  cpu: number;
  memory: number;
  disk: number;
  custom?: Record<string, number>;
}

export interface ServiceAlert {
  id: string;
  timestamp: Date;
  service: string;
  type: 'warning' | 'error' | 'critical';
  message: string;
  metric?: string;
  value?: number;
  threshold?: number;
}
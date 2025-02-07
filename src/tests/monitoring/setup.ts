import { SystemService } from '../../core/system/SystemService';
import { ConfigService } from '../../core/config/ConfigService';
import { createTestServices } from '../integration/setup';
import { ServiceStatus, SystemResources, HealthStatus } from '../../types/system/index';

// Initialize services
export const configService = new ConfigService();
export const systemService = new SystemService();

// Monitoring thresholds
export const thresholds = {
  cpu: {
    warning: 70,
    critical: 90
  },
  memory: {
    warning: 80,
    critical: 95
  },
  disk: {
    warning: 85,
    critical: 95
  }
};

// Mock resource data generator
export const generateMockResources = (options: {
  cpuUsage?: number;
  memoryUsage?: number;
  diskUsage?: number;
} = {}): SystemResources => ({
  cpu: {
    usage: options.cpuUsage ?? 50,
    cores: 4,
    load: [1.5, 1.2, 1.0]
  },
  memory: {
    total: 16 * 1024 * 1024 * 1024, // 16GB
    used: (options.memoryUsage ?? 50) * 0.16 * 1024 * 1024 * 1024,
    free: (100 - (options.memoryUsage ?? 50)) * 0.16 * 1024 * 1024 * 1024,
    cached: 2 * 1024 * 1024 * 1024
  },
  disk: {
    total: 1024 * 1024 * 1024 * 1024, // 1TB
    used: (options.diskUsage ?? 50) * 10.24 * 1024 * 1024 * 1024,
    free: (100 - (options.diskUsage ?? 50)) * 10.24 * 1024 * 1024 * 1024,
    paths: {
      '/': {
        total: 512 * 1024 * 1024 * 1024,
        used: (options.diskUsage ?? 50) * 5.12 * 1024 * 1024 * 1024,
        free: (100 - (options.diskUsage ?? 50)) * 5.12 * 1024 * 1024 * 1024,
        mountPoint: '/'
      },
      '/media': {
        total: 512 * 1024 * 1024 * 1024,
        used: (options.diskUsage ?? 50) * 5.12 * 1024 * 1024 * 1024,
        free: (100 - (options.diskUsage ?? 50)) * 5.12 * 1024 * 1024 * 1024,
        mountPoint: '/media'
      }
    }
  },
  network: {
    bytesIn: 1024 * 1024 * 100, // 100MB
    bytesOut: 1024 * 1024 * 50,  // 50MB
    packetsIn: 1000,
    packetsOut: 500
  }
});

// Mock service status generator
export const generateMockServiceStatus = (
  name: string,
  status: 'running' | 'stopped' | 'error' = 'running',
  health: HealthStatus['status'] = 'healthy'
): ServiceStatus => ({
  name,
  status,
  health: {
    status: health,
    lastCheck: new Date(),
    message: health === 'healthy' ? 'Service is healthy' : 'Service has issues'
  },
  uptime: 3600,
  version: '1.0.0',
  port: 8080
});

// Set up test environment
beforeAll(async () => {
  // Initialize services
  await createTestServices();
  systemService.startMonitoring();
});

// Clean up after tests
afterAll(async () => {
  // Clean up any monitoring resources
  jest.resetAllMocks();
});

// Reset mocks and cleanup intervals between tests
afterEach(() => {
  jest.clearAllMocks();
  systemService.stopMonitoring();
});
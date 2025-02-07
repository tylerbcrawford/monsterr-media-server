import { systemService } from './setup';
import {
  generateMockResources,
  generateMockServiceStatus,
  thresholds
} from './setup';

describe('System Monitoring Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Resource Monitoring', () => {
    it('should monitor CPU usage correctly', async () => {
      // Test normal CPU usage
      const normalResources = generateMockResources({ cpuUsage: 50 });
      const normalStatus = await systemService.checkResourceHealth(normalResources);
      expect(normalStatus.cpu.status).toBe('healthy');

      // Test warning CPU usage
      const warningResources = generateMockResources({ cpuUsage: thresholds.cpu.warning + 5 });
      const warningStatus = await systemService.checkResourceHealth(warningResources);
      expect(warningStatus.cpu.status).toBe('warning');

      // Test critical CPU usage
      const criticalResources = generateMockResources({ cpuUsage: thresholds.cpu.critical + 5 });
      const criticalStatus = await systemService.checkResourceHealth(criticalResources);
      expect(criticalStatus.cpu.status).toBe('critical');
    });

    it('should monitor memory usage correctly', async () => {
      // Test normal memory usage
      const normalResources = generateMockResources({ memoryUsage: 50 });
      const normalStatus = await systemService.checkResourceHealth(normalResources);
      expect(normalStatus.memory.status).toBe('healthy');

      // Test warning memory usage
      const warningResources = generateMockResources({ memoryUsage: thresholds.memory.warning + 5 });
      const warningStatus = await systemService.checkResourceHealth(warningResources);
      expect(warningStatus.memory.status).toBe('warning');

      // Test critical memory usage
      const criticalResources = generateMockResources({ memoryUsage: thresholds.memory.critical + 5 });
      const criticalStatus = await systemService.checkResourceHealth(criticalResources);
      expect(criticalStatus.memory.status).toBe('critical');
    });

    it('should monitor disk usage correctly', async () => {
      // Test normal disk usage
      const normalResources = generateMockResources({ diskUsage: 50 });
      const normalStatus = await systemService.checkResourceHealth(normalResources);
      expect(normalStatus.disk.status).toBe('healthy');

      // Test warning disk usage
      const warningResources = generateMockResources({ diskUsage: thresholds.disk.warning + 5 });
      const warningStatus = await systemService.checkResourceHealth(warningResources);
      expect(warningStatus.disk.status).toBe('warning');

      // Test critical disk usage
      const criticalResources = generateMockResources({ diskUsage: thresholds.disk.critical + 5 });
      const criticalStatus = await systemService.checkResourceHealth(criticalResources);
      expect(criticalStatus.disk.status).toBe('critical');
    });
  });

  describe('Service Health Monitoring', () => {
    it('should monitor service health correctly', async () => {
      // Test healthy service
      const healthyService = generateMockServiceStatus('test-service', 'running', 'healthy');
      const healthyStatus = await systemService.checkServiceHealth(healthyService);
      expect(healthyStatus.status).toBe('healthy');

      // Test unhealthy service
      const unhealthyService = generateMockServiceStatus('test-service', 'running', 'unhealthy');
      const unhealthyStatus = await systemService.checkServiceHealth(unhealthyService);
      expect(unhealthyStatus.status).toBe('unhealthy');

      // Test stopped service
      const stoppedService = generateMockServiceStatus('test-service', 'stopped', 'unknown');
      const stoppedStatus = await systemService.checkServiceHealth(stoppedService);
      expect(stoppedStatus.status).toBe('unknown');
    });

    it('should aggregate service health correctly', async () => {
      const services = [
        generateMockServiceStatus('service1', 'running', 'healthy'),
        generateMockServiceStatus('service2', 'running', 'healthy'),
        generateMockServiceStatus('service3', 'running', 'healthy')
      ];

      const aggregateHealth = await systemService.getAggregateHealth(services);
      expect(aggregateHealth.status).toBe('healthy');
      expect(aggregateHealth.details.totalServices).toBe(3);
      expect(aggregateHealth.details.healthyServices).toBe(3);
    });

    it('should detect degraded system health', async () => {
      const services = [
        generateMockServiceStatus('service1', 'running', 'healthy'),
        generateMockServiceStatus('service2', 'running', 'unhealthy'),
        generateMockServiceStatus('service3', 'error', 'unknown')
      ];

      const aggregateHealth = await systemService.getAggregateHealth(services);
      expect(aggregateHealth.status).toBe('degraded');
      expect(aggregateHealth.details.totalServices).toBe(3);
      expect(aggregateHealth.details.healthyServices).toBe(1);
    });
  });

  describe('Alert Generation', () => {
    it('should generate alerts for resource issues', async () => {
      const criticalResources = generateMockResources({
        cpuUsage: thresholds.cpu.critical + 5,
        memoryUsage: thresholds.memory.critical + 5
      });

      const alerts = await systemService.checkResourceAlerts(criticalResources);
      expect(alerts).toHaveLength(2);
      expect(alerts[0].severity).toBe('critical');
      expect(alerts[1].severity).toBe('critical');
    });

    it('should generate alerts for service issues', async () => {
      const services = [
        generateMockServiceStatus('service1', 'running', 'healthy'),
        generateMockServiceStatus('service2', 'error', 'unknown'),
        generateMockServiceStatus('service3', 'running', 'unhealthy')
      ];

      const alerts = await systemService.checkServiceAlerts(services);
      expect(alerts).toHaveLength(2);
      expect(alerts.some(alert => alert.severity === 'error')).toBe(true);
      expect(alerts.some(alert => alert.severity === 'warning')).toBe(true);
    });
  });

  describe('Metric Collection', () => {
    it('should collect system metrics correctly', async () => {
      const metrics = await systemService.collectSystemMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.timestamp).toBeInstanceOf(Date);
      expect(metrics.resources).toBeDefined();
      expect(metrics.services).toBeDefined();
    });

    it('should track metric history', async () => {
      // Clear existing metrics
      (systemService as any).metricHistory = [];
      
      // Collect multiple metrics with delays to ensure different timestamps
      await systemService.collectSystemMetrics();
      await new Promise(resolve => setTimeout(resolve, 10));
      await systemService.collectSystemMetrics();
      await new Promise(resolve => setTimeout(resolve, 20));
      await systemService.collectSystemMetrics();

      const history = await systemService.getMetricHistory();
      expect(history).toHaveLength(3);
      expect(history[0].timestamp.getTime()).toBeLessThan(history[1].timestamp.getTime());
      expect(history[1].timestamp.getTime()).toBeLessThan(history[2].timestamp.getTime());
    });
  });
});
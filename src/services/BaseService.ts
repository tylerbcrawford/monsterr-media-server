import { BaseService as IBaseService, ServiceStatus, ServiceConfig } from '../types/services';
import { HealthStatus } from '../types/system';

export abstract class BaseService implements IBaseService {
  private _status: ServiceStatus = 'stopped';
  private healthCheckInterval?: NodeJS.Timeout;
  protected healthStatus: HealthStatus = {
    status: 'unknown',
    lastCheck: new Date(),
    message: 'Service not initialized'
  };

  get status(): ServiceStatus {
    return this._status;
  }

  get health(): HealthStatus {
    return this.healthStatus;
  }

  constructor(
    public readonly name: string,
    public readonly version: string,
    public readonly config: ServiceConfig
  ) {}

  /**
   * Initialize the service
   */
  async initialize(): Promise<boolean> {
    try {
      // Validate configuration
      if (!this.validateConfig()) {
        throw new Error(`Invalid configuration for service: ${this.name}`);
      }

      // Perform service-specific initialization
      await this.initializeService();

      // Start health check monitoring
      this.startHealthCheck();

      return true;
    } catch (error) {
      this._status = 'error';
      this.healthStatus = {
        status: 'unhealthy',
        lastCheck: new Date(),
        message: error instanceof Error ? error.message : 'Initialization failed',
      };
      return false;
    }
  }

  /**
   * Start the service
   */
  async start(): Promise<boolean> {
    try {
      if (!this.config.enabled) {
        throw new Error('Service is disabled');
      }
this._status = 'starting';
await this.startService();
this._status = 'running';

return true;
} catch (error) {
this._status = 'error';
      this.healthStatus = {
        status: 'unhealthy',
        lastCheck: new Date(),
        message: error instanceof Error ? error.message : 'Start failed',
      };
      return false;
    }
  }

  /**
   * Stop the service
   */
  async stop(): Promise<boolean> {
    try {
      this._status = 'stopping';
      
      // Clear health check interval
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
        this.healthCheckInterval = undefined;
      }
      
      await this.stopService();
      this._status = 'stopped';

      return true;
    } catch (error) {
      this._status = 'error';
      this.healthStatus = {
        status: 'unhealthy',
        lastCheck: new Date(),
        message: error instanceof Error ? error.message : 'Stop failed',
      };
      return false;
    }
  }

  /**
   * Get service status
   */
  getStatus(): ServiceStatus {
    return this.status;
  }

  /**
   * Get service health
   */
  getHealth(): HealthStatus {
    return this.healthStatus;
  }

  /**
   * Validate service configuration
   */
  protected validateConfig(): boolean {
    return (
      this.config &&
      typeof this.config.enabled === 'boolean' &&
      typeof this.config.port === 'number' &&
      typeof this.config.host === 'string' &&
      typeof this.config.basePath === 'string'
    );
  }

  /**
   * Start health check monitoring
   */
  protected startHealthCheck(): void {
    // Clear any existing interval
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    // Perform health check every 30 seconds
    this.healthCheckInterval = setInterval(async () => {
      try {
        const health = await this.checkHealth();
        this.healthStatus = {
          status: health ? 'healthy' : 'unhealthy',
          lastCheck: new Date(),
          message: health ? 'Service is healthy' : 'Service health check failed'
        };
      } catch (error) {
        this.healthStatus = {
          status: 'unhealthy',
          lastCheck: new Date(),
          message: error instanceof Error ? error.message : 'Health check failed'
        };
      }
    }, 30000);
  }

  /**
   * Service-specific initialization logic
   * Must be implemented by derived classes
   */
  protected abstract initializeService(): Promise<void>;

  /**
   * Service-specific start logic
   * Must be implemented by derived classes
   */
  protected abstract startService(): Promise<void>;

  /**
   * Service-specific stop logic
   * Must be implemented by derived classes
   */
  protected abstract stopService(): Promise<void>;

  /**
   * Service-specific health check logic
   * Must be implemented by derived classes
   */
  protected abstract checkHealth(): Promise<boolean>;
}
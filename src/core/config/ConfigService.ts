import {
  SystemConfig,
  ServiceConfig,
  DatabaseConfig,
  SecurityConfig,
  MonitoringConfig,
  ConfigValidationResult,
  DomainConfig
} from '../../types/config';

export class ConfigService {
  private systemConfig: SystemConfig = {
    environment: 'development',
    port: 3000,
    host: 'localhost',
    baseUrl: 'http://localhost:3000',
    mediaPath: '/opt/media-server/media',
    logsPath: '/opt/media-server/logs',
    domain: {
      enabled: false,
      primaryDomain: '',
      subdomains: [],
      ssl: {
        enabled: false,
        provider: 'letsencrypt',
        autoRenew: true,
        forceSSL: true
      }
    }
  };
  private serviceConfigs: Map<string, ServiceConfig> = new Map();
  private databaseConfig: DatabaseConfig = {
    type: 'sqlite',
    database: 'media-server.db',
    synchronize: true,
    logging: false
  };
  private securityConfig: SecurityConfig = {
    ssl: {
      enabled: false,
      cert: '',
      key: ''
    },
    cors: {
      enabled: true,
      origins: ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    },
    rateLimit: {
      enabled: true,
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  };
  private monitoringConfig: MonitoringConfig = {
    metrics: {
      enabled: true,
      interval: 60,
      retention: 7 * 24 * 60 * 60
    },
    alerts: {
      enabled: true,
      endpoints: [],
      thresholds: {
        cpuUsage: 80,
        memoryUsage: 85,
        diskUsage: 90
      }
    },
    logging: {
      level: 'info',
      format: 'json',
      destination: 'both'
    }
  };

  constructor() {
  }

  /**
   * Initialize configuration service
   * @returns Promise<boolean> indicating success
   */
  async initialize(): Promise<boolean> {
    try {
      await this.loadSystemConfig();
      await this.loadServiceConfigs();
      await this.loadDatabaseConfig();
      await this.loadSecurityConfig();
      await this.loadMonitoringConfig();
      return true;
    } catch (error) {
      console.error('Failed to initialize configuration:', error);
      return false;
    }
  }

  /**
   * Load system configuration
   */
  private async loadSystemConfig(): Promise<void> {
    // TODO: Implement actual config loading from file/environment
    const defaultDomainConfig: DomainConfig = {
      enabled: false,
      primaryDomain: '',
      subdomains: [],
      ssl: {
        enabled: false,
        provider: 'letsencrypt',
        autoRenew: true,
        forceSSL: true
      }
    };

    this.systemConfig = {
      environment: process.env.NODE_ENV as 'development' | 'production' | 'test' || 'development',
      port: parseInt(process.env.PORT || '3000'),
      host: process.env.HOST || 'localhost',
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      mediaPath: process.env.MEDIA_PATH || '/opt/media-server/media',
      logsPath: process.env.LOGS_PATH || '/opt/media-server/logs',
      domain: defaultDomainConfig
    };
  }

  /**
   * Load service configurations
   */
  private async loadServiceConfigs(): Promise<void> {
    const defaultHealthCheck = {
      endpoint: '/health',
      interval: 30,
      timeout: 5,
      retries: 3,
      startPeriod: 60
    };

    // Example service config
    const plexConfig: ServiceConfig = {
      name: 'plex',
      enabled: true,
      port: 32400,
      version: 'latest',
      dependencies: [],
      volumes: [
        { source: '/opt/media-server/media', target: '/data' }
      ],
      environment: {
        PLEX_CLAIM: 'claim-token',
        ADVERTISE_IP: this.getServiceUrl('plex', 32400)
      },
      healthCheck: defaultHealthCheck
    };

    this.serviceConfigs.set('plex', plexConfig);
  }

  /**
   * Get the full URL for a service
   * @param serviceName Name of the service
   * @param port Port number
   * @returns Full URL for the service
   */
  private getServiceUrl(serviceName: string, port: number): string {
    const { domain } = this.systemConfig;
    if (domain?.enabled) {
      return `https://${serviceName}.${domain.primaryDomain}`;
    }
    return `http://${this.systemConfig.host}:${port}`;
  }

  /**
   * Load database configuration
   */
  private async loadDatabaseConfig(): Promise<void> {
    // TODO: Implement actual database config loading
    this.databaseConfig = {
      type: 'sqlite',
      database: 'media-server.db',
      synchronize: true,
      logging: false
    };
  }

  /**
   * Load security configuration
   */
  private async loadSecurityConfig(): Promise<void> {
    const { domain } = this.systemConfig;
    this.securityConfig = {
      ssl: {
        enabled: domain?.ssl.enabled || false,
        cert: domain?.ssl.cert || '',
        key: domain?.ssl.key || ''
      },
      cors: {
        enabled: true,
        origins: domain?.enabled 
          ? [`https://${domain.primaryDomain}`, ...domain.subdomains.map(sub => `https://${sub.name}.${domain.primaryDomain}`)]
          : ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      },
      rateLimit: {
        enabled: true,
        windowMs: 15 * 60 * 1000,
        max: 100
      }
    };
  }

  /**
   * Load monitoring configuration
   */
  private async loadMonitoringConfig(): Promise<void> {
    // TODO: Implement actual monitoring config loading
    this.monitoringConfig = {
      metrics: {
        enabled: true,
        interval: 60,
        retention: 7 * 24 * 60 * 60
      },
      alerts: {
        enabled: true,
        endpoints: [],
        thresholds: {
          cpuUsage: 80,
          memoryUsage: 85,
          diskUsage: 90
        }
      },
      logging: {
        level: 'info',
        format: 'json',
        destination: 'both'
      }
    };
  }

  /**
   * Get system configuration
   */
  getSystemConfig(): SystemConfig {
    return this.systemConfig;
  }

  /**
   * Get service configuration
   * @param serviceName Name of the service
   */
  getServiceConfig(serviceName: string): ServiceConfig | undefined {
    return this.serviceConfigs.get(serviceName);
  }

  /**
   * Get all service configurations
   */
  getAllServiceConfigs(): Map<string, ServiceConfig> {
    return this.serviceConfigs;
  }

  /**
   * Get database configuration
   */
  getDatabaseConfig(): DatabaseConfig {
    return this.databaseConfig;
  }

  /**
   * Get security configuration
   */
  getSecurityConfig(): SecurityConfig {
    return this.securityConfig;
  }

  /**
   * Get monitoring configuration
   */
  getMonitoringConfig(): MonitoringConfig {
    return this.monitoringConfig;
  }

  /**
   * Validate configuration
   * @returns Configuration validation result
   */
  validate(): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate system config
    if (!this.systemConfig.mediaPath) {
      errors.push('Media path is required');
    }
    if (!this.systemConfig.logsPath) {
      warnings.push('Logs path not specified');
    }

    // Validate domain config
    const { domain } = this.systemConfig;
    if (domain?.enabled) {
      if (!domain.primaryDomain) {
        errors.push('Primary domain is required when domain is enabled');
      }
      if (domain.ssl.enabled) {
        if (domain.ssl.provider === 'custom' && (!domain.ssl.cert || !domain.ssl.key)) {
          errors.push('SSL certificate and key are required for custom SSL');
        }
        if (domain.ssl.provider === 'letsencrypt' && !domain.ssl.email) {
          errors.push('Email is required for Let\'s Encrypt SSL');
        }
      }
      if (this.systemConfig.environment === 'production' && !domain.ssl.enabled) {
        errors.push('SSL must be enabled in production when using custom domain');
      }
    }

    // Validate service configs
    this.serviceConfigs.forEach((config, name) => {
      if (!config.port) {
        errors.push(`Port not specified for service: ${name}`);
      }
      if (!config.version) {
        warnings.push(`Version not specified for service: ${name}`);
      }
    });

    // Validate security config
    if (this.systemConfig.environment === 'production' && !this.securityConfig.ssl.enabled) {
      errors.push('SSL must be enabled in production');
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Update service configuration
   * @param serviceName Name of the service
   * @param config New service configuration
   */
  updateServiceConfig(serviceName: string, config: ServiceConfig): void {
    this.serviceConfigs.set(serviceName, config);
    // TODO: Implement config persistence
  }

  /**
   * Update system configuration
   * @param config New system configuration
   */
  updateSystemConfig(config: Partial<SystemConfig>): void {
    this.systemConfig = { ...this.systemConfig, ...config };
    // Reload security config if domain settings change
    if (config.domain) {
      this.loadSecurityConfig();
    }
    // TODO: Implement config persistence
  }
}
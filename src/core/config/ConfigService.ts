import {
  SystemConfig,
  ServiceConfig,
  DatabaseConfig,
  SecurityConfig,
  MonitoringConfig,
  ConfigValidationResult,
  DomainConfig
} from '../../types/config';
import * as fs from 'fs';
import * as path from 'path';
import { Validator } from 'jsonschema';

// Define validation error type
interface ValidationError {
  property: string;
  message: string;
  name: string;
  stack: string;
}

export class ConfigService {
  private readonly configDir: string;
  private readonly validator: Validator;
  private readonly serviceConfigs: Map<string, ServiceConfig>;

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
    this.configDir = path.join(process.cwd(), 'config');
    this.validator = new Validator();
    this.serviceConfigs = new Map();
    this.loadSchemas();
  }

  /**
   * Load JSON schemas for validation
   */
  private loadSchemas(): void {
    const nginxSchema = JSON.parse(fs.readFileSync(
      path.join(this.configDir, 'schemas', 'nginx-proxy-config.schema.json'),
      'utf-8'
    ));
    const catalogSchema = JSON.parse(fs.readFileSync(
      path.join(this.configDir, 'schemas', 'service-catalog.schema.yaml'),
      'utf-8'
    ));
    
    this.validator.addSchema(nginxSchema, '/nginx-proxy-config');
    this.validator.addSchema(catalogSchema, '/service-catalog');
  }

  /**
   * Initialize configuration service
   * @returns Promise<boolean> indicating success
   */
  async initialize(): Promise<boolean> {
    try {
      await this.loadBaseConfig();
      await this.loadServiceConfigs();
      await this.loadSecurityConfig();
      await this.loadMonitoringConfig();
      return true;
    } catch (error) {
      console.error('Failed to initialize configuration:', error);
      return false;
    }
  }

  /**
   * Load base configuration
   */
  private async loadBaseConfig(): Promise<void> {
    const baseEnvPath = path.join(this.configDir, 'defaults', 'base.env');
    const envContent = fs.readFileSync(baseEnvPath, 'utf-8');
    const config = this.parseEnvFile(envContent);

    this.systemConfig = {
      ...this.systemConfig,
      environment: process.env.NODE_ENV as 'development' | 'production' | 'test' || 'development',
      port: parseInt(config.PORT || '3000'),
      host: config.HOST || 'localhost',
      baseUrl: config.BASE_URL || 'http://localhost:3000',
      mediaPath: config.MEDIA_PATH || '/opt/media-server/media',
      logsPath: config.LOGS_PATH || '/opt/media-server/logs',
      domain: {
        enabled: false,
        primaryDomain: config.DOMAIN || '',
        subdomains: [],
        ssl: {
          enabled: config.FORCE_SSL === 'true',
          provider: 'letsencrypt',
          autoRenew: true,
          forceSSL: config.FORCE_SSL === 'true'
        }
      }
    };
  }

  /**
   * Load service configurations
   */
  private async loadServiceConfigs(): Promise<void> {
    const mediaServicesPath = path.join(this.configDir, 'defaults', 'media-services.env');
    if (fs.existsSync(mediaServicesPath)) {
      const envContent = fs.readFileSync(mediaServicesPath, 'utf-8');
      const config = this.parseEnvFile(envContent);

      // Configure Plex
      const plexConfig: ServiceConfig = {
        name: 'plex',
        enabled: true,
        port: 32400,
        version: 'latest',
        dependencies: [],
        volumes: [
          { source: config.PLEX_MEDIA_PATH || '/opt/media-server/media', target: '/data' }
        ],
        environment: {
          PLEX_CLAIM: config.PLEX_CLAIM_TOKEN || '',
          ADVERTISE_IP: this.getServiceUrl('plex', 32400)
        },
        healthCheck: {
          endpoint: '/health',
          interval: 30,
          timeout: 5,
          retries: 3,
          startPeriod: 60
        }
      };

      this.serviceConfigs.set('plex', plexConfig);
    }
  }

  /**
   * Load security configuration
   */
  private async loadSecurityConfig(): Promise<void> {
    const securityServicesPath = path.join(this.configDir, 'defaults', 'security-services.env');
    if (fs.existsSync(securityServicesPath)) {
      const envContent = fs.readFileSync(securityServicesPath, 'utf-8');
      const config = this.parseEnvFile(envContent);

      this.securityConfig = {
        ssl: {
          enabled: config.FORCE_SSL === 'true',
          cert: '',
          key: ''
        },
        cors: {
          enabled: true,
          origins: this.systemConfig.domain?.enabled 
            ? [`https://${this.systemConfig.domain.primaryDomain}`]
            : ['http://localhost:3000'],
          methods: ['GET', 'POST', 'PUT', 'DELETE']
        },
        rateLimit: {
          enabled: true,
          windowMs: parseInt(config.RATE_LIMIT_WINDOW || '900000'),
          max: parseInt(config.RATE_LIMIT_MAX || '100')
        }
      };
    }
  }

  /**
   * Load monitoring configuration
   */
  private async loadMonitoringConfig(): Promise<void> {
    const monitoringServicesPath = path.join(this.configDir, 'defaults', 'monitoring-services.env');
    if (fs.existsSync(monitoringServicesPath)) {
      const envContent = fs.readFileSync(monitoringServicesPath, 'utf-8');
      const config = this.parseEnvFile(envContent);

      this.monitoringConfig = {
        metrics: {
          enabled: true,
          interval: parseInt(config.METRIC_COLLECTION_INTERVAL || '60'),
          retention: parseInt(config.METRIC_RETENTION_DAYS || '7') * 24 * 60 * 60
        },
        alerts: {
          enabled: true,
          endpoints: [],
          thresholds: {
            cpuUsage: parseInt(config.CPU_USAGE_WARNING || '90'),
            memoryUsage: parseInt(config.MEMORY_USAGE_WARNING || '90'),
            diskUsage: parseInt(config.DISK_USAGE_WARNING || '90')
          }
        },
        logging: {
          level: 'info',
          format: 'json',
          destination: 'both'
        }
      };
    }
  }

  /**
   * Parse environment file content
   * @param content File content
   * @returns Object with parsed values
   */
  private parseEnvFile(content: string): { [key: string]: string } {
    const config: { [key: string]: string } = {};
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        if (key && value) {
          config[key.trim()] = value.trim().replace(/["']/g, '');
        }
      }
    }

    return config;
  }

  /**
   * Get the full URL for a service
   */
  private getServiceUrl(serviceName: string, port: number): string {
    const { domain } = this.systemConfig;
    if (domain?.enabled) {
      return `https://${serviceName}.${domain.primaryDomain}`;
    }
    return `http://${this.systemConfig.host}:${port}`;
  }

  /**
   * Save configuration to file
   * @param type Configuration type
   * @param config Configuration object
   */
  async saveConfig(type: string, config: Record<string, unknown>): Promise<void> {
    const configPath = path.join(this.configDir, 'defaults', `${type}.env`);
    let content = '# Generated configuration\n\n';

    for (const [key, value] of Object.entries(config)) {
      content += `${key}=${value}\n`;
    }

    await fs.promises.writeFile(configPath, content, 'utf-8');
  }

  // Getter methods
  getSystemConfig(): SystemConfig {
    return this.systemConfig;
  }

  getServiceConfig(serviceName: string): ServiceConfig | undefined {
    return this.serviceConfigs.get(serviceName);
  }

  getAllServiceConfigs(): Map<string, ServiceConfig> {
    return this.serviceConfigs;
  }

  getSecurityConfig(): SecurityConfig {
    return this.securityConfig;
  }

  getMonitoringConfig(): MonitoringConfig {
    return this.monitoringConfig;
  }

  /**
   * Validate configuration using JSON schemas
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
      }
      if (this.systemConfig.environment === 'production' && !domain.ssl.enabled) {
        errors.push('SSL must be enabled in production when using custom domain');
      }
    }

    // Validate service configs using schema
    const catalogPath = path.join(this.configDir, 'services', 'catalog.yml');
    if (fs.existsSync(catalogPath)) {
      const catalogContent = fs.readFileSync(catalogPath, 'utf-8');
      const catalogValidation = this.validator.validate(catalogContent, this.validator.getSchema('/service-catalog'));
      
      if (!catalogValidation.valid) {
        errors.push(...(catalogValidation.errors as ValidationError[]).map(err => `Service catalog: ${err.stack}`));
      }
    }

    // Validate NGINX proxy config
    const nginxConfigPath = path.join(this.configDir, 'templates', 'nginx-proxy-config.template.json');
    if (fs.existsSync(nginxConfigPath)) {
      const nginxContent = fs.readFileSync(nginxConfigPath, 'utf-8');
      const nginxValidation = this.validator.validate(nginxContent, this.validator.getSchema('/nginx-proxy-config'));
      
      if (!nginxValidation.valid) {
        errors.push(...(nginxValidation.errors as ValidationError[]).map(err => `NGINX config: ${err.stack}`));
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Update service configuration
   */
  async updateServiceConfig(serviceName: string, config: ServiceConfig): Promise<void> {
    this.serviceConfigs.set(serviceName, config);
    await this.saveConfig(`${serviceName}-service`, config as unknown as Record<string, unknown>);
  }

  /**
   * Update system configuration
   */
  async updateSystemConfig(config: Partial<SystemConfig>): Promise<void> {
    this.systemConfig = { ...this.systemConfig, ...config };
    if (config.domain) {
      await this.loadSecurityConfig();
    }
    await this.saveConfig('base', {
      PORT: this.systemConfig.port,
      HOST: this.systemConfig.host,
      BASE_URL: this.systemConfig.baseUrl,
      MEDIA_PATH: this.systemConfig.mediaPath,
      LOGS_PATH: this.systemConfig.logsPath,
      DOMAIN: this.systemConfig.domain?.primaryDomain || '',
      FORCE_SSL: this.systemConfig.domain?.ssl.enabled || false
    });
  }
}
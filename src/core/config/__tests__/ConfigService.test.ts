import { ConfigService } from '../ConfigService';
import { SystemConfig, DomainConfig } from '../../../types/config';

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
  });

  describe('Domain Configuration', () => {
    it('should initialize with default domain settings disabled', () => {
      const config = configService.getSystemConfig();
      expect(config.domain?.enabled).toBe(false);
    });

    it('should validate domain configuration when enabled', () => {
      const domainConfig: DomainConfig = {
        enabled: true,
        primaryDomain: 'example.com',
        subdomains: [
          {
            name: 'plex',
            service: 'plex',
            enabled: true,
            customConfig: {
              websockets: true
            }
          }
        ],
        ssl: {
          enabled: true,
          provider: 'letsencrypt',
          email: 'admin@example.com',
          autoRenew: true,
          forceSSL: true
        }
      };

      configService.updateSystemConfig({
        domain: domainConfig
      });

      const result = configService.validate();
      expect(result.isValid).toBe(true);
    });

    it('should require SSL in production with domain enabled', () => {
      const domainConfig: DomainConfig = {
        enabled: true,
        primaryDomain: 'example.com',
        subdomains: [],
        ssl: {
          enabled: false,
          provider: 'letsencrypt'
        }
      };

      configService.updateSystemConfig({
        environment: 'production',
        domain: domainConfig
      });

      const result = configService.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('SSL must be enabled in production when using custom domain');
    });

    it('should require email for Let\'s Encrypt SSL', () => {
      const domainConfig: DomainConfig = {
        enabled: true,
        primaryDomain: 'example.com',
        subdomains: [],
        ssl: {
          enabled: true,
          provider: 'letsencrypt',
          autoRenew: true,
          forceSSL: true
        }
      };

      configService.updateSystemConfig({
        domain: domainConfig
      });

      const result = configService.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email is required for Let\'s Encrypt SSL');
    });

    it('should generate correct service URLs based on domain configuration', () => {
      const domainConfig: DomainConfig = {
        enabled: true,
        primaryDomain: 'example.com',
        subdomains: [
          {
            name: 'plex',
            service: 'plex',
            enabled: true
          }
        ],
        ssl: {
          enabled: true,
          provider: 'letsencrypt',
          email: 'admin@example.com',
          autoRenew: true,
          forceSSL: true
        }
      };

      configService.updateSystemConfig({
        domain: domainConfig
      });

      const plexConfig = configService.getServiceConfig('plex');
      expect(plexConfig?.environment.ADVERTISE_IP).toBe('https://plex.example.com');
    });

    it('should update CORS origins when domain configuration changes', () => {
      const domainConfig: DomainConfig = {
        enabled: true,
        primaryDomain: 'example.com',
        subdomains: [
          {
            name: 'plex',
            service: 'plex',
            enabled: true
          }
        ],
        ssl: {
          enabled: true,
          provider: 'letsencrypt',
          email: 'admin@example.com',
          autoRenew: true,
          forceSSL: true
        }
      };

      configService.updateSystemConfig({
        domain: domainConfig
      });

      const securityConfig = configService.getSecurityConfig();
      expect(securityConfig.cors.origins).toContain('https://example.com');
      expect(securityConfig.cors.origins).toContain('https://plex.example.com');
    });
  });
});
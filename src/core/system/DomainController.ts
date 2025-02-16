import { Request, Response } from 'express';
import { DomainService } from './DomainService';
import { DomainServiceConfig, SubdomainConfig } from '../../types/system/domain';

export class DomainController {
  private domainService: DomainService;

  constructor(config: DomainServiceConfig) {
    this.domainService = new DomainService(config);
  }

  /**
   * Validate domain configuration
   */
  async validateDomain(req: Request, res: Response): Promise<void> {
    try {
      const { domain } = req.body;

      if (!domain) {
        res.status(400).json({
          valid: false,
          error: 'Domain is required'
        });
        return;
      }

      const result = await this.domainService.validateDomain(domain);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        valid: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Configure a new subdomain
   */
  async configureSubdomain(req: Request, res: Response): Promise<void> {
    try {
      const subdomainConfig: SubdomainConfig = req.body;

      if (!this.validateSubdomainConfig(subdomainConfig)) {
        res.status(400).json({
          success: false,
          error: 'Invalid subdomain configuration'
        });
        return;
      }

      const success = await this.domainService.configureSubdomain(subdomainConfig);
      res.json({ success });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Update domain configuration
   */
  async updateConfig(req: Request, res: Response): Promise<void> {
    try {
      const config: Partial<DomainServiceConfig> = req.body;

      if (!this.validateDomainConfig(config)) {
        res.status(400).json({
          success: false,
          error: 'Invalid domain configuration'
        });
        return;
      }

      this.domainService.updateConfig(config);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get current domain configuration
   */
  getConfig(req: Request, res: Response): void {
    try {
      const config = this.domainService.getConfig();
      res.json(config);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Validate subdomain configuration
   */
  private validateSubdomainConfig(config: SubdomainConfig): boolean {
    return !!(
      config &&
      typeof config.name === 'string' &&
      config.name.length > 0 &&
      typeof config.service === 'string' &&
      config.service.length > 0 &&
      typeof config.port === 'number' &&
      config.port > 0 &&
      config.port < 65536 &&
      typeof config.ssl === 'boolean' &&
      typeof config.auth === 'boolean'
    );
  }

  /**
   * Validate domain configuration
   */
  private validateDomainConfig(config: Partial<DomainServiceConfig>): boolean {
    if (!config) return false;

    if (config.primaryDomain && typeof config.primaryDomain !== 'string') {
      return false;
    }

    if (config.subdomains && !Array.isArray(config.subdomains)) {
      return false;
    }

    if (config.ssl) {
      const { ssl } = config;
      if (
        typeof ssl.provider !== 'string' ||
        !['letsencrypt', 'custom'].includes(ssl.provider) ||
        typeof ssl.autoRenew !== 'boolean' ||
        typeof ssl.forceSSL !== 'boolean'
      ) {
        return false;
      }

      if (ssl.provider === 'letsencrypt' && ssl.email && typeof ssl.email !== 'string') {
        return false;
      }

      if (ssl.provider === 'custom' && (
        (ssl.cert && typeof ssl.cert !== 'string') ||
        (ssl.key && typeof ssl.key !== 'string')
      )) {
        return false;
      }
    }

    if (config.ddns) {
      const { ddns } = config;
      if (
        typeof ddns.provider !== 'string' ||
        typeof ddns.username !== 'string' ||
        typeof ddns.password !== 'string' ||
        typeof ddns.updateInterval !== 'number' ||
        !['dynamic', 'static'].includes(ddns.ipType)
      ) {
        return false;
      }
    }

    return true;
  }
}
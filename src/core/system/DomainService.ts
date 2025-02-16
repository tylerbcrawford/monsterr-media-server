import { exec } from 'child_process';
import { promisify } from 'util';
import dns from 'dns';
import https from 'https';
import { TLSSocket } from 'tls';
import {
  DomainServiceConfig,
  DomainValidationResult,
  DnsValidationResult,
  DnsRecord,
  SubdomainConfig,
  SslCertificate
} from '../../types/system/domain';

const execAsync = promisify(exec);
const dnsResolve = promisify(dns.resolve);

export class DomainService {
  private config: DomainServiceConfig;
  private lastDnsCheck: Map<string, { timestamp: number; result: DnsValidationResult }> = new Map();
  private readonly DNS_CHECK_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

  constructor(config: DomainServiceConfig) {
    this.config = config;
  }

  /**
   * Validate domain configuration including DNS and SSL
   */
  async validateDomain(domain: string): Promise<DomainValidationResult> {
    try {
      // Check DNS configuration
      const dnsResult = await this.validateDns(domain);
      if (!dnsResult.valid) {
        return {
          valid: false,
          dns: dnsResult,
          error: 'DNS validation failed'
        };
      }

      // Check SSL if enabled
      if (this.config.ssl.provider) {
        const sslResult = await this.validateSsl(domain);
        if (!sslResult.valid) {
          return {
            valid: false,
            dns: dnsResult,
            ssl: sslResult,
            error: 'SSL validation failed'
          };
        }
      }

      return {
        valid: true,
        dns: dnsResult,
        ssl: this.config.ssl.provider ? await this.validateSsl(domain) : undefined
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Validate DNS configuration for domain
   */
  private async validateDns(domain: string): Promise<DnsValidationResult> {
    try {
      // Check cache first
      const cached = this.lastDnsCheck.get(domain);
      if (cached && Date.now() - cached.timestamp < this.DNS_CHECK_CACHE_TIME) {
        return cached.result;
      }

      // Get required DNS records
      const records = await this.getRequiredDnsRecords(domain);
      
      // Verify each record
      const validationPromises = records.map(async (record) => {
        try {
          switch (record.type) {
            case 'A':
              const aRecords = await dnsResolve(record.name, 'A');
              return aRecords.includes(record.value);
            case 'CNAME':
              const cnameRecords = await dnsResolve(record.name, 'CNAME');
              return cnameRecords.includes(record.value);
            case 'TXT':
              const txtRecords = await dnsResolve(record.name, 'TXT');
              return txtRecords.flat().includes(record.value);
            default:
              return false;
          }
        } catch {
          return false;
        }
      });

      const results = await Promise.all(validationPromises);
      const valid = results.every(Boolean);

      const result: DnsValidationResult = {
        valid,
        records,
        propagated: valid,
        error: valid ? undefined : 'DNS records do not match required configuration'
      };

      // Cache the result
      this.lastDnsCheck.set(domain, {
        timestamp: Date.now(),
        result
      });

      return result;
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'DNS validation failed'
      };
    }
  }

  /**
   * Get required DNS records for domain
   */
  private async getRequiredDnsRecords(domain: string): Promise<DnsRecord[]> {
    const records: DnsRecord[] = [];
    const serverIp = await this.getServerIp();

    // Add main domain A record
    records.push({
      type: 'A',
      name: domain,
      value: serverIp
    });

    // Add subdomain CNAME records
    this.config.subdomains.forEach((subdomain) => {
      records.push({
        type: 'CNAME',
        name: `${subdomain.name}.${domain}`,
        value: domain
      });
    });

    // Add Let's Encrypt validation record if using SSL
    if (this.config.ssl.provider === 'letsencrypt') {
      records.push({
        type: 'TXT',
        name: `_acme-challenge.${domain}`,
        value: 'PENDING_VALIDATION'
      });
    }

    return records;
  }

  /**
   * Validate SSL configuration for domain
   */
  private async validateSsl(domain: string): Promise<{ valid: boolean; certificate?: SslCertificate; error?: string }> {
    try {
      return new Promise((resolve) => {
        const req = https.get(`https://${domain}`, {
          rejectUnauthorized: true,
          timeout: 5000
        }, (res) => {
          const socket = res.socket as TLSSocket;
          const cert = socket.getPeerCertificate();
          
          if (cert && !cert.raw) {
            resolve({
              valid: true,
              certificate: {
                domain: cert.subject.CN,
                issuer: cert.issuer.CN,
                validFrom: new Date(cert.valid_from),
                validTo: new Date(cert.valid_to),
                fingerprint: cert.fingerprint
              }
            });
          } else {
            resolve({
              valid: false,
              error: 'No valid SSL certificate found'
            });
          }
        });

        req.on('error', (error) => {
          resolve({
            valid: false,
            error: error instanceof Error ? error.message : 'SSL validation failed'
          });
        });

        req.end();
      });
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'SSL validation failed'
      };
    }
  }

  /**
   * Get server's public IP address
   */
  private async getServerIp(): Promise<string> {
    try {
      const { stdout } = await execAsync('curl -s https://api.ipify.org');
      return stdout.trim();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get server IP');
    }
  }

  /**
   * Configure subdomain for a service
   */
  async configureSubdomain(subdomain: SubdomainConfig): Promise<boolean> {
    try {
      // Add to config
      this.config.subdomains.push(subdomain);

      // Validate new configuration
      const validationResult = await this.validateDomain(this.config.primaryDomain);
      if (!validationResult.valid) {
        // Rollback on validation failure
        this.config.subdomains = this.config.subdomains.filter(s => s.name !== subdomain.name);
        throw new Error(validationResult.error || 'Validation failed');
      }

      return true;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to configure subdomain');
    }
  }

  /**
   * Update domain configuration
   */
  updateConfig(config: Partial<DomainServiceConfig>): void {
    this.config = { ...this.config, ...config };
    // Clear DNS check cache when config changes
    this.lastDnsCheck.clear();
  }

  /**
   * Get current domain configuration
   */
  getConfig(): DomainServiceConfig {
    return this.config;
  }
}
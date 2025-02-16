import dns from 'dns';
import https, { RequestOptions } from 'https';
import { ClientRequest, IncomingMessage } from 'http';
import { TLSSocket } from 'tls';
import { DomainService } from '../DomainService';
import { DomainServiceConfig, SubdomainConfig } from '../../../types/system/domain';

jest.mock('dns');
jest.mock('https');

describe('DomainService', () => {
  let domainService: DomainService;
  const mockConfig: DomainServiceConfig = {
    primaryDomain: 'test.domain.com',
    subdomains: [
      {
        name: 'plex',
        service: 'plex',
        port: 32400,
        ssl: true,
        auth: false
      }
    ],
    ssl: {
      provider: 'letsencrypt',
      email: 'test@domain.com',
      autoRenew: true,
      forceSSL: true
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    domainService = new DomainService(mockConfig);
  });

  describe('validateDomain', () => {
    it('should validate domain configuration successfully', async () => {
      // Mock DNS resolution
      const mockResolve = jest.spyOn(dns, 'resolve').mockImplementation(
        (_domain: string, _type: string, callback: Function) => {
          callback(null, ['192.168.1.1']);
        }
      );

      const result = await domainService.validateDomain('test.domain.com');
      expect(result.valid).toBe(true);
      expect(result.dns?.valid).toBe(true);
      expect(mockResolve).toHaveBeenCalled();
    });

    it('should fail validation for invalid DNS records', async () => {
      jest.spyOn(dns, 'resolve').mockImplementation(
        (_domain: string, _type: string, callback: Function) => {
          callback(new Error('DNS lookup failed'));
        }
      );

      const result = await domainService.validateDomain('invalid.domain.com');
      expect(result.valid).toBe(false);
      expect(result.dns?.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('validateDns', () => {
    it('should validate DNS records correctly', async () => {
      jest.spyOn(dns, 'resolve').mockImplementation(
        (_domain: string, _type: string, callback: Function) => {
          callback(null, ['192.168.1.1']);
        }
      );

      const result = await domainService['validateDns']('test.domain.com');
      expect(result.valid).toBe(true);
      expect(result.records).toBeDefined();
      expect(result.propagated).toBe(true);
    });

    it('should cache DNS check results', async () => {
      const mockResolve = jest.spyOn(dns, 'resolve').mockImplementation(
        (_domain: string, _type: string, callback: Function) => {
          callback(null, ['192.168.1.1']);
        }
      );

      // First check
      await domainService['validateDns']('test.domain.com');
      // Second check (should use cache)
      await domainService['validateDns']('test.domain.com');

      expect(mockResolve).toHaveBeenCalledTimes(1);
    });
  });

  describe('validateSsl', () => {
    it('should validate SSL certificate', async () => {
      const mockCert = {
        subject: { CN: 'test.domain.com' },
        issuer: { CN: 'Let\'s Encrypt' },
        valid_from: new Date().toISOString(),
        valid_to: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        fingerprint: 'mock-fingerprint'
      };

      const mockTLSSocket = {
        getPeerCertificate: () => mockCert
      } as unknown as TLSSocket;

      const mockResponse = {
        socket: mockTLSSocket,
        statusCode: 200,
        on: jest.fn()
      } as unknown as IncomingMessage;

      const mockGet = jest.spyOn(https, 'get').mockImplementation(
        (url: string | URL, options: RequestOptions, callback?: (res: IncomingMessage) => void): ClientRequest => {
          if (callback) {
            callback(mockResponse);
          }
          return {
            on: (_event: string, _handler: (err: Error) => void): ClientRequest => {
              return {} as ClientRequest;
            },
            end: (): void => {}
          } as ClientRequest;
        }
      );

      const result = await domainService['validateSsl']('test.domain.com');
      expect(result.valid).toBe(true);
      expect(result.certificate).toBeDefined();
      expect(result.certificate?.domain).toBe('test.domain.com');
      expect(mockGet).toHaveBeenCalled();
    });

    it('should handle SSL validation errors', async () => {
      const mockError = new Error('SSL validation failed');
      
      jest.spyOn(https, 'get').mockImplementation(
        (url: string | URL, options: RequestOptions, callback?: (res: IncomingMessage) => void): ClientRequest => {
          return {
            on: (event: string, handler: (err: Error) => void): ClientRequest => {
              if (event === 'error') {
                handler(mockError);
              }
              return {} as ClientRequest;
            },
            end: (): void => {}
          } as ClientRequest;
        }
      );

      const result = await domainService['validateSsl']('test.domain.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('configureSubdomain', () => {
    it('should configure subdomain successfully', async () => {
      jest.spyOn(domainService, 'validateDomain').mockResolvedValue({
        valid: true,
        dns: { valid: true, propagated: true }
      });

      const subdomain: SubdomainConfig = {
        name: 'sonarr',
        service: 'sonarr',
        port: 8989,
        ssl: true,
        auth: true
      };

      const result = await domainService.configureSubdomain(subdomain);
      expect(result).toBe(true);
      expect(domainService.getConfig().subdomains).toContainEqual(subdomain);
    });

    it('should rollback on validation failure', async () => {
      jest.spyOn(domainService, 'validateDomain').mockResolvedValue({
        valid: false,
        error: 'Validation failed'
      });

      const subdomain: SubdomainConfig = {
        name: 'invalid',
        service: 'invalid',
        port: 1234,
        ssl: true,
        auth: true
      };

      await expect(domainService.configureSubdomain(subdomain)).rejects.toThrow();
      expect(domainService.getConfig().subdomains).not.toContainEqual(subdomain);
    });
  });
});
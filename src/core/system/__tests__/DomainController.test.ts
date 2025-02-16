import { Request, Response } from 'express';
import { DomainController } from '../DomainController';
import { DomainService } from '../DomainService';
import { DomainServiceConfig, SubdomainConfig } from '../../../types/system/domain';

jest.mock('../DomainService');

describe('DomainController', () => {
  let domainController: DomainController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  const mockConfig: DomainServiceConfig = {
    primaryDomain: 'test.domain.com',
    subdomains: [],
    ssl: {
      provider: 'letsencrypt',
      email: 'test@domain.com',
      autoRenew: true,
      forceSSL: true
    }
  };

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockRequest = {};
    mockResponse = {
      json: mockJson,
      status: mockStatus
    };

    domainController = new DomainController(mockConfig);
  });

  describe('validateDomain', () => {
    it('should validate domain successfully', async () => {
      const mockValidationResult = {
        valid: true,
        dns: { valid: true, propagated: true }
      };

      (DomainService.prototype.validateDomain as jest.Mock).mockResolvedValue(mockValidationResult);

      mockRequest.body = { domain: 'test.domain.com' };

      await domainController.validateDomain(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockJson).toHaveBeenCalledWith(mockValidationResult);
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it('should return error for missing domain', async () => {
      mockRequest.body = {};

      await domainController.validateDomain(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        valid: false,
        error: 'Domain is required'
      });
    });

    it('should handle validation errors', async () => {
      const mockError = new Error('Validation failed');
      (DomainService.prototype.validateDomain as jest.Mock).mockRejectedValue(mockError);

      mockRequest.body = { domain: 'invalid.domain' };

      await domainController.validateDomain(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        valid: false,
        error: 'Validation failed'
      });
    });
  });

  describe('configureSubdomain', () => {
    const mockSubdomain: SubdomainConfig = {
      name: 'test',
      service: 'test-service',
      port: 8080,
      ssl: true,
      auth: true
    };

    it('should configure subdomain successfully', async () => {
      (DomainService.prototype.configureSubdomain as jest.Mock).mockResolvedValue(true);

      mockRequest.body = mockSubdomain;

      await domainController.configureSubdomain(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockJson).toHaveBeenCalledWith({ success: true });
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it('should return error for invalid subdomain config', async () => {
      mockRequest.body = { name: 'test' }; // Missing required fields

      await domainController.configureSubdomain(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid subdomain configuration'
      });
    });

    it('should handle configuration errors', async () => {
      const mockError = new Error('Configuration failed');
      (DomainService.prototype.configureSubdomain as jest.Mock).mockRejectedValue(mockError);

      mockRequest.body = mockSubdomain;

      await domainController.configureSubdomain(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Configuration failed'
      });
    });
  });

  describe('updateConfig', () => {
    it('should update configuration successfully', async () => {
      const updateConfig: Partial<DomainServiceConfig> = {
        ssl: {
          provider: 'letsencrypt',
          email: 'new@domain.com',
          autoRenew: true,
          forceSSL: true
        }
      };

      mockRequest.body = updateConfig;

      await domainController.updateConfig(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockJson).toHaveBeenCalledWith({ success: true });
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it('should return error for invalid config', async () => {
      mockRequest.body = {
        ssl: { provider: 'invalid' }
      };

      await domainController.updateConfig(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid domain configuration'
      });
    });
  });

  describe('getConfig', () => {
    it('should return current configuration', () => {
      const mockCurrentConfig = { ...mockConfig };
      (DomainService.prototype.getConfig as jest.Mock).mockReturnValue(mockCurrentConfig);

      domainController.getConfig(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockJson).toHaveBeenCalledWith(mockCurrentConfig);
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it('should handle errors', () => {
      const mockError = new Error('Failed to get config');
      (DomainService.prototype.getConfig as jest.Mock).mockImplementation(() => {
        throw mockError;
      });

      domainController.getConfig(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Failed to get config'
      });
    });
  });
});
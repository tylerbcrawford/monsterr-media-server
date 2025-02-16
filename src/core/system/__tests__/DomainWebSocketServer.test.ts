import WebSocket from 'ws';
import { Server } from 'http';
import { DomainWebSocketServer } from '../DomainWebSocketServer';
import { DomainService } from '../DomainService';
import { DomainServiceConfig } from '../../../types/system/domain';

jest.mock('ws');
jest.mock('../DomainService');

type WsCallback = [string, (...args: any[]) => void];

describe('DomainWebSocketServer', () => {
  let domainWebSocketServer: DomainWebSocketServer;
  let mockServer: Server;
  let mockWs: jest.Mocked<WebSocket>;
  let mockDomainService: jest.Mocked<DomainService>;
  let mockConfig: DomainServiceConfig;

  beforeEach(() => {
    mockConfig = {
      primaryDomain: 'test.domain.com',
      subdomains: [],
      ssl: {
        provider: 'letsencrypt',
        email: 'test@domain.com',
        autoRenew: true,
        forceSSL: true
      }
    };

    mockServer = new Server();
    mockDomainService = new DomainService(mockConfig) as jest.Mocked<DomainService>;
    mockWs = {
      send: jest.fn(),
      on: jest.fn(),
      readyState: WebSocket.OPEN,
    } as unknown as jest.Mocked<WebSocket>;

    (WebSocket.Server as jest.Mock).mockImplementation(() => ({
      on: (event: string, callback: (ws: WebSocket) => void) => {
        if (event === 'connection') {
          callback(mockWs);
        }
      },
      close: jest.fn(),
    }));

    domainWebSocketServer = new DomainWebSocketServer(mockServer, mockDomainService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('connection handling', () => {
    it('should set up message and close handlers on connection', () => {
      expect(mockWs.on).toHaveBeenCalledWith('message', expect.any(Function));
      expect(mockWs.on).toHaveBeenCalledWith('close', expect.any(Function));
    });
  });

  describe('domain validation', () => {
    it('should handle start validation message', async () => {
      const messageHandler = mockWs.on.mock.calls.find(
        (call: WsCallback) => call[0] === 'message'
      )?.[1] as (message: string) => void;

      const mockDnsResult = {
        valid: true,
        propagated: true
      };

      const mockSslResult = {
        valid: true,
        certificate: {
          domain: 'test.domain.com',
          issuer: 'Let\'s Encrypt',
          validFrom: new Date(),
          validTo: new Date(),
          fingerprint: 'test-fingerprint'
        }
      };

      jest.spyOn(mockDomainService as any, 'validateDns').mockResolvedValue(mockDnsResult);
      jest.spyOn(mockDomainService as any, 'validateSsl').mockResolvedValue(mockSslResult);

      messageHandler(JSON.stringify({
        type: 'start_validation',
        domain: 'test.domain.com'
      }));

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));

      // Should send initial DNS check message
      expect(mockWs.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"dns"')
      );

      // Should send DNS validation result
      expect(mockWs.send).toHaveBeenCalledWith(
        expect.stringContaining('"valid":true')
      );

      // Should proceed to SSL validation
      expect(mockWs.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"ssl"')
      );

      // Should send completion message
      expect(mockWs.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"complete"')
      );
    });

    it('should handle DNS validation failure', async () => {
      const messageHandler = mockWs.on.mock.calls.find(
        (call: WsCallback) => call[0] === 'message'
      )?.[1] as (message: string) => void;

      const mockDnsError = {
        valid: false,
        error: 'DNS validation failed'
      };

      jest.spyOn(mockDomainService as any, 'validateDns').mockResolvedValue(mockDnsError);

      messageHandler(JSON.stringify({
        type: 'start_validation',
        domain: 'invalid.domain.com'
      }));

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));

      // Should send DNS validation error
      expect(mockWs.send).toHaveBeenCalledWith(
        expect.stringContaining('"error":"DNS validation failed"')
      );
    });

    it('should handle SSL validation failure', async () => {
      const messageHandler = mockWs.on.mock.calls.find(
        (call: WsCallback) => call[0] === 'message'
      )?.[1] as (message: string) => void;

      const mockDnsResult = {
        valid: true,
        propagated: true
      };

      const mockSslError = {
        valid: false,
        error: 'SSL validation failed'
      };

      jest.spyOn(mockDomainService as any, 'validateDns').mockResolvedValue(mockDnsResult);
      jest.spyOn(mockDomainService as any, 'validateSsl').mockResolvedValue(mockSslError);

      messageHandler(JSON.stringify({
        type: 'start_validation',
        domain: 'test.domain.com'
      }));

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));

      // Should send SSL validation error
      expect(mockWs.send).toHaveBeenCalledWith(
        expect.stringContaining('"error":"SSL validation failed"')
      );
    });

    it('should handle stop validation message', async () => {
      const messageHandler = mockWs.on.mock.calls.find(
        (call: WsCallback) => call[0] === 'message'
      )?.[1] as (message: string) => void;

      messageHandler(JSON.stringify({
        type: 'stop_validation',
        domain: 'test.domain.com'
      }));

      // Should not send any more messages after stopping
      expect(mockWs.send).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should clean up intervals on close', () => {
      const closeHandler = mockWs.on.mock.calls.find(
        (call: WsCallback) => call[0] === 'close'
      )?.[1] as () => void;

      // Set up a mock interval
      jest.spyOn(global, 'clearInterval');
      
      closeHandler();

      expect(clearInterval).toHaveBeenCalled();
    });

    it('should close WebSocket server on close', () => {
      const mockClose = jest.fn();
      (WebSocket.Server as jest.Mock).mockImplementation(() => ({
        on: jest.fn(),
        close: mockClose,
      }));

      domainWebSocketServer.close();

      expect(mockClose).toHaveBeenCalled();
    });
  });
});
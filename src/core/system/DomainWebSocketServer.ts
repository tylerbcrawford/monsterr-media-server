import WebSocket from 'ws';
import { Server } from 'http';
import { DomainService } from './DomainService';
import { DomainValidationResult, DnsValidationResult } from '../../types/system/domain';

interface ValidationUpdate {
  step: number;
  type: 'dns' | 'ssl' | 'complete';
  result?: DomainValidationResult | DnsValidationResult;
  error?: string;
}

interface ValidationMessage {
  type: 'start_validation' | 'stop_validation';
  domain: string;
}

export class DomainWebSocketServer {
  private wss: WebSocket.Server;
  private domainService: DomainService;
  private validationIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(server: Server, domainService: DomainService) {
    this.wss = new WebSocket.Server({ server });
    this.domainService = domainService;
    this.setupWebSocketServer();
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message) as ValidationMessage;
          
          if (data.type === 'start_validation' && data.domain) {
            this.startDomainValidation(ws, data.domain);
          } else if (data.type === 'stop_validation' && data.domain) {
            this.stopDomainValidation(data.domain);
          }
        } catch (error) {
          ws.send(JSON.stringify({
            error: 'Invalid message format'
          }));
        }
      });

      ws.on('close', () => {
        // Clean up any ongoing validations
        this.validationIntervals.forEach((interval) => clearInterval(interval));
        this.validationIntervals.clear();
      });
    });
  }

  private async startDomainValidation(ws: WebSocket, domain: string): Promise<void> {
    // Stop any existing validation for this domain
    this.stopDomainValidation(domain);

    const sendUpdate = (update: ValidationUpdate) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(update));
      }
    };

    // Start DNS validation
    sendUpdate({ step: 0, type: 'dns' });
    
    try {
      // Initial DNS check
      const dnsResult = await this.domainService['validateDns'](domain);
      sendUpdate({ 
        step: 1, 
        type: 'dns',
        result: dnsResult
      });

      if (!dnsResult.valid) {
        // Start periodic DNS checks if not valid
        const interval = setInterval(async () => {
          const checkResult = await this.domainService['validateDns'](domain);
          sendUpdate({
            step: 1,
            type: 'dns',
            result: checkResult
          });

          if (checkResult.valid) {
            this.stopDomainValidation(domain);
            this.startSslValidation(ws, domain);
          }
        }, 30000); // Check every 30 seconds

        this.validationIntervals.set(domain, interval);
      } else {
        // DNS is valid, proceed to SSL validation
        this.startSslValidation(ws, domain);
      }
    } catch (error) {
      sendUpdate({
        step: 1,
        type: 'dns',
        error: error instanceof Error ? error.message : 'DNS validation failed'
      });
    }
  }

  private async startSslValidation(ws: WebSocket, domain: string): Promise<void> {
    const sendUpdate = (update: ValidationUpdate) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(update));
      }
    };

    sendUpdate({ step: 2, type: 'ssl' });

    try {
      const sslResult = await this.domainService['validateSsl'](domain);
      const validationResult: DomainValidationResult = {
        valid: sslResult.valid,
        ssl: sslResult,
        dns: { valid: true, propagated: true }
      };

      sendUpdate({
        step: 3,
        type: 'ssl',
        result: validationResult
      });

      if (sslResult.valid) {
        sendUpdate({
          step: 3,
          type: 'complete',
          result: validationResult
        });
      }
    } catch (error) {
      sendUpdate({
        step: 2,
        type: 'ssl',
        error: error instanceof Error ? error.message : 'SSL validation failed'
      });
    }
  }

  private stopDomainValidation(domain: string): void {
    const interval = this.validationIntervals.get(domain);
    if (interval) {
      clearInterval(interval);
      this.validationIntervals.delete(domain);
    }
  }

  public close(): void {
    this.validationIntervals.forEach((interval) => clearInterval(interval));
    this.validationIntervals.clear();
    this.wss.close();
  }
}
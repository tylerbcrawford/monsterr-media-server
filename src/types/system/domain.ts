export interface DnsRecord {
  type: 'A' | 'CNAME' | 'TXT';
  name: string;
  value: string;
  ttl?: number;
}

export interface DnsValidationResult {
  valid: boolean;
  records?: DnsRecord[];
  error?: string;
  propagated?: boolean;
}

export interface SslCertificate {
  domain: string;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  fingerprint: string;
}

export interface DomainValidationResult {
  valid: boolean;
  dns?: DnsValidationResult;
  ssl?: {
    valid: boolean;
    certificate?: SslCertificate;
    error?: string;
  };
  error?: string;
}

export interface SubdomainConfig {
  name: string;
  service: string;
  port: number;
  ssl: boolean;
  auth: boolean;
}

export interface DomainServiceConfig {
  primaryDomain: string;
  subdomains: SubdomainConfig[];
  ssl: {
    provider: 'letsencrypt' | 'custom';
    email?: string;
    cert?: string;
    key?: string;
    autoRenew: boolean;
    forceSSL: boolean;
  };
  ddns?: {
    provider: string;
    username: string;
    password: string;
    updateInterval: number;
    ipType: 'dynamic' | 'static';
  };
}
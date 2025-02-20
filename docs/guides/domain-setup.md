# Domain Setup Guide

This guide explains how to configure custom domains for your Monsterr Media Server installation.

## Prerequisites

Before setting up your domain, ensure you have:

1.  A registered domain name.
2.  Access to your domain's DNS settings.
3.  Ports 80 and 443 open on your network.
4.  An email address for SSL certificate registration.

## Configuration Steps

### Domain Configuration

Create a domain configuration file based on the example in `config/examples/domain.config.example.yml`. Save it as `config/domain.config.yml`:

```yaml
domain:
  enabled: true
  primaryDomain: "your.domain.com"
  ssl:
    enabled: true
    provider: "letsencrypt"
    email: "your-email@example.com"
    autoRenew: true
    forceSSL: true
```

### DNS Configuration

Configure your DNS records according to your chosen subdomain structure:

```
# A Record for main domain
your.domain.com.         IN A     your.server.ip

# CNAME Records for services
plex.your.domain.com.    IN CNAME your.domain.com.
sonarr.your.domain.com.  IN CNAME your.domain.com.
radarr.your.domain.com.  IN CNAME your.domain.com.
```

### Subdomain Setup

Add service-specific subdomains to your configuration:

```yaml
subdomains:
  - name: "plex"
    service: "plex"
    port: 32400
    ssl: true
    auth: false

  - name: "sonarr"
    service: "sonarr"
    port: 8989
    ssl: true
    auth: true
```

### SSL Certificate Setup

The system automatically handles SSL certificate provisioning through Let's Encrypt. For custom certificates:

```yaml
ssl:
  enabled: true
  provider: "custom"
  cert: "/path/to/certificate.pem"
  key: "/path/to/private.key"
  autoRenew: false
  forceSSL: true
```

### Dynamic DNS (Optional)

For dynamic IP addresses, configure DDNS:

```yaml
ddns:
  enabled: true
  provider: "dynu"
  username: "your-username"
  password: "your-api-key"
  updateInterval: 300
  ipType: "dynamic"
```

## Security Considerations

1.  **Authentication:**
    *   Enable Authelia for centralized authentication.
    *   Configure 2FA for additional security.
    *   Set appropriate access controls per service.

2.  **SSL/TLS:**
    *   Always enable SSL in production.
    *   Use auto-renewal for certificates.
    *   Configure HSTS for enhanced security.

3.  **Fail2Ban:**
    *   Enable Fail2Ban protection.
    *   Configure appropriate ban times.
    *   Monitor access logs.

## Troubleshooting

### Common Issues

1.  **DNS Propagation:**
    *   Allow up to 48 hours for DNS changes to propagate.
    *   Use `dig` or `nslookup` to verify records.
    *   Check DNS configuration for typos.

2.  **SSL Certificate Issues:**
    *   Verify domain ownership.
    *   Check email address for Let's Encrypt.
    *   Ensure ports 80/443 are accessible.

3.  **Proxy Issues:**
    *   Verify Nginx Proxy Manager configuration.
    *   Check service connectivity.
    *   Review proxy logs for errors.

### Validation Commands

*   **Check DNS Propagation:**

    ```bash
    dig +short your.domain.com
    dig +short plex.your.domain.com
    ```

*   **Test SSL Certificate:**

    ```bash
    openssl s_client -connect your.domain.com:443 -servername your.domain.com
    ```

## Maintenance

### Regular Tasks

1.  **SSL Certificates:**
    *   Monitor certificate expiration.
    *   Verify auto-renewal is working.
    *   Keep email address updated.

2.  **DNS Records:**
    *   Regularly verify DNS configuration.
    *   Update records when adding services.
    *   Monitor DDNS updates if enabled.

3.  **Security:**
    *   Review access logs.
    *   Update security configurations.
    *   Monitor for unauthorized access.

## Additional Resources

*   [DNS Configuration Guide](network-setup.md)
*   [Security Best Practices](security.md)
*   [Troubleshooting Guide](troubleshooting.md)
*   [Nginx Proxy Manager Documentation](https://nginxproxymanager.com/)
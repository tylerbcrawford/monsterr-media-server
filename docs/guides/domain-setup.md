# Domain Setup Guide

## Overview
This guide provides step-by-step instructions for configuring your domain with Monsterr Media Server. It covers DNS configuration, SSL certificates, and service setup using Nginx Proxy Manager.

## Prerequisites
- A registered domain name
- Access to your domain's DNS settings
- Your server's IP address
- Router access for port forwarding

## Step-by-Step Setup

### 1. DNS Configuration

#### A. Add DNS Records
1. Log into your domain registrar's DNS management
2. Add the following records:
   ```
   # A Record - Point your domain to your server
   @ IN A your.server.ip.address

   # CNAME Records - Set up subdomains for services
   plex     IN CNAME your.domain.com
   sonarr   IN CNAME your.domain.com
   radarr   IN CNAME your.domain.com
   lidarr   IN CNAME your.domain.com
   bazarr   IN CNAME your.domain.com
   readarr  IN CNAME your.domain.com
   ```

   Alternatively, you can use a wildcard record:
   ```
   # Wildcard CNAME
   * IN CNAME your.domain.com
   ```

#### B. Verify DNS Propagation
```bash
# Check if DNS records are propagating
nslookup your.domain.com
nslookup plex.your.domain.com
```
Note: DNS changes can take up to 48 hours to propagate fully.

### 2. Port Forwarding Setup

#### A. Required Ports
| Port  | Protocol | Service            | Required |
|-------|----------|-------------------|-----------|
| 80    | TCP      | HTTP              | Yes       |
| 443   | TCP      | HTTPS             | Yes       |
| 81    | TCP      | NPM UI            | Yes       |
| 32400 | TCP      | Plex External     | Optional  |

#### B. Configure Port Forwarding
1. Access your router's admin interface
2. Navigate to port forwarding section
3. Add the following forwards:
   ```
   80   -> SERVER_IP:80
   443  -> SERVER_IP:443
   81   -> SERVER_IP:81
   32400-> SERVER_IP:32400 (if using Plex remote access)
   ```

### 3. Initial Configuration

#### A. Set Domain in Configuration
1. Edit your config.env file:
   ```bash
   # Set your domain
   DOMAIN=your.domain.com
   USE_DDNS=no
   ```

#### B. Apply Configuration
```bash
# Restart services to apply changes
docker-compose down
docker-compose up -d
```

### 4. Nginx Proxy Manager Setup

#### A. Initial Access
1. Access NPM interface:
   ```
   http://YOUR_SERVER_IP:81
   ```

2. Default login credentials:
   - Email: admin@example.com
   - Password: changeme
   
3. Change default credentials on first login

#### B. Configure Proxy Hosts

For each service, add a proxy host:

1. Plex:
   - Domain: plex.your.domain.com
   - Scheme: http
   - Forward IP: plex
   - Forward Port: 32400
   - Enable SSL, Force SSL
   - Enable Websockets

2. Sonarr:
   - Domain: sonarr.your.domain.com
   - Scheme: http
   - Forward IP: sonarr
   - Forward Port: 8989
   - Enable SSL, Force SSL

3. Radarr:
   - Domain: radarr.your.domain.com
   - Scheme: http
   - Forward IP: radarr
   - Forward Port: 7878
   - Enable SSL, Force SSL

(Repeat for other services with their respective ports)

### 5. SSL Certificate Setup

#### A. Using Let's Encrypt (Recommended)
In Nginx Proxy Manager:
1. Edit each proxy host
2. SSL Tab -> Request a new SSL Certificate
3. Enable:
   - Force SSL
   - HTTP/2 Support
   - HSTS Enabled
4. Select Let's Encrypt
5. Add your email
6. Accept Terms
7. Save

#### B. Certificate Renewal
Certificates will auto-renew when they reach 30 days before expiration.

### 6. Verification

#### A. Check Domain Access
```bash
# Test HTTPS access
curl -vI https://your.domain.com
curl -vI https://plex.your.domain.com
```

#### B. Verify SSL Certificates
In Nginx Proxy Manager:
1. Go to SSL Certificates
2. Check status and expiry dates
3. Verify all domains are secured

### 7. Security Recommendations

1. Enable 2FA in Authelia
2. Configure fail2ban:
   ```bash
   sudo ./scripts/configure_fail2ban.sh
   ```
3. Keep Nginx Proxy Manager updated
4. Regularly check SSL certificate status
5. Monitor access logs

## Troubleshooting

### Common Issues

1. DNS Not Resolving
   ```bash
   # Check DNS propagation
   dig your.domain.com
   ```

2. SSL Certificate Errors
   ```bash
   # Verify certificate
   openssl s_client -connect your.domain.com:443
   ```

3. Port Forwarding Issues
   ```bash
   # Check if ports are open
   nc -zv your.server.ip.address 80
   nc -zv your.server.ip.address 443
   ```

### Getting Help
1. Check container logs:
   ```bash
   docker-compose logs nginx-proxy-manager
   ```
2. Review NPM access logs
3. Check service status:
   ```bash
   docker-compose ps
   ```

## Next Steps
1. Configure individual service settings
2. Set up authentication
3. Configure backup system
4. Enable monitoring

## Additional Resources
- [Nginx Proxy Manager Documentation](https://nginxproxymanager.com/guide/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [DNS Configuration Guide](https://www.cloudflare.com/learning/dns/dns-records/)
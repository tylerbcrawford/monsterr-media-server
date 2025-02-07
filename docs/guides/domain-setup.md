# Domain Setup Guide

## Overview
This guide provides step-by-step instructions for configuring your domain with Monsterr Media Server. It covers DNS configuration, SSL certificates, and service setup using Nginx Proxy Manager.

## Prerequisites
- A registered domain name
- Access to your domain's DNS settings
- Your server's IP address
- Router access for port forwarding

## Required Subdomains

### Quick Reference List
Replace `your.domain.com` with your actual domain:

1. Core Infrastructure:
   - auth.your.domain.com
   - proxy.your.domain.com

2. Media Services:
   - plex.your.domain.com
   - sonarr.your.domain.com
   - radarr.your.domain.com
   - lidarr.your.domain.com
   - bazarr.your.domain.com

3. Download Management:
   - prowlarr.your.domain.com
   - qbit.your.domain.com
   - nzb.your.domain.com

4. Book Management:
   - readarr.your.domain.com
   - calibre.your.domain.com
   - audiobooks.your.domain.com

5. Monitoring & Management:
   - grafana.your.domain.com
   - prometheus.your.domain.com
   - tautulli.your.domain.com

6. User Interface:
   - dash.your.domain.com
   - request.your.domain.com

### Core Infrastructure
1. **auth** - Authentication Portal
   - Purpose: Authelia 2FA and SSO
   - DNS: `auth IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Must be set up first as other services depend on it
   - Access Pattern: All services redirect here for authentication

2. **proxy** - Nginx Proxy Manager
   - Purpose: Admin interface for proxy management
   - DNS: `proxy IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: None
   - Access Pattern: Admin access only

### Media Services
1. **plex** - Plex Media Server
   - Purpose: Media streaming interface
   - DNS: `plex IN CNAME your.domain.com`
   - SSL: Required (custom certificate possible)
   - Dependencies: None
   - Access Pattern: Direct user access
   - Note: Also needs port 32400 forwarded for remote access

2. **sonarr** - TV Show Management
   - Purpose: TV series management interface
   - DNS: `sonarr IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Requires auth, prowlarr
   - Access Pattern: Admin access through auth

3. **radarr** - Movie Management
   - Purpose: Movie management interface
   - DNS: `radarr IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Requires auth, prowlarr
   - Access Pattern: Admin access through auth

4. **lidarr** - Music Management
   - Purpose: Music management interface
   - DNS: `lidarr IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Requires auth, prowlarr
   - Access Pattern: Admin access through auth

5. **bazarr** - Subtitle Management
   - Purpose: Subtitle management interface
   - DNS: `bazarr IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Requires auth, sonarr, radarr
   - Access Pattern: Admin access through auth

### Download Management
1. **prowlarr** - Indexer Management
   - Purpose: Indexer configuration interface
   - DNS: `prowlarr IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Requires auth
   - Access Pattern: Admin access through auth

2. **qbit** - qBittorrent Interface
   - Purpose: Torrent client interface
   - DNS: `qbit IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Requires auth, VPN
   - Access Pattern: Admin access through auth
   - Note: Must be behind VPN

3. **nzb** - NZBGet Interface
   - Purpose: Usenet client interface
   - DNS: `nzb IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Requires auth
   - Access Pattern: Admin access through auth

### Book Management
1. **readarr** - Book Management
   - Purpose: Book management interface
   - DNS: `readarr IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Requires auth, prowlarr
   - Access Pattern: Admin access through auth

2. **calibre** - E-book Library
   - Purpose: E-book management interface
   - DNS: `calibre IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Requires auth
   - Access Pattern: User/Admin access through auth

3. **audiobooks** - Audiobookshelf
   - Purpose: Audiobook streaming interface
   - DNS: `audiobooks IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Requires auth
   - Access Pattern: User access through auth

### Monitoring & Management
1. **grafana** - Monitoring Dashboard
   - Purpose: System monitoring interface
   - DNS: `grafana IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Requires auth, prometheus
   - Access Pattern: Admin access through auth

2. **prometheus** - Metrics Collection
   - Purpose: Metrics endpoint (internal)
   - DNS: `prometheus IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Requires auth
   - Access Pattern: Internal access only

3. **tautulli** - Plex Monitoring
   - Purpose: Plex statistics and monitoring
   - DNS: `tautulli IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Requires auth, plex
   - Access Pattern: Admin access through auth

### User Interface
1. **dash** - Organizr Dashboard
   - Purpose: Main user dashboard
   - DNS: `dash IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Requires auth
   - Access Pattern: User access through auth

2. **request** - Overseerr
   - Purpose: Media request interface
   - DNS: `request IN CNAME your.domain.com`
   - SSL: Required (handled by NPM)
   - Dependencies: Requires auth, plex
   - Access Pattern: User access through auth

## Step-by-Step Setup

### 1. DNS Configuration

#### A. Add DNS Records
1. Log into your domain registrar's DNS management
2. Add A record for main domain:
   ```
   # A Record - Point your domain to your server
   @ IN A your.server.ip.address
   ```

3. Add CNAME records for all services:
   ```
   # CNAME Records for all services
   auth        IN CNAME your.domain.com
   proxy       IN CNAME your.domain.com
   plex        IN CNAME your.domain.com
   sonarr      IN CNAME your.domain.com
   radarr      IN CNAME your.domain.com
   lidarr      IN CNAME your.domain.com
   bazarr      IN CNAME your.domain.com
   prowlarr    IN CNAME your.domain.com
   qbit        IN CNAME your.domain.com
   nzb         IN CNAME your.domain.com
   readarr     IN CNAME your.domain.com
   calibre     IN CNAME your.domain.com
   audiobooks  IN CNAME your.domain.com
   grafana     IN CNAME your.domain.com
   prometheus  IN CNAME your.domain.com
   tautulli    IN CNAME your.domain.com
   dash        IN CNAME your.domain.com
   request     IN CNAME your.domain.com
   ```

   Alternatively, use a wildcard record:
   ```
   # Wildcard CNAME (covers all subdomains)
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
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
2. Understanding DNS Record Types:

   A. A Record (Address Record):
      - Points your main domain directly to your server's IP address
      - Example if your domain is example.com and server IP is 192.168.1.100:
        ```
        Type: A
        Name: @ (represents main domain)
        Value: 192.168.1.100
        ```

   B. CNAME Record (Canonical Name):
      - Points a subdomain to your main domain
      - Used for all services (auth, plex, etc.)
      - Example for auth.example.com:
        ```
        Type: CNAME
        Name: auth
        Value: example.com
        ```

3. Add the following records in your domain registrar's DNS settings:

   A. Main Domain (A Record):
      ```
      Type: A
      Name: @ (or leave blank)
      Value: your.server.ip.address
      ```

   B. Service Subdomains (CNAME Records):
      ```
      Type: CNAME
      Name: auth
      Value: your.domain.com
      ```
      (Repeat for each service with these settings)

   Full list of required CNAME records:
   | Name       | Type  | Value            |
   |------------|-------|------------------|
   | auth       | CNAME | your.domain.com  |
   | proxy      | CNAME | your.domain.com  |
   | plex       | CNAME | your.domain.com  |
   | sonarr     | CNAME | your.domain.com  |
   | radarr     | CNAME | your.domain.com  |
   | lidarr     | CNAME | your.domain.com  |
   | bazarr     | CNAME | your.domain.com  |
   | prowlarr   | CNAME | your.domain.com  |
   | qbit       | CNAME | your.domain.com  |
   | nzb        | CNAME | your.domain.com  |
   | readarr    | CNAME | your.domain.com  |
   | calibre    | CNAME | your.domain.com  |
   | audiobooks | CNAME | your.domain.com  |
   | grafana    | CNAME | your.domain.com  |
   | prometheus | CNAME | your.domain.com  |
   | tautulli   | CNAME | your.domain.com  |
   | dash       | CNAME | your.domain.com  |
   | request    | CNAME | your.domain.com  |

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

#### A. Dynamic DNS (DDNS) Setup
1. **Overview**
   - DDNS keeps your domain pointing to your server even when your IP changes
   - Supported provider: Dynu DNS
   - Automatic IP monitoring and updates

2. **Dynu DNS Setup**
   1. Create a Dynu account at https://www.dynu.com
   2. Add your domain to Dynu DNS
   3. Note your username and password for configuration

3. **Configuration Options**
   - Dynamic IP (recommended): Automatically detects IP changes
   - Static IP: Manually set IP updates
   - Update Interval: How often to check for IP changes (minimum 60 seconds)

#### B. Set Domain Configuration
1. Edit your config.env file:
    ```bash
    # Basic Domain Settings
    DOMAIN=your.domain.com
    
    # DDNS Configuration
    USE_DDNS=yes  # Set to 'no' if not using DDNS
    DDNS_PROVIDER=dynu
    DDNS_USERNAME=your_username
    DDNS_PASSWORD=your_password
    DDNS_UPDATE_INTERVAL=300  # In seconds (5 minutes)
    DDNS_IP_TYPE=dynamic  # or 'static'
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

#### B. Verify DDNS Configuration
```bash
# Check DDNS service status
docker-compose logs ddns-updater

# Verify current IP
curl -s https://api.ipify.org
cat /opt/media-server/config/ddns.json | grep currentIP

# Test domain resolution
dig +short your.domain.com
```

#### C. Monitor DDNS Updates
1. Check update logs:
   ```bash
   docker-compose logs -f ddns-updater
   ```

2. Verify IP changes are detected:
   ```bash
   # View recent IP updates
   grep "IP changed" /opt/media-server/logs/ddns.log
   ```

3. Test Dynu API connectivity:
   ```bash
   curl -I https://api.dynu.com/v2/dns
   ```

#### D. Verify SSL Certificates
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

2. DDNS Service Issues
    Common problems and solutions:
    
    a. Service not updating:
    ```bash
    # Check service status
    docker-compose ps ddns-updater
    docker-compose logs --tail=100 ddns-updater
    ```
    
    b. Authentication failures:
    ```bash
    # Verify credentials
    cat /opt/media-server/config/ddns.json
    # Ensure password is correct and not URL-encoded
    ```
    
    c. IP detection issues:
    ```bash
    # Test IP detection
    curl -s https://api.ipify.org
    # Compare with current DDNS IP
    cat /opt/media-server/config/ddns.json | grep currentIP
    ```
    
    d. Update interval problems:
    ```bash
    # Check update frequency
    grep "Updating DNS" /opt/media-server/logs/ddns.log
    # Should see updates at your configured interval
    ```

3. SSL Certificate Errors
    ```bash
    # Verify certificate
    openssl s_client -connect your.domain.com:443
    ```

4. Port Forwarding Issues
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
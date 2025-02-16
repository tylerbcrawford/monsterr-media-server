# Custom Domain Integration Overview

## User Experience Flow

### 1. Domain Configuration Process
- Users start with their registered domain name
- Setup wizard guides through domain configuration
- Interactive validation ensures correct setup
- Real-time DNS propagation checking
- Automated SSL certificate provisioning

### 2. Domain Structure and Organization

#### Core Infrastructure (Required)
- Main domain (e.g., `your.domain.com`)
- Authentication portal (`auth.your.domain.com`)
- Proxy management (`proxy.your.domain.com`)

#### Service-Specific Subdomains
- Media streaming: `plex.your.domain.com`
- Content management:
  * TV shows: `sonarr.your.domain.com`
  * Movies: `radarr.your.domain.com`
  * Music: `lidarr.your.domain.com`
  * Books: `readarr.your.domain.com`
- User interfaces:
  * Dashboard: `dash.your.domain.com`
  * Request system: `request.your.domain.com`

### 3. Security and Access Control
- Centralized authentication through Authelia
- Two-factor authentication requirement
- SSL/TLS encryption for all subdomains
- Fail2Ban integration for intrusion prevention
- Rate limiting and CSRF protection

### 4. Branding and User Perception
- Consistent domain structure across services
- Professional appearance with SSL padlock
- Unified authentication experience
- Seamless service integration
- Custom branding opportunities through subdomains

## Technical Implementation

### 1. DNS Configuration
- A record for main domain
- CNAME records for subdomains
- Optional wildcard DNS support
- DDNS integration for dynamic IPs
- Automated DNS verification

### 2. SSL Certificate Management
- Automated Let's Encrypt integration
- Certificate auto-renewal
- Wildcard certificate support
- SSL configuration through Nginx Proxy Manager
- Forced HTTPS redirects

### 3. Proxy Configuration
- Nginx Proxy Manager as central proxy
- WebSocket support for real-time features
- Custom headers and security policies
- Service-specific routing rules
- Health check integration

### 4. Network Requirements
- Ports 80 and 443 for HTTP/HTTPS
- Port 81 for proxy management
- Service-specific ports (e.g., 32400 for Plex)
- UFW firewall configuration
- Optional VPN integration

## User Impact

### 1. Accessibility
- Single domain for all services
- Consistent access patterns
- Mobile-friendly URLs
- Bookmark support
- External sharing capabilities

### 2. Security
- Unified security model
- Single sign-on across services
- Protected external access
- Encrypted communications
- Intrusion prevention

### 3. Performance
- Local DNS resolution
- CDN compatibility
- Optimized routing
- Caching support
- Load balancing ready

### 4. Maintenance
- Centralized certificate management
- Automated renewal processes
- Simplified backup procedures
- Monitoring integration
- Update management

## Configuration Examples

### 1. DNS Records
```
# A Record
your.domain.com.     IN A     your.server.ip

# CNAME Records
auth.your.domain.com.    IN CNAME   your.domain.com.
plex.your.domain.com.    IN CNAME   your.domain.com.
sonarr.your.domain.com.  IN CNAME   your.domain.com.
```

### 2. Proxy Configuration
```nginx
# Example Plex configuration
server {
    listen 443 ssl;
    server_name plex.your.domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your.domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your.domain.com/privkey.pem;
    
    location / {
        proxy_pass http://plex:32400;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Best Practices

1. Domain Management
   - Use descriptive subdomains
   - Implement DNSSEC when available
   - Regular DNS health checks
   - Backup DNS providers
   - Documentation of DNS changes

2. Security
   - Regular SSL certificate monitoring
   - Security header implementation
   - Access log review
   - Failed login monitoring
   - Regular security audits

3. Performance
   - DNS caching configuration
   - CDN integration when needed
   - Regular performance monitoring
   - Load balancing consideration
   - Optimization of SSL sessions

4. Maintenance
   - Automated certificate renewal
   - Regular DNS record verification
   - Backup of proxy configurations
   - Monitoring of domain expiration
   - Documentation updates
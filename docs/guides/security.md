# Security Guide

This document outlines the security features, configurations, and best practices for the Monsterr Media Server.

## Table of Contents
- [Security Architecture](#security-architecture)
- [Authentication Setup](#authentication-setup)
- [Network Security](#network-security)
- [Access Control](#access-control)
- [Monitoring & Alerts](#monitoring--alerts)
- [Best Practices](#best-practices)
- [Security Maintenance](#security-maintenance)

## Security Architecture

### Overview
```
Internet → Firewall → Nginx Proxy → Authelia → Services
                   ↓
             Fail2Ban Monitor
```

### Security Layers
1. **Network Level**
   - Firewall (UFW)
   - Reverse Proxy (Nginx)
   - VPN Integration

2. **Authentication Level**
   - Authelia (2FA)
   - Service-specific auth

3. **Application Level**
   - Docker isolation
   - Service-specific security

4. **Monitoring Level**
   - Fail2Ban
   - Prometheus/Grafana
   - Log monitoring

## Authentication Setup

### Authelia Configuration

1. **Initial Setup**
   ```yaml
   # /opt/media-server/authelia/configuration.yml
   server:
     host: 0.0.0.0
     port: 9091

   totp:
     issuer: Your-Organization
     period: 30
     skew: 1

   authentication_backend:
     file:
       path: /config/users_database.yml
   ```

2. **User Management**
   ```yaml
   # /opt/media-server/authelia/users_database.yml
   users:
     username:
       displayname: "User Display Name"
       password: "hashed_password"
       email: user@example.com
       groups:
         - admins
   ```

3. **2FA Setup**
   - Enable TOTP
   - Configure backup codes
   - Set session parameters

### Service Authentication

1. **Plex**
   - Enable authentication
   - Configure managed users
   - Set up sharing permissions

2. **VNC Access**
   - Two-factor authentication required
   - VNC password protection
   - Session timeout configuration
   - IP-based access restrictions
   - Websocket security measures

3. **Other Services**
   - Individual service credentials
   - API key management
   - Role-based access

## Network Security

### Firewall Configuration

1. **UFW Setup**
   ```bash
   # Basic rules
   ufw default deny incoming
   ufw default allow outgoing
   
   # Allow specific ports
   ufw allow ssh
   ufw allow 80/tcp
   ufw allow 443/tcp
   ```

2. **Port Management**
   - Minimize exposed ports
   - Use internal Docker network
   - Regular port audits

### VPN Integration

1. **Configuration**
   ```yaml
   vpn:
     image: dperson/openvpn-client
     environment:
       - VPN_PROVIDER=provider
       - VPN_USERNAME=username
       - VPN_PASSWORD=password
   ```

2. **Kill Switch Setup**
   - Prevent IP leaks
   - Monitor connection status
   - Automatic reconnection

## Access Control

### Permission Structure

1. **File Permissions**
   ```bash
   # Set correct ownership
   chown -R $PUID:$PGID /opt/media-server
   
   # Set directory permissions
   chmod 755 /opt/media-server
   chmod 600 /opt/media-server/config.env
   ```

2. **Docker Permissions**
   - Use non-root users
   - Implement least privilege
   - Regular permission audits

### Access Levels

1. **Admin Access**
   - Full system control
   - Security configuration
   - User management

2. **User Access**
   - Media consumption
   - Limited configuration
   - Personal settings

## Monitoring & Alerts

### Fail2Ban Setup

1. **Configuration**
   ```ini
   # /etc/fail2ban/jail.local
   [nginx-proxy]
   enabled = true
   filter = nginx-proxy
   logpath = /opt/media-server/npm/logs/proxy-host-*_access.log
   maxretry = 3
   bantime = 86400

   [vnc]
   enabled = true
   port = 6080,5901
   filter = vnc
   logpath = /var/log/auth.log
   maxretry = 3
   findtime = 600
   bantime = 3600
   ```

2. **VNC Filter**
   ```ini
   # /etc/fail2ban/filter.d/vnc.conf
   [Definition]
   failregex = ^.*authentication failed from <HOST>.*$
               ^.*failed login attempt from <HOST>.*$
               ^.*invalid password from <HOST>.*$
   ignoreregex =
   ```

2. **Alert Configuration**
   - Email notifications
   - Discord/Slack integration
   - Log aggregation

### Security Monitoring

1. **Prometheus Metrics**
   ```yaml
   # prometheus.yml
   scrape_configs:
     - job_name: 'security_metrics'
       static_configs:
         - targets: ['localhost:9090']
   ```

2. **Grafana Dashboards**
   - Login attempts
   - Failed authentications
   - Network traffic patterns

## Best Practices

### Password Policy

1. **Requirements**
   - Minimum 12 characters
   - Mix of characters
   - Regular rotation
   - No common patterns

2. **Storage**
   - Use password manager
   - Encrypt credentials
   - Secure backup

### Update Policy

1. **Regular Updates**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Update containers
   docker-compose pull
   docker-compose up -d
   ```

2. **Security Patches**
   - Monitor security advisories
   - Immediate critical updates
   - Scheduled maintenance

## Security Maintenance

### Regular Tasks

1. **Daily**
   - Monitor logs
   - Check failed logins
   - Verify backups

2. **Weekly**
   - Update containers
   - Check permissions
   - Review access logs

3. **Monthly**
   - Full security audit
   - Update passwords
   - Review configurations

### Incident Response

1. **Detection**
   - Monitor alerts
   - Log analysis
   - User reports

2. **Response**
   ```bash
   # Immediate actions
   ufw deny from <ip>
   docker-compose down <compromised-service>
   ```

3. **Recovery**
   - Restore from backup
   - Update credentials
   - Document incident

## Additional Resources
- [Installation Guide](installation.md)
- [Backup Guide](backup.md)
- [Monitoring Guide](monitoring.md)
- [Troubleshooting Guide](troubleshooting.md)

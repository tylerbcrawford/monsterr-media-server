# Service Configuration Guide

This guide provides detailed configuration instructions for all services included in the Monsterr Media Server.

## Table of Contents
- [Media Management](#media-management)
- [Download Management](#download-management)
- [System Management](#system-management)
- [Monitoring Services](#monitoring-services)
- [Security Services](#security-services)

## Media Management

### Plex Media Server

1. **Initial Setup**
   ```yaml
   plex:
     image: lscr.io/linuxserver/plex:latest
     environment:
       - PLEX_CLAIM=${PLEX_CLAIM_TOKEN}
   ```

2. **Library Configuration**
   - Movies: `/media/movies`
   - TV Shows: `/media/tv`
   - Music: `/media/music`
   - Photos: `/media/photos`

3. **Optimization**
   - Transcoding settings
   - Hardware acceleration
   - Library scan schedule

### Sonarr (TV Shows)

1. **Basic Configuration**
   ```yaml
   sonarr:
     image: lscr.io/linuxserver/sonarr:latest
     volumes:
       - ./sonarr/config:/config
       - ./media/tv:/tv
   ```

2. **Integration Setup**
   - Connect to Prowlarr
   - Configure qBittorrent
   - Set up quality profiles

### Radarr (Movies)

1. **Configuration**
   ```yaml
   radarr:
     image: lscr.io/linuxserver/radarr:latest
     volumes:
       - ./radarr/config:/config
       - ./media/movies:/movies
   ```

2. **Quality Settings**
   - HD/4K profiles
   - Language preferences
   - Release restrictions

### Lidarr (Music)

1. **Setup**
   ```yaml
   lidarr:
     image: lscr.io/linuxserver/lidarr:latest
     volumes:
       - ./lidarr/config:/config
       - ./media/music:/music
   ```

2. **Music Management**
   - Artist monitoring
   - Quality profiles
   - Metadata agents

## Download Management

### qBittorrent with VPN

1. **Configuration**
   ```yaml
   qbittorrentvpn:
     image: ghcr.io/hotio/qbittorrent:latest
     environment:
       - VPN_ENABLED=yes
       - VPN_TYPE=openvpn
   ```

2. **VPN Setup**
   - Provider configuration
   - Kill switch
   - Port forwarding

### Prowlarr (Indexer Management)

1. **Basic Setup**
   ```yaml
   prowlarr:
     image: lscr.io/linuxserver/prowlarr:latest
     volumes:
       - ./prowlarr/config:/config
   ```

2. **Indexer Configuration**
   - Add indexers
   - Configure categories
   - Set up API keys

## System Management

### Nginx Proxy Manager

1. **Initial Access**
   ```
   URL: https://npm.yourdomain.com
   Email: admin@example.com
   Password: changeme
   ```

2. **Proxy Host Setup**
   - SSL configuration
   - Access control
   - Custom locations

### Portainer

1. **Configuration**
   ```yaml
   portainer:
     image: portainer/portainer-ce:latest
     volumes:
       - /var/run/docker.sock:/var/run/docker.sock
   ```

2. **Management Features**
   - Container management
   - Volume management
   - Network configuration

## Monitoring Services

### Prometheus

1. **Basic Configuration**
   ```yaml
   # prometheus.yml
   global:
     scrape_interval: 15s
     evaluation_interval: 15s

   scrape_configs:
     - job_name: 'prometheus'
       static_configs:
         - targets: ['localhost:9090']
   ```

2. **Service Monitoring**
   - Target configuration
   - Alert rules
   - Data retention

### Grafana

1. **Setup**
   ```yaml
   grafana:
     image: grafana/grafana:latest
     environment:
       - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}
   ```

2. **Dashboard Configuration**
   - System metrics
   - Service health
   - Custom panels

### Tautulli (Plex Monitoring)

1. **Configuration**
   ```yaml
   tautulli:
     image: lscr.io/linuxserver/tautulli:latest
     volumes:
       - ./tautulli/config:/config
   ```

2. **Monitoring Setup**
   - User statistics
   - Library analytics
   - Notifications

## Security Services

### Authelia

1. **Basic Configuration**
   ```yaml
   authelia:
     image: authelia/authelia:latest
     volumes:
       - ./authelia:/config
   ```

2. **Integration**
   - 2FA setup
   - User database
   - Access control rules

### Fail2Ban

1. **Configuration**
   ```yaml
   fail2ban:
     image: crazymax/fail2ban:latest
     volumes:
       - /var/log:/var/log:ro
   ```

2. **Jail Setup**
   - Custom rules
   - Ban policies
   - Email notifications

## Service Maintenance

### Backup Procedures

1. **Configuration Backup**
   ```bash
   # Backup all config directories
   tar -czf configs_backup.tar.gz /opt/media-server/*/config
   ```

2. **Database Backup**
   - Service-specific dumps
   - Regular scheduling
   - Retention policy

### Update Procedures

1. **Service Updates**
   ```bash
   # Update all containers
   docker-compose pull
   docker-compose up -d
   ```

2. **Version Management**
   - Update schedule
   - Version tracking
   - Rollback procedures

## Troubleshooting

### Common Issues

1. **Permission Problems**
   ```bash
   # Fix common permission issues
   chown -R $PUID:$PGID /opt/media-server
   chmod -R 755 /opt/media-server
   ```

2. **Network Issues**
   - Port conflicts
   - DNS problems
   - VPN connectivity

### Logging

1. **Log Access**
   ```bash
   # View service logs
   docker-compose logs [service_name]
   
   # Follow logs
   docker-compose logs -f [service_name]
   ```

2. **Log Management**
   - Rotation policy
   - Storage limits
   - Analysis tools

## Additional Resources
- [Installation Guide](installation.md)
- [Security Guide](security.md)
- [Backup Guide](backup.md)
- [Monitoring Guide](monitoring.md)

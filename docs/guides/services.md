# Service Configuration Guide

This guide provides detailed configuration instructions for all services included in the Monsterr Media Server.

## Core Infrastructure

### Portainer (Required)
1. **Configuration**
   ```yaml
   portainer:
     image: portainer/portainer-ce:latest
     volumes:
       - /var/run/docker.sock:/var/run/docker.sock
       - ./portainer/data:/data
     ports:
       - "9000:9000"
   ```

2. **Management Features**
   - Container management
   - Volume management
   - Network configuration
   - Resource monitoring
   - System health checks
   - Update management

3. **Initial Setup**
   - Access at http://SERVER_IP:9000
   - Create admin credentials
   - Configure endpoint
   - Set up monitoring
   - Configure backup location

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

3. **Configuration**
   ```yaml
   nginx-proxy-manager:
     image: jc21/nginx-proxy-manager:latest
     ports:
       - '80:80'
       - '443:443'
       - '81:81'
   ```

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

3. **Redis Integration**
   ```yaml
   redis:
     image: redis:latest
     container_name: authelia-redis
   ```

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

## Download Management

### qBittorrent with VPN
1. **Configuration**
   ```yaml
   qbittorrentvpn:
     image: ghcr.io/hotio/qbittorrent:latest
     environment:
       - VPN_ENABLED=yes
       - VPN_TYPE=openvpn
       - VPN_USERNAME=${QBITTORRENT_VPN_USERNAME}
       - VPN_PASSWORD=${QBITTORRENT_VPN_PASSWORD}
     cap_add:
       - NET_ADMIN
     devices:
       - /dev/net/tun
   ```

2. **VPN Setup**
   - Configure VPN credentials
   - Enable kill switch
   - Set up port forwarding
   - Configure bandwidth limits

3. **Integration**
   - Connect to Sonarr/Radarr
   - Configure download categories
   - Set up watch folders

### Prowlarr
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

### NZBGet
1. **Configuration**
   ```yaml
   nzbget:
     image: lscr.io/linuxserver/nzbget:latest
     environment:
       - VPN_ENABLED=yes
       - VPN_TYPE=openvpn
     volumes:
       - ./nzbget/config:/config
       - ./downloads:/downloads
   ```

2. **Setup**
   - Usenet server configuration
   - Download categories
   - Post-processing scripts

## Monitoring Services

### Prometheus
1. **Basic Configuration**
   ```yaml
   prometheus:
     image: prom/prometheus:latest
     volumes:
       - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
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

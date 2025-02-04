# Service Configuration Guide

This guide provides detailed configuration instructions for all services included in the Monsterr Media Server.

## Table of Contents
- [Core Infrastructure](#core-infrastructure)
- [Media Management](#media-management)
- [Download Management](#download-management)
- [Media Request & Discovery](#media-request--discovery)
- [Book & Audio Management](#book--audio-management)
- [System Management](#system-management)
- [Monitoring Services](#monitoring-services)
- [Security Services](#security-services)

## Core Infrastructure

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

### Bazarr (Subtitles)

1. **Configuration**
   ```yaml
   bazarr:
     image: lscr.io/linuxserver/bazarr:latest
     volumes:
       - ./bazarr/config:/config
       - ./media/movies:/movies
       - ./media/tv:/tv
   ```

2. **Integration**
   - Connect to Sonarr/Radarr
   - Language preferences
   - Provider setup

### Recyclarr

1. **Configuration**
   ```yaml
   recyclarr:
     image: requestrr/recyclarr:latest
     volumes:
       - ./recyclarr/config:/config
   ```

2. **Features**
   - Automatic quality profile updates
   - Custom formats synchronization
   - Schedule configuration

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

### NZBGet

1. **Configuration**
   ```yaml
   nzbget:
     image: lscr.io/linuxserver/nzbget:latest
     volumes:
       - ./nzbget/config:/config
       - ./downloads:/downloads
   ```

2. **Setup**
   - Usenet server configuration
   - Download categories
   - Post-processing scripts

### Unpackerr

1. **Configuration**
   ```yaml
   unpackerr:
     image: golift/unpackerr:latest
     volumes:
       - ./unpackerr/config:/config
       - ./downloads:/downloads
   ```

2. **Features**
   - Automatic extraction
   - Clean-up rules
   - Integration with *arr services

## Media Request & Discovery

### Overseerr

1. **Configuration**
   ```yaml
   overseerr:
     image: lscr.io/linuxserver/overseerr:latest
     volumes:
       - ./overseerr/config:/app/config
   ```

2. **Setup**
   - Plex integration
   - Sonarr/Radarr connection
   - User management

### Watchlist

1. **Configuration**
   ```yaml
   watchlist:
     image: ghcr.io/linuxserver/watchlist:latest
     volumes:
       - ./watchlist/config:/config
   ```

2. **Features**
   - Media tracking
   - Integration with media services
   - Custom lists

### Watchlistarr

1. **Configuration**
   ```yaml
   watchlistarr:
     image: ghcr.io/nylonee/watchlistarr:latest
     environment:
       - SONARR_API_KEY=${SONARR_API_KEY}
       - RADARR_API_KEY=${RADARR_API_KEY}
       - TRAKT_CLIENT_ID=${TRAKT_CLIENT_ID}
       - TRAKT_CLIENT_SECRET=${TRAKT_CLIENT_SECRET}
       - IMDB_USER_ID=${IMDB_USER_ID}
   ```

2. **Setup Instructions**
   - Get API keys from Sonarr/Radarr
   - Set up Trakt integration
   - Configure IMDB watchlist

## Book & Audio Management

### Audiobookshelf

1. **Configuration**
   ```yaml
   audiobookshelf:
     image: ghcr.io/advplyr/audiobookshelf:latest
     volumes:
       - ./audiobookshelf/config:/config
       - ./media/audiobooks:/audiobooks
       - ./media/podcasts:/podcasts
   ```

2. **Features**
   - Audiobook organization
   - Podcast management
   - Progress tracking

### Calibre-Web

1. **Configuration**
   ```yaml
   calibre-web:
     image: lscr.io/linuxserver/calibre-web:latest
     volumes:
       - ./calibre-web/config:/config
       - ./media/ebooks:/books
   ```

2. **Setup**
   - Library configuration
   - User management
   - Format conversion

### LazyLibrarian

1. **Configuration**
   ```yaml
   lazylibrarian:
     image: lscr.io/linuxserver/lazylibrarian:latest
     volumes:
       - ./lazylibrarian/config:/config
       - ./media/ebooks:/books
   ```

2. **Features**
   - Author monitoring
   - Book discovery
   - Automatic downloads

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

### Monitorr

1. **Configuration**
   ```yaml
   monitorr:
     image: monitorr/monitorr:latest
     volumes:
       - ./monitorr/config:/var/www/html/assets/config
   ```

2. **Features**
   - Service status monitoring
   - Uptime tracking
   - Alert configuration

## System Management

### Portainer

1. **Configuration**
   ```yaml
   portainer:
     image: portainer/portainer-ce:latest
     volumes:
       - /var/run/docker.sock:/var/run/docker.sock
       - ./portainer/data:/data
   ```

2. **Management Features**
   - Container management
   - Volume management
   - Network configuration

### Watchtower

1. **Configuration**
   ```yaml
   watchtower:
     image: containrrr/watchtower:latest
     volumes:
       - /var/run/docker.sock:/var/run/docker.sock
     environment:
       - WATCHTOWER_CLEANUP=true
       - WATCHTOWER_POLL_INTERVAL=86400
   ```

2. **Features**
   - Automatic updates
   - Update scheduling
   - Notification options

## Security Services

### Fail2Ban

1. **Configuration**
   ```yaml
   fail2ban:
     image: crazymax/fail2ban:latest
     volumes:
       - /var/log:/var/log:ro
       - /var/run/docker.sock:/var/run/docker.sock
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

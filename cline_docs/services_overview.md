# Services Overview

## 1. Remote Access
1. **noVNC**
   - Image: `ghcr.io/linuxserver/novnc:latest`
   - Description: Web-based VNC client with secure proxy

2. **VNC Server**
   - Image: `ghcr.io/linuxserver/webtop:ubuntu-kde`
   - Description: Remote desktop server with KDE environment

## 2. Core Infrastructure
1. **Nginx Proxy Manager**
   - Image: `jc21/nginx-proxy-manager:latest`
   - Description: Reverse proxy for managing access to services
   - Features:
     * Automated SSL certificate management
     * Custom domain routing
     * WebSocket support
     * Real-time validation

2. **Authelia**
   - Image: `authelia/authelia:latest`
   - Description: Two-factor authentication and SSO
   - Features:
     * Multi-factor authentication
     * Single sign-on
     * Security event logging
     * IP-based access control

3. **Redis**
   - Image: `redis:latest`
   - Description: Session management for Authelia
   - Features:
     * Secure session storage
     * High-performance caching
     * Persistent session data

4. **Fail2Ban**
   - Image: `crazymax/fail2ban:latest`
   - Description: Intrusion prevention system
   - Features:
     * Automated IP blocking
     * Custom security rules
     * Real-time monitoring
     * Alert notifications

## 3. Media Services
3. **Plex Media Server**
   - Image: `lscr.io/linuxserver/plex:latest`
   - Description: Media streaming server
   - Features:
     * Custom domain support
     * SSL encryption
     * Remote access

4. **Sonarr**
   - Image: `lscr.io/linuxserver/sonarr:latest`
   - Description: TV series management
   - Features:
     * Secure API access
     * Custom domain routing
     * Authentication integration

5. **Radarr**
   - Image: `lscr.io/linuxserver/radarr:latest`
   - Description: Movie management
   - Features:
     * Secure API access
     * Custom domain routing
     * Authentication integration

6. **Lidarr**
   - Image: `lscr.io/linuxserver/lidarr:latest`
   - Description: Music management
   - Features:
     * Secure API access
     * Custom domain routing
     * Authentication integration

7. **Bazarr**
   - Image: `lscr.io/linuxserver/bazarr:latest`
   - Description: Subtitle management
   - Features:
     * Secure API access
     * Custom domain routing
     * Authentication integration

## 4. Download Management
8. **qBittorrent with VPN**
   - Image: `ghcr.io/hotio/qbittorrent:latest`
   - Description: Torrent client with VPN integration
   - Features:
     * Multi-provider VPN support
     * Kill switch protection
     * Secure WebUI access
     * Authentication integration

9. **Prowlarr**
   - Image: `lscr.io/linuxserver/prowlarr:latest`
   - Description: Indexer manager
   - Features:
     * Secure API access
     * Custom domain routing
     * Authentication integration

10. **NZBGet**
    - Image: `lscr.io/linuxserver/nzbget:latest`
    - Description: Usenet downloader
    - Features:
      * Secure API access
      * Custom domain routing
      * Authentication integration

11. **VPN Service**
    - Image: `dperson/openvpn-client`
    - Description: OpenVPN client for secure downloads
    - Features:
      * Multi-provider support
      * Automatic reconnection
      * Connection monitoring

## 5. Book Services
12. **Readarr**
    - Image: `lscr.io/linuxserver/readarr:latest`
    - Description: Book management
    - Features:
      * Secure API access
      * Custom domain routing
      * Authentication integration

13. **Audiobookshelf**
    - Image: `ghcr.io/advplyr/audiobookshelf:latest`
    - Description: Audiobook and podcast server
    - Features:
      * Secure streaming
      * Custom domain support
      * Authentication integration

14. **Calibre**
    - Image: `lscr.io/linuxserver/calibre:latest`
    - Description: Full-featured ebook management system and server
    - Features:
      * Secure web access
      * Custom domain support
      * Authentication integration

15. **LazyLibrarian**
    - Image: `lscr.io/linuxserver/lazylibrarian:latest`
    - Description: Book download automation
    - Features:
      * Secure API access
      * Custom domain routing
      * Authentication integration

## 6. Monitoring Services
16. **Prometheus**
    - Image: `prom/prometheus:latest`
    - Description: Metrics collection
    - Features:
      * Secure metrics endpoint
      * Custom domain support
      * Authentication integration

17. **Grafana**
    - Image: `grafana/grafana:latest`
    - Description: Metrics visualization
    - Features:
      * Secure dashboard access
      * Custom domain support
      * Authentication integration
      * Alert notifications

18. **Tautulli**
    - Image: `lscr.io/linuxserver/tautulli:latest`
    - Description: Plex statistics and monitoring
    - Features:
      * Secure web interface
      * Custom domain support
      * Authentication integration

19. **Portainer**
    - Image: `portainer/portainer-ce:latest`
    - Description: Docker management interface
    - Features:
      * Secure management console
      * Custom domain support
      * Authentication integration

20. **Watchtower**
    - Image: `containrrr/watchtower:latest`
    - Description: Automatic container updates
    - Features:
      * Secure update process
      * Update notifications
      * Schedule management

## 7. User Interface Services
21. **Organizr**
    - Image: `organizr/organizr:latest`
    - Description: Services dashboard
    - Features:
      * Secure dashboard access
      * Custom domain support
      * SSO integration

22. **Overseerr**
    - Image: `lscr.io/linuxserver/overseerr:latest`
    - Description: Media request management
    - Features:
      * Secure request system
      * Custom domain support
      * Authentication integration

23. **Watchlist**
    - Image: `ghcr.io/linuxserver/watchlist:latest`
    - Description: Media watchlist management
    - Features:
      * Secure web interface
      * Custom domain support
      * Authentication integration

## 8. Utility Services
24. **Recyclarr**
    - Image: `requestrr/recyclarr:latest`
    - Description: Configuration management
    - Features:
      * Secure configuration
      * Automated updates
      * Version control

25. **Unpackerr**
    - Image: `golift/unpackerr:latest`
    - Description: Automated extraction
    - Features:
      * Secure file handling
      * Automated cleanup
      * Status monitoring
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

2. **Authelia**
   - Image: `authelia/authelia:latest`
   - Description: Two-factor authentication and SSO

3. **Redis**
   - Image: `redis:latest`
   - Description: Session management for Authelia

4. **Fail2Ban**
   - Image: `crazymax/fail2ban:latest`
   - Description: Intrusion prevention system

## 3. Media Services
3. **Plex Media Server**
   - Image: `lscr.io/linuxserver/plex:latest`
   - Description: Media streaming server

4. **Sonarr**
   - Image: `lscr.io/linuxserver/sonarr:latest`
   - Description: TV series management

5. **Radarr**
   - Image: `lscr.io/linuxserver/radarr:latest`
   - Description: Movie management

6. **Lidarr**
   - Image: `lscr.io/linuxserver/lidarr:latest`
   - Description: Music management

7. **Bazarr**
   - Image: `lscr.io/linuxserver/bazarr:latest`
   - Description: Subtitle management

## 4. Download Management
8. **qBittorrent with VPN**
   - Image: `ghcr.io/hotio/qbittorrent:latest`
   - Description: Torrent client with VPN integration

9. **Prowlarr**
   - Image: `lscr.io/linuxserver/prowlarr:latest`
   - Description: Indexer manager

10. **NZBGet**
    - Image: `lscr.io/linuxserver/nzbget:latest`
    - Description: Usenet downloader

11. **VPN Service**
    - Image: `dperson/openvpn-client`
    - Description: OpenVPN client for secure downloads

## 5. Book Services
12. **Readarr**
    - Image: `lscr.io/linuxserver/readarr:latest`
    - Description: Book management

13. **Audiobookshelf**
    - Image: `ghcr.io/advplyr/audiobookshelf:latest`
    - Description: Audiobook and podcast server

14. **Calibre**
    - Image: `lscr.io/linuxserver/calibre:latest`
    - Description: Full-featured ebook management system and server

15. **LazyLibrarian**
    - Image: `lscr.io/linuxserver/lazylibrarian:latest`
    - Description: Book download automation

## 6. Monitoring Services
16. **Prometheus**
    - Image: `prom/prometheus:latest`
    - Description: Metrics collection

17. **Grafana**
    - Image: `grafana/grafana:latest`
    - Description: Metrics visualization

18. **Tautulli**
    - Image: `lscr.io/linuxserver/tautulli:latest`
    - Description: Plex statistics and monitoring

19. **Portainer**
    - Image: `portainer/portainer-ce:latest`
    - Description: Docker management interface

20. **Watchtower**
    - Image: `containrrr/watchtower:latest`
    - Description: Automatic container updates

## 7. User Interface Services
21. **Organizr**
    - Image: `organizr/organizr:latest`
    - Description: Services dashboard

22. **Overseerr**
    - Image: `lscr.io/linuxserver/overseerr:latest`
    - Description: Media request management

23. **Watchlist**
    - Image: `ghcr.io/linuxserver/watchlist:latest`
    - Description: Media watchlist management

## 8. Utility Services
24. **Recyclarr**
    - Image: `requestrr/recyclarr:latest`
    - Description: Configuration management

25. **Unpackerr**
    - Image: `golift/unpackerr:latest`
    - Description: Automated extraction
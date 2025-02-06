# Services Overview

## 1. Core Infrastructure
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

## 2. Media Services
5. **Plex Media Server**
   - Image: `lscr.io/linuxserver/plex:latest`
   - Description: Media streaming server

6. **Sonarr**
   - Image: `lscr.io/linuxserver/sonarr:latest`
   - Description: TV series management

7. **Radarr**
   - Image: `lscr.io/linuxserver/radarr:latest`
   - Description: Movie management

8. **Lidarr**
   - Image: `lscr.io/linuxserver/lidarr:latest`
   - Description: Music management

9. **Bazarr**
   - Image: `lscr.io/linuxserver/bazarr:latest`
   - Description: Subtitle management

## 3. Download Management
10. **qBittorrent with VPN**
    - Image: `ghcr.io/hotio/qbittorrent:latest`
    - Description: Torrent client with VPN integration

11. **Prowlarr**
    - Image: `lscr.io/linuxserver/prowlarr:latest`
    - Description: Indexer manager

12. **NZBGet**
    - Image: `lscr.io/linuxserver/nzbget:latest`
    - Description: Usenet downloader

13. **VPN Service**
    - Image: `dperson/openvpn-client`
    - Description: OpenVPN client for secure downloads

## 4. Book Services
14. **Readarr**
    - Image: `lscr.io/linuxserver/readarr:latest`
    - Description: Book management

15. **Audiobookshelf**
    - Image: `ghcr.io/advplyr/audiobookshelf:latest`
    - Description: Audiobook and podcast server

16. **Calibre-Web**
    - Image: `lscr.io/linuxserver/calibre-web:latest`
    - Description: Ebook management interface

17. **LazyLibrarian**
    - Image: `lscr.io/linuxserver/lazylibrarian:latest`
    - Description: Book download automation

## 5. Monitoring Services
18. **Prometheus**
    - Image: `prom/prometheus:latest`
    - Description: Metrics collection

19. **Grafana**
    - Image: `grafana/grafana:latest`
    - Description: Metrics visualization

20. **Tautulli**
    - Image: `lscr.io/linuxserver/tautulli:latest`
    - Description: Plex statistics and monitoring

21. **Portainer**
    - Image: `portainer/portainer-ce:latest`
    - Description: Docker management interface

22. **Watchtower**
    - Image: `containrrr/watchtower:latest`
    - Description: Automatic container updates

## 6. User Interface Services
23. **Organizr**
    - Image: `organizr/organizr:latest`
    - Description: Services dashboard

24. **Overseerr**
    - Image: `lscr.io/linuxserver/overseerr:latest`
    - Description: Media request management

25. **Watchlist**
    - Image: `ghcr.io/linuxserver/watchlist:latest`
    - Description: Media watchlist management

## 7. Utility Services
26. **Recyclarr**
    - Image: `requestrr/recyclarr:latest`
    - Description: Configuration management

27. **Unpackerr**
    - Image: `golift/unpackerr:latest`
    - Description: Automated extraction
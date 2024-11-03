#!/bin/bash

# Create necessary directories for services
mkdir -p ./npm/data
mkdir -p ./npm/letsencrypt
mkdir -p ./authelia/config
mkdir -p ./authelia/data
mkdir -p ./plex/config
mkdir -p ./plex/transcode
mkdir -p ./media/movies
mkdir -p ./media/tv
mkdir -p ./media/music
mkdir -p ./media/books
mkdir -p ./media/audiobooks
mkdir -p ./media/podcasts
mkdir -p ./downloads
mkdir -p ./sonarr/config
mkdir -p ./radarr/config
mkdir -p ./lidarr/config
mkdir -p ./readarr/config
mkdir -p ./prowlarr/config
mkdir -p ./bazarr/config
mkdir -p ./audiobookshelf/config
mkdir -p ./calibre-web/config
mkdir -p ./lazylibrarian/config
mkdir -p ./recyclarr/config
mkdir -p ./watchlist/config
mkdir -p ./overseerr/config
mkdir -p ./tautulli/config
mkdir -p ./organizr/config
mkdir -p ./qbittorrentvpn/config
mkdir -p ./unpackerr/config
mkdir -p ./prometheus
mkdir -p ./grafana/data
mkdir -p ./nzbget/config
mkdir -p ./vpn/config
mkdir -p ./fail2ban/data
mkdir -p ./portainer/data
mkdir -p ./monitorr/config

# Set permissions
chown -R ${PUID}:${PGID} ./

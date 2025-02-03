#!/bin/bash
set -euo pipefail

# Load environment variables
if [ -f "./config.env" ]; then
    export $(grep -v '^#' config.env | xargs)
fi

# Set default values if not defined in config.env
MEDIA_DIR="${MEDIA_DIR:-/opt/media-server/media}"
DOWNLOADS_DIR="${DOWNLOADS_DIR:-/opt/media-server/downloads}"
PUID="${PUID:-1000}"
PGID="${PGID:-1000}"

echo "Creating directories..."
echo "Media directory: ${MEDIA_DIR}"
echo "Downloads directory: ${DOWNLOADS_DIR}"

# Create necessary directories for services
mkdir -p ./npm/data
mkdir -p ./npm/letsencrypt
mkdir -p ./authelia/config
mkdir -p ./authelia/data
mkdir -p ./plex/config
mkdir -p ./plex/transcode
# Create media directories at custom location
mkdir -p "${MEDIA_DIR}/movies"
mkdir -p "${MEDIA_DIR}/tv"
mkdir -p "${MEDIA_DIR}/music"
mkdir -p "${MEDIA_DIR}/books"
mkdir -p "${MEDIA_DIR}/audiobooks"
mkdir -p "${MEDIA_DIR}/podcasts"

# Create downloads directory at custom location
mkdir -p "${DOWNLOADS_DIR}"
mkdir -p "${DOWNLOADS_DIR}/incomplete"
mkdir -p "${DOWNLOADS_DIR}/complete"
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


# Set permissions for all directories
echo "Setting permissions..."

# Set permissions for local config directories
chown -R "${PUID}:${PGID}" ./

# Set permissions for custom media and downloads directories
chown -R "${PUID}:${PGID}" "${MEDIA_DIR}"
chown -R "${PUID}:${PGID}" "${DOWNLOADS_DIR}"

echo "Directory setup complete!"

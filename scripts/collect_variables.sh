#!/bin/bash

# Collect environment variables interactively

# Function to validate directory path
validate_dir() {
    local dir=$1
    local default=$2
    
    # If empty, use default
    if [ -z "$dir" ]; then
        echo "$default"
        return
    }
    
    # Remove trailing slash if present
    dir=${dir%/}
    echo "$dir"
}

echo "Media and Downloads Location Configuration"
echo "-----------------------------------------"
echo "You can specify custom locations for your media and downloads folders."
echo "For example: /mnt/externaldrive/media or /opt/media-server/media"
echo "Press Enter to use the default locations."
echo

read -p "Enter the path for media files [/opt/media-server/media]: " MEDIA_DIR
MEDIA_DIR=$(validate_dir "$MEDIA_DIR" "/opt/media-server/media")

read -p "Enter the path for downloads [/opt/media-server/downloads]: " DOWNLOADS_DIR
DOWNLOADS_DIR=$(validate_dir "$DOWNLOADS_DIR" "/opt/media-server/downloads")

echo
read -p "Enter your timezone (e.g., America/Toronto): " TIMEZONE
read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN
read -p "Enter your PUID: " PUID
read -p "Enter your PGID: " PGID
read -p "Enter your Plex claim token: " PLEX_CLAIM_TOKEN
read -p "Enter your VPN username: " VPN_USERNAME
read -p "Enter your VPN password: " VPN_PASSWORD
read -p "Enter your Grafana admin password: " GRAFANA_ADMIN_PASSWORD

# Generate Authelia secrets
AUTHELIA_JWT_SECRET=$(openssl rand -base64 32)
AUTHELIA_SESSION_SECRET=$(openssl rand -base64 32)
AUTHELIA_STORAGE_ENCRYPTION_KEY=$(openssl rand -base64 32)

# Collect SMTP settings for Authelia
read -p "Enter your SMTP host: " AUTHELIA_NOTIFIER_SMTP_HOST
read -p "Enter your SMTP port: " AUTHELIA_NOTIFIER_SMTP_PORT
read -p "Enter your SMTP username: " AUTHELIA_NOTIFIER_SMTP_USERNAME
read -p "Enter your SMTP password: " AUTHELIA_NOTIFIER_SMTP_PASSWORD
read -p "Enter your SMTP sender email: " AUTHELIA_NOTIFIER_SMTP_SENDER

# Save variables to config.env
cat <<EOL > config.env
# Directory Paths
MEDIA_DIR="${MEDIA_DIR}"
DOWNLOADS_DIR="${DOWNLOADS_DIR}"

# System Configuration
TIMEZONE="${TIMEZONE}"
DOMAIN="${DOMAIN}"
PUID=${PUID}
PGID=${PGID}
PLEX_CLAIM_TOKEN="${PLEX_CLAIM_TOKEN}"
VPN_USERNAME="${VPN_USERNAME}"
VPN_PASSWORD="${VPN_PASSWORD}"
GRAFANA_ADMIN_PASSWORD="${GRAFANA_ADMIN_PASSWORD}"
AUTHELIA_JWT_SECRET="${AUTHELIA_JWT_SECRET}"
AUTHELIA_SESSION_SECRET="${AUTHELIA_SESSION_SECRET}"
AUTHELIA_STORAGE_ENCRYPTION_KEY="${AUTHELIA_STORAGE_ENCRYPTION_KEY}"
AUTHELIA_NOTIFIER_SMTP_HOST="${AUTHELIA_NOTIFIER_SMTP_HOST}"
AUTHELIA_NOTIFIER_SMTP_PORT="${AUTHELIA_NOTIFIER_SMTP_PORT}"
AUTHELIA_NOTIFIER_SMTP_USERNAME="${AUTHELIA_NOTIFIER_SMTP_USERNAME}"
AUTHELIA_NOTIFIER_SMTP_PASSWORD="${AUTHELIA_NOTIFIER_SMTP_PASSWORD}"
AUTHELIA_NOTIFIER_SMTP_SENDER="${AUTHELIA_NOTIFIER_SMTP_SENDER}"
EOL

echo "Configuration saved to config.env"

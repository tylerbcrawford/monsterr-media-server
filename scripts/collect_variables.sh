#!/bin/bash

# Collect environment variables interactively

# Function to validate input is not empty
validate_input() {
    local input=$1
    local prompt=$2
    while [ -z "$input" ]; do
        read -p "$prompt" input
    done
    echo "$input"
}

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
echo
echo "Domain Configuration"
echo "-------------------"
echo "Your media server needs a domain name for secure access."
echo "You have two options:"
echo "1. Static IP with your own domain (e.g., example.com)"
echo "2. Dynamic IP with DDNS (e.g., myhome.dynu.net)"
echo

read -p "Are you using a dynamic IP with DDNS? (y/n): " USE_DDNS

if [[ "$USE_DDNS" == "y" ]]; then
    echo
    echo "Dynamic DNS (DDNS) Setup"
    echo "------------------------"
    echo "We'll help you set up Dynu DDNS for automatic IP updates."
    echo "Please ensure you have:"
    echo "1. Created a Dynu account at https://www.dynu.com"
    echo "2. Created a dynamic DNS hostname"
    echo "3. Retrieved your API credentials"
    echo

    read -p "Enter your Dynu hostname (e.g., myhome.dynu.net): " DOMAIN
    DOMAIN=$(validate_input "$DOMAIN" "Hostname cannot be empty. Please enter your Dynu hostname: ")

    read -p "Enter your Dynu API key: " DYNU_API_KEY
    DYNU_API_KEY=$(validate_input "$DYNU_API_KEY" "API key cannot be empty. Please enter your Dynu API key: ")

    # Create Dynu update script and service
    mkdir -p /opt/media-server/dynu
    
    # Create update script
    cat <<EOL > /opt/media-server/dynu/update_ip.sh
#!/bin/bash

# Dynu API credentials
HOSTNAME="$DOMAIN"
API_KEY="$DYNU_API_KEY"

# Get current public IP
CURRENT_IP=\$(curl -s https://api.ipify.org)

# Update Dynu DNS record
curl -s "https://api.dynu.com/v2/dns" \\
  -H "API-Key: \$API_KEY" \\
  -H "Content-Type: application/json" \\
  -X POST \\
  -d '{
    "name": "'\$HOSTNAME'",
    "ipv4Address": "'\$CURRENT_IP'",
    "ttl": 60
  }'

echo "[\$(date)] Updated IP to \$CURRENT_IP"
EOL

    chmod +x /opt/media-server/dynu/update_ip.sh

    # Create systemd service
    cat <<EOL > /etc/systemd/system/dynu-updater.service
[Unit]
Description=Dynu DDNS IP Updater
After=network.target

[Service]
Type=simple
ExecStart=/opt/media-server/dynu/update_ip.sh
Restart=always
RestartSec=300

[Install]
WantedBy=multi-user.target
EOL

    # Create systemd timer
    cat <<EOL > /etc/systemd/system/dynu-updater.timer
[Unit]
Description=Run Dynu DDNS IP Updater every 5 minutes

[Timer]
OnBootSec=1min
OnUnitActiveSec=5min
Unit=dynu-updater.service

[Install]
WantedBy=timers.target
EOL

    # Enable and start the timer
    systemctl daemon-reload
    systemctl enable dynu-updater.timer
    systemctl start dynu-updater.timer

    echo "DDNS setup complete! Your IP will be automatically updated every 5 minutes."
else
    echo
    echo "Static IP Domain Setup"
    echo "---------------------"
    echo "Please enter your domain name. You'll need to:"
    echo "1. Own a domain (e.g., from Namecheap, Cloudflare, etc.)"
    echo "2. Create an A record pointing to your server's IP"
    echo "3. Create CNAME records for subdomains (or a wildcard *.domain.com)"
    echo

    read -p "Enter your domain name (e.g., example.com): " DOMAIN
    DOMAIN=$(validate_input "$DOMAIN" "Domain cannot be empty. Please enter your domain name: ")
fi

echo
read -p "Enter your PUID: " PUID
read -p "Enter your PGID: " PGID
read -p "Enter your Plex claim token: " PLEX_CLAIM_TOKEN

echo
echo "Watchlistarr Configuration"
echo "-------------------------"
echo "For watchlist synchronization with Sonarr/Radarr, you'll need:"
echo "1. API keys from Sonarr and Radarr"
echo "2. Trakt.tv application credentials"
echo "3. Your IMDB user ID"
echo

read -p "Enter your Sonarr API key: " SONARR_API_KEY
read -p "Enter your Radarr API key: " RADARR_API_KEY
read -p "Enter your Trakt Client ID: " TRAKT_CLIENT_ID
read -p "Enter your Trakt Client Secret: " TRAKT_CLIENT_SECRET
read -p "Enter your IMDB User ID (e.g., ur12345678): " IMDB_USER_ID

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
# Validate IMDB User ID format
if [[ ! "$IMDB_USER_ID" =~ ^ur[0-9]{7,8}$ ]]; then
    echo "Warning: IMDB User ID should be in format 'urXXXXXXXX'"
    read -p "Are you sure this is correct? (y/n): " confirm
    if [[ "$confirm" != "y" ]]; then
        read -p "Please enter your IMDB User ID again (e.g., ur12345678): " IMDB_USER_ID
    fi
fi

cat <<EOL > config.env
# DDNS Configuration
USE_DDNS="${USE_DDNS}"
DYNU_API_KEY="${DYNU_API_KEY:-}"

# Directory Paths
MEDIA_DIR="${MEDIA_DIR}"
DOWNLOADS_DIR="${DOWNLOADS_DIR}"

# System Configuration
TIMEZONE="${TIMEZONE}"

# Watchlistarr Configuration
SONARR_API_KEY="${SONARR_API_KEY}"
RADARR_API_KEY="${RADARR_API_KEY}"
TRAKT_CLIENT_ID="${TRAKT_CLIENT_ID}"
TRAKT_CLIENT_SECRET="${TRAKT_CLIENT_SECRET}"
IMDB_USER_ID="${IMDB_USER_ID}"

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

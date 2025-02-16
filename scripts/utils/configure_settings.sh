#!/bin/bash

# Exit on error, undefined variables, and pipe failures
set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
CONFIG_DIR="$PROJECT_DIR/config"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_section() { echo -e "\n${BLUE}=== $1 ===${NC}\n"; }

# Error handler
trap 'log_error "An error occurred on line $LINENO. Exiting..."; exit 1' ERR

# Function to prompt for yes/no
prompt_yes_no() {
    local prompt="$1"
    local default="${2:-n}"
    local REPLY
    
    while true; do
        read -p "$prompt [y/N] " REPLY
        REPLY=${REPLY:-$default}
        case "$REPLY" in
            [Yy]*) return 0 ;;
            [Nn]*) return 1 ;;
            *) echo "Please answer yes or no." ;;
        esac
    done
}

# Function to validate domain name
validate_domain() {
    local domain=$1
    if [[ ! "$domain" =~ ^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$ ]]; then
        return 1
    fi
    return 0
}

# Function to validate port number
validate_port() {
    local port=$1
    if [[ ! "$port" =~ ^[0-9]+$ ]] || [ "$port" -lt 1 ] || [ "$port" -gt 65535 ]; then
        return 1
    fi
    return 0
}

# Function to validate IP address
validate_ip() {
    local ip=$1
    if [[ ! "$ip" =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
        return 1
    fi
    return 0
}

# Function to generate a secure random string
generate_secure_string() {
    local length=${1:-32}
    head -c 32 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c "$length"
}

# Function to configure base settings
configure_base() {
    log_section "Base Configuration"
    
    # Base paths
    local base_path="/opt/media-server"
    read -p "Enter base installation path [$base_path]: " input_path
    base_path=${input_path:-$base_path}
    
    # Create base.env
    cat > "$CONFIG_DIR/defaults/base.env" << EOL
# Core System Configuration
PUID=$(id -u)
PGID=$(id -g)
TZ=$(timedatectl | grep "Time zone" | awk '{print $3}')

# Base Storage Configuration
BASE_PATH=$base_path
MEDIA_PATH=\${BASE_PATH}/media
CONFIG_PATH=\${BASE_PATH}/config
DOWNLOADS_PATH=\${BASE_PATH}/downloads
LOGS_PATH=\${BASE_PATH}/logs

# Network Configuration
HOST_IP=$(hostname -I | awk '{print $1}')
DOMAIN=
BASE_URL=https://\${DOMAIN}

# Security Configuration
FORCE_SSL=true
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Monitoring Configuration
CHECK_INTERVAL=5
DISK_THRESHOLD=90
MEMORY_THRESHOLD=90
CPU_THRESHOLD=90
EOL
    
    log_info "Base configuration saved"
}

# Function to configure security settings
configure_security() {
    log_section "Security Configuration"
    
    if prompt_yes_no "Would you like to configure security services?"; then
        # Generate secure secrets
        local jwt_secret=$(generate_secure_string 64)
        local session_secret=$(generate_secure_string 64)
        local storage_key=$(generate_secure_string 64)
        
        # Create security-services.env
        cat > "$CONFIG_DIR/defaults/security-services.env" << EOL
# Authelia Configuration
AUTHELIA_JWT_SECRET=$jwt_secret
AUTHELIA_SESSION_SECRET=$session_secret
AUTHELIA_STORAGE_ENCRYPTION_KEY=$storage_key
AUTHELIA_REDIS_URL=redis://\${REDIS_HOST}:\${REDIS_PORT}
AUTHELIA_REDIS_PASSWORD=\${REDIS_PASSWORD}
AUTHELIA_SMTP_HOST=\${SMTP_HOST}
AUTHELIA_SMTP_PORT=\${SMTP_PORT}
AUTHELIA_SMTP_USERNAME=\${SMTP_USERNAME}
AUTHELIA_SMTP_PASSWORD=\${SMTP_PASSWORD}
AUTHELIA_SENDER_EMAIL=\${NOTIFICATION_EMAIL}
AUTHELIA_PORT=9091

# Fail2Ban Configuration
FAIL2BAN_DB_PATH=\${CONFIG_PATH}/fail2ban/db
FAIL2BAN_LOG_PATH=\${LOGS_PATH}
FAIL2BAN_JAIL_PATH=\${CONFIG_PATH}/fail2ban/jail.d
FAIL2BAN_FILTER_PATH=\${CONFIG_PATH}/fail2ban/filter.d
FAIL2BAN_ENABLED=true
FAIL2BAN_MAXRETRY=3
FAIL2BAN_FINDTIME=600
FAIL2BAN_BANTIME=3600

# NGINX Proxy Manager Configuration
NPM_PORT=81
NPM_HTTP_PORT=80
NPM_HTTPS_PORT=443
NPM_DB_MYSQL_HOST=localhost
NPM_DB_MYSQL_PORT=3306
NPM_DB_MYSQL_USER=npm
NPM_DB_MYSQL_PASSWORD=$(generate_secure_string 32)
NPM_DB_MYSQL_NAME=npm

# VNC Security Configuration
VNC_PORT=5900
VNC_PASSWORD=$(generate_secure_string 16)
VNC_FAIL2BAN_ENABLED=true
VNC_FAIL2BAN_MAXRETRY=3
VNC_FAIL2BAN_FINDTIME=600
VNC_FAIL2BAN_BANTIME=3600
EOL
        
        log_info "Security configuration saved"
    else
        log_warn "Security services will not be configured"
    fi
}

# Function to configure media services
configure_media() {
    log_section "Media Services Configuration"
    
    if prompt_yes_no "Would you like to configure media services?"; then
        # Create media-services.env
        cat > "$CONFIG_DIR/defaults/media-services.env" << EOL
# Plex Configuration
PLEX_CLAIM_TOKEN=
PLEX_TRANSCODE_PATH=\${BASE_PATH}/transcode
PLEX_MEDIA_PATH=\${MEDIA_PATH}

# Sonarr Configuration
SONARR_API_KEY=$(generate_secure_string 32)
SONARR_TV_PATH=\${MEDIA_PATH}/tv
SONARR_QUALITY_PROFILE=HD-1080p

# Radarr Configuration
RADARR_API_KEY=$(generate_secure_string 32)
RADARR_MOVIES_PATH=\${MEDIA_PATH}/movies
RADARR_QUALITY_PROFILE=HD-1080p

# Download Client Configuration
QB_DOWNLOADS_PATH=\${DOWNLOADS_PATH}/qbittorrent
QB_COMPLETED_PATH=\${DOWNLOADS_PATH}/completed
QB_WEBUI_PORT=8080

# Prowlarr Configuration
PROWLARR_API_KEY=$(generate_secure_string 32)
PROWLARR_PORT=9696
EOL
        
        log_info "Media services configuration saved"
    else
        log_warn "Media services will not be configured"
    fi
}

# Function to configure monitoring services
configure_monitoring() {
    log_section "Monitoring Configuration"
    
    if prompt_yes_no "Would you like to configure monitoring services?"; then
        # Create monitoring-services.env
        cat > "$CONFIG_DIR/defaults/monitoring-services.env" << EOL
# Prometheus Configuration
PROMETHEUS_PORT=9090
PROMETHEUS_RETENTION_TIME=15d
PROMETHEUS_STORAGE_PATH=\${CONFIG_PATH}/prometheus/data
PROMETHEUS_CONFIG_PATH=\${CONFIG_PATH}/prometheus/config
PROMETHEUS_SCRAPE_INTERVAL=15s
PROMETHEUS_EVALUATION_INTERVAL=15s

# Grafana Configuration
GRAFANA_PORT=3000
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=$(generate_secure_string 32)
GRAFANA_STORAGE_PATH=\${CONFIG_PATH}/grafana
GRAFANA_PLUGINS_PATH=\${CONFIG_PATH}/grafana/plugins
GRAFANA_PROVISIONING_PATH=\${CONFIG_PATH}/grafana/provisioning
GRAFANA_ALLOW_EMBEDDING=true
GRAFANA_SERVE_FROM_SUB_PATH=true

# System Metrics Collection
METRIC_COLLECTION_INTERVAL=\${CHECK_INTERVAL}
DISK_USAGE_WARNING=\${DISK_THRESHOLD}
MEMORY_USAGE_WARNING=\${MEMORY_THRESHOLD}
CPU_USAGE_WARNING=\${CPU_THRESHOLD}
METRIC_RETENTION_DAYS=30
EOL
        
        log_info "Monitoring configuration saved"
    else
        log_warn "Monitoring services will not be configured"
    fi
}

# Function to validate configurations
validate_configs() {
    log_section "Validating Configurations"
    
    # Validate base configuration
    if [ ! -f "$CONFIG_DIR/defaults/base.env" ]; then
        log_error "Base configuration is missing"
        return 1
    fi
    
    # Check required directories
    source "$CONFIG_DIR/defaults/base.env"
    for dir in "$MEDIA_PATH" "$CONFIG_PATH" "$DOWNLOADS_PATH" "$LOGS_PATH"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            log_info "Created directory: $dir"
        fi
    done
    
    log_info "Configuration validation complete"
}

# Main function
main() {
    log_info "Starting configuration process..."
    
    # Create configuration directories if they don't exist
    mkdir -p "$CONFIG_DIR/defaults"
    
    # Configure each section
    configure_base
    configure_security
    configure_media
    configure_monitoring
    
    # Validate configurations
    validate_configs
    
    log_section "Configuration Complete"
    log_info "All configurations have been saved to $CONFIG_DIR/defaults/"
    echo
    log_info "Next steps:"
    echo "1. Review configuration files in $CONFIG_DIR/defaults/"
    echo "2. Run setup_media_server.sh to apply configuration"
    echo "3. Use post_install_check.sh to verify installation"
}

# Run main function
main "$@"

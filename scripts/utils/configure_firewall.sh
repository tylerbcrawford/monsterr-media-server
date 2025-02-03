#!/bin/bash
set -euo pipefail

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

log_section "Configuring UFW Firewall"

# Load environment variables
if [ -f "./config.env" ]; then
    export $(grep -v '^#' config.env | xargs)
    log_info "Loaded configuration from config.env"
else
    log_error "config.env file not found. Please create it before running this script."
    exit 1
fi

# Check if UFW is enabled in config
if [ "${ENABLE_UFW:-false}" != "true" ]; then
    log_error "UFW is not enabled in config.env. Skipping firewall configuration."
    exit 0
fi

# Set default SSH port if not specified
SSH_PORT="${SSH_PORT:-22}"

log_info "Configuring required ports..."

# Allow SSH on custom port if configured
if [ "$SSH_PORT" != "22" ]; then
    log_info "Using custom SSH port: $SSH_PORT"
    ufw allow "$SSH_PORT/tcp" comment 'SSH custom port'
else
    log_info "Using default SSH port: 22"
    ufw allow ssh
fi

# Allow HTTP/HTTPS
log_info "Allowing HTTP (80) and HTTPS (443)"
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# Allow NPM admin interface
log_info "Allowing Nginx Proxy Manager admin interface (81)"
ufw allow 81/tcp comment 'NPM Admin'

# Enable UFW
log_info "Enabling UFW..."
ufw --force enable

log_section "Firewall Configuration Complete"
log_info "Allowed ports:"
ufw status numbered | grep -E "^\\[[0-9]+\\]" || true

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

# Main setup script for the media server
log_section "Starting Media Server Setup"

# Load environment variables
if [ -f ./config.env ]; then
    export $(grep -v '^#' config.env | xargs)
    log_info "Loaded configuration from config.env"
else
    log_error "config.env file not found. Please create it before running this script."
    exit 1
fi

# Create necessary directories
log_section "Creating Directories"
./scripts/create_directories.sh

# Configure the firewall if enabled
if [ "${ENABLE_UFW:-false}" == "true" ]; then
    log_section "Configuring Firewall"
    ./scripts/configure_firewall.sh
else
    log_warn "UFW is disabled. Skipping firewall configuration."
    log_warn "Make sure you have alternative security measures in place!"
fi

# Generate the Docker Compose file
log_section "Generating Docker Compose Configuration"
./scripts/generate_docker_compose.sh

# Set up backups
log_section "Configuring Backup System"
./scripts/setup_backups.sh

# Install and configure Fail2Ban if enabled
if [ "${ENABLE_FAIL2BAN:-false}" == "true" ]; then
    log_section "Setting up Fail2Ban"
    ./scripts/install_fail2ban.sh
else
    log_warn "Fail2Ban is disabled. Skipping installation."
    log_warn "Your server may be vulnerable to brute force attacks!"
fi

# Set up monitoring
log_section "Configuring Monitoring"
./scripts/setup_monitoring.sh

# Configure Nginx Proxy Manager
log_section "Configuring Nginx Proxy Manager"
./scripts/configure_nginx_proxy_manager.sh

# Set up Authelia
log_section "Configuring Authelia"
./scripts/setup_authelia.sh

# Launch all services
log_section "Launching Services"
./scripts/launch_services.sh

log_section "Setup Complete!"
log_info "Your media server has been configured and launched."
log_info "Next steps:"
echo "1. Access Nginx Proxy Manager at http://<SERVER_IP>:81"
echo "2. Configure your service subdomains"
echo "3. Set up SSL certificates"
echo "4. Configure your media libraries"
echo
log_info "For more information, see the documentation:"
echo "- Security Configuration: docs/security.md"
echo "- Service Configuration: docs/services.md"
echo "- Backup Configuration: docs/backup.md"
echo "- Monitoring Setup: docs/monitoring.md"

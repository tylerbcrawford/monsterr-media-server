#!/bin/bash

# Main setup script for the media server

# Load environment variables
if [ -f ./config.env ]; then
    export $(grep -v '^#' config.env | xargs)
else
    echo "config.env file not found. Please create it before running this script."
    exit 1
fi

# Create necessary directories
./scripts/create_directories.sh

# Configure the firewall
./scripts/configure_firewall.sh

# Generate the Docker Compose file
./scripts/generate_docker_compose.sh

# Set up backups
./scripts/setup_backups.sh

# Install Fail2Ban
./scripts/install_fail2ban.sh

# Set up monitoring
./scripts/setup_monitoring.sh

# Set up Dynamic DNS (if required)
# Uncomment the line below if using DDNS
# ./scripts/setup_ddns_dynu.sh

# Configure Nginx Proxy Manager
./scripts/configure_nginx_proxy_manager.sh

# Set up Authelia
./scripts/setup_authelia.sh

# Launch all services
./scripts/launch_services.sh

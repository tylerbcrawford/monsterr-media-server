#!/bin/bash

# Media Server Installation Script

# Make sure we're running as root
if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root. Try 'sudo ./install_media_server.sh'"
   exit 1
fi

# Update and install required packages
./scripts/install_dependencies.sh

# Install Docker and Docker Compose
./scripts/install_docker.sh

# Run the setup wizard
./setup_wizard.sh

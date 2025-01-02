#!/bin/bash
set -euo pipefail

echo "Configuring UFW Firewall"
echo "----------------------"

# Load environment variables
if [ -f "./config.env" ]; then
    export $(grep -v '^#' config.env | xargs)
fi

# Set default SSH port if not specified
SSH_PORT="${SSH_PORT:-22}"

# Configure UFW
echo "Allowing required ports..."

# Allow SSH on custom port if configured
if [ "$SSH_PORT" != "22" ]; then
    echo "Using custom SSH port: $SSH_PORT"
    ufw allow "$SSH_PORT/tcp" comment 'SSH custom port'
else
    echo "Using default SSH port: 22"
    ufw allow ssh
fi

# Allow HTTP/HTTPS
echo "Allowing HTTP (80) and HTTPS (443)"
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# Allow NPM admin interface
echo "Allowing Nginx Proxy Manager admin interface (81)"
ufw allow 81/tcp comment 'NPM Admin'

# Enable UFW
echo "Enabling UFW..."
ufw --force enable

echo "Firewall configuration complete!"
echo "Allowed ports:"
ufw status numbered | grep -E "^\\[[0-9]+\\]" || true

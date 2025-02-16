#!/bin/bash

# Nginx Proxy Manager Configuration Script
# This script generates the Nginx Proxy Manager configuration based on domain settings

set -e

# Source error handler
source "$(dirname "$0")/error_handler.sh"

# Configuration template path
TEMPLATE_PATH="../config/templates/nginx-proxy-config.template.json"
CONFIG_DIR="/etc/nginx-proxy-manager"
TEMP_CONFIG="/tmp/npm-config.json"

# Function to display usage information
usage() {
    echo "Usage: $0 -d domain -e email [-p port] [-c cert_id]"
    echo
    echo "Options:"
    echo "  -d    Domain name"
    echo "  -e    SSL certificate email"
    echo "  -p    Forward port (default: 80)"
    echo "  -c    Certificate ID (optional)"
    exit 1
}

# Parse command line arguments
while getopts "d:e:p:c:h" opt; do
    case $opt in
        d) DOMAIN="$OPTARG" ;;
        e) SSL_EMAIL="$OPTARG" ;;
        p) PORT="$OPTARG" ;;
        c) CERT_ID="$OPTARG" ;;
        h) usage ;;
        ?) usage ;;
    esac
done

# Validate required parameters
if [ -z "$DOMAIN" ] || [ -z "$SSL_EMAIL" ]; then
    echo "Error: Domain and SSL email are required"
    usage
fi

# Set default values
PORT=${PORT:-80}
CERT_ID=${CERT_ID:-0}

# Function to replace template variables
replace_template_vars() {
    local template="$1"
    local output="$2"
    
    sed -e "s/{{ domain }}/$DOMAIN/g" \
        -e "s/{{ ssl_email }}/$SSL_EMAIL/g" \
        -e "s/{{ port }}/$PORT/g" \
        -e "s/{{ cert_id }}/$CERT_ID/g" \
        "$template" > "$output"
}

# Function to validate JSON configuration
validate_json() {
    local config_file="$1"
    if ! jq empty "$config_file" 2>/dev/null; then
        error_exit "Invalid JSON configuration generated"
    fi
}

# Main configuration function
configure_npm() {
    echo "Configuring Nginx Proxy Manager for domain: $DOMAIN"
    
    # Create config directory if it doesn't exist
    mkdir -p "$CONFIG_DIR"
    
    # Generate configuration from template
    if [ ! -f "$TEMPLATE_PATH" ]; then
        error_exit "Configuration template not found: $TEMPLATE_PATH"
    fi
    
    # Replace template variables
    replace_template_vars "$TEMPLATE_PATH" "$TEMP_CONFIG"
    
    # Validate generated configuration
    validate_json "$TEMP_CONFIG"
    
    # Move configuration to final location
    mv "$TEMP_CONFIG" "$CONFIG_DIR/config.json"
    
    echo "Configuration completed successfully"
    echo "Domain: $DOMAIN"
    echo "SSL Email: $SSL_EMAIL"
    echo "Forward Port: $PORT"
    echo "Certificate ID: $CERT_ID"
}

# Execute configuration
configure_npm

exit 0

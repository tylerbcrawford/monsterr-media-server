#!/bin/bash

# Interactive Setup Wizard

echo "Welcome to the Media Server Setup Wizard"

read -p "Do you want to proceed with the web-based configuration interface? (y/n): " web_interface

if [[ "$web_interface" == "y" || "$web_interface" == "Y" ]]; then
    echo "Starting the web-based configuration interface..."
    # Start a temporary web server for configuration
    # Assuming Python 3 is installed
    cd web_config_interface
    python3 -m http.server 8080
else
    echo "Proceeding with the command-line setup wizard..."
    ./scripts/collect_variables.sh
    ./setup_media_server.sh
fi

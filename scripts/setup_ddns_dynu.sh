#!/bin/bash
set -euo pipefail

# Function to validate input is not empty
validate_input() {
    local input=$1
    local prompt=$2
    while [ -z "$input" ]; do
        read -p "$prompt" input
    done
    echo "$input"
}

echo "Dynu DDNS Configuration"
echo "----------------------"
echo "This script will help you set up Dynu Dynamic DNS for your media server."
echo "Please ensure you have already:"
echo "1. Created a Dynu account at https://www.dynu.com"
echo "2. Created a dynamic DNS hostname"
echo "3. Retrieved your API credentials"
echo

# Collect Dynu credentials
read -p "Enter your Dynu hostname (e.g., myhome.dynu.net): " DYNU_HOSTNAME
DYNU_HOSTNAME=$(validate_input "$DYNU_HOSTNAME" "Hostname cannot be empty. Please enter your Dynu hostname: ")

read -p "Enter your Dynu API key: " DYNU_API_KEY
DYNU_API_KEY=$(validate_input "$DYNU_API_KEY" "API key cannot be empty. Please enter your Dynu API key: ")

# Create Dynu update script
cat <<EOL > /opt/media-server/dynu/update_ip.sh
#!/bin/bash

# Dynu API credentials
HOSTNAME="$DYNU_HOSTNAME"
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

# Make the update script executable
chmod +x /opt/media-server/dynu/update_ip.sh

# Create systemd service for automatic updates
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

# Create systemd timer for periodic updates
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

# Update config.env with the Dynu hostname
if [ -f "./config.env" ]; then
    # Check if DOMAIN is already set
    if grep -q "^DOMAIN=" "./config.env"; then
        # Replace existing DOMAIN line
        sed -i "s/^DOMAIN=.*/DOMAIN=\"$DYNU_HOSTNAME\"/" "./config.env"
    else
        # Add DOMAIN if it doesn't exist
        echo "DOMAIN=\"$DYNU_HOSTNAME\"" >> "./config.env"
    fi
fi

echo
echo "Dynu DDNS setup complete!"
echo "Your domain $DYNU_HOSTNAME will be automatically updated every 5 minutes."
echo "The update script is located at /opt/media-server/dynu/update_ip.sh"
echo
echo "Next steps:"
echo "1. Wait a few minutes for the first IP update"
echo "2. Test your domain by visiting http://$DYNU_HOSTNAME"
echo "3. Configure your services in Nginx Proxy Manager using subdomains of $DYNU_HOSTNAME"

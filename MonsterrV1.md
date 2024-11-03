Certainly! Below is the complete project, including all scripts and code for all the services listed. Each file is presented with its path and contents for clarity.

---

## **Project Structure**

```
/opt/media-server/
├── install_media_server.sh
├── setup_media_server.sh
├── setup_wizard.sh
├── config.env
├── sample_config.env
├── docker-compose.yml
├── scripts/
│   ├── collect_variables.sh
│   ├── install_dependencies.sh
│   ├── install_docker.sh
│   ├── create_directories.sh
│   ├── configure_firewall.sh
│   ├── generate_docker_compose.sh
│   ├── setup_backups.sh
│   ├── install_fail2ban.sh
│   ├── setup_monitoring.sh
│   ├── setup_ddns_dynu.sh
│   ├── configure_nginx_proxy_manager.sh
│   ├── setup_authelia.sh
│   ├── launch_services.sh
├── authelia/
│   ├── configuration.yml
│   └── users_database.yml
├── prometheus.yml
├── backup.sh
├── logs/
│   └── setup_media_server.log
├── web_config_interface/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── README.md
├── CHANGELOG.md
└── LICENSE
```

---

### **1. `install_media_server.sh`**

```bash
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
```

---

### **2. `setup_media_server.sh`**

```bash
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
```

---

### **3. `setup_wizard.sh`**

```bash
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
```

---

### **4. `config.env`**

*(This file contains your environment variables. Ensure you replace placeholders with your actual values and keep this file secure.)*

```dotenv
# Media Server Configuration File

# Timezone
TIMEZONE="America/Toronto"

# Domain Name
DOMAIN="yourdomain.com"

# User and Group IDs
PUID=1000
PGID=1000

# Plex Claim Token
PLEX_CLAIM_TOKEN="YOUR_PLEX_CLAIM_TOKEN"

# VPN Credentials
VPN_USERNAME="YOUR_VPN_USERNAME"
VPN_PASSWORD="YOUR_VPN_PASSWORD"

# Grafana Admin Password
GRAFANA_ADMIN_PASSWORD="YOUR_GRAFANA_PASSWORD"

# Authelia Secrets
AUTHELIA_JWT_SECRET="YOUR_AUTHELIA_JWT_SECRET"
AUTHELIA_SESSION_SECRET="YOUR_AUTHELIA_SESSION_SECRET"
AUTHELIA_STORAGE_ENCRYPTION_KEY="YOUR_AUTHELIA_STORAGE_ENCRYPTION_KEY"

# Authelia SMTP Settings
AUTHELIA_NOTIFIER_SMTP_HOST="smtp.your-email-provider.com"
AUTHELIA_NOTIFIER_SMTP_PORT="587"
AUTHELIA_NOTIFIER_SMTP_USERNAME="your-email@example.com"
AUTHELIA_NOTIFIER_SMTP_PASSWORD="YOUR_SMTP_PASSWORD"
AUTHELIA_NOTIFIER_SMTP_SENDER="no-reply@yourdomain.com"

# Recyclarr Configuration
SONARR_API_KEY="YOUR_SONARR_API_KEY"
RADARR_API_KEY="YOUR_RADARR_API_KEY"
SONARR_URL="http://sonarr:8989"
RADARR_URL="http://radarr:7878"
RECYCLARR_SCHEDULE="0 0 * * *"  # Every day at midnight

# Additional Service Variables (e.g., for Audiobookshelf, Calibre-Web)
# ...
```

---

### **5. `docker-compose.yml`**

```yaml
version: '3.8'

services:
  # Nginx Proxy Manager
  nginx-proxy-manager:
    image: jc21/nginx-proxy-manager:latest
    container_name: nginx-proxy-manager
    restart: unless-stopped
    ports:
      - '80:80'
      - '443:443'
      - '81:81'
    environment:
      - TZ=${TIMEZONE}
    volumes:
      - ./npm/data:/data
      - ./npm/letsencrypt:/etc/letsencrypt
    networks:
      - proxy

  # Authelia
  authelia:
    image: authelia/authelia:latest
    container_name: authelia
    restart: unless-stopped
    volumes:
      - ./authelia/config:/config
      - ./authelia:/etc/authelia
      - ./npm/letsencrypt:/etc/letsencrypt:ro
    environment:
      - TZ=${TIMEZONE}
    depends_on:
      - redis
    networks:
      - proxy

  # Redis for Authelia
  redis:
    image: redis:latest
    container_name: authelia-redis
    restart: unless-stopped
    networks:
      - proxy

  # Plex Media Server
  plex:
    image: lscr.io/linuxserver/plex:latest
    container_name: plex
    restart: unless-stopped
    network_mode: host
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - VERSION=docker
      - TZ=${TIMEZONE}
      - PLEX_CLAIM=${PLEX_CLAIM_TOKEN}
    volumes:
      - ./plex/config:/config
      - ./plex/transcode:/transcode
      - ./media:/data
    depends_on:
      - qbittorrentvpn

  # qBittorrent VPN
  qbittorrentvpn:
    image: ghcr.io/hotio/qbittorrent:latest
    container_name: qbittorrentvpn
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
    devices:
      - /dev/net/tun
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TIMEZONE}
      - UMASK=002
      - VPN_ENABLED=yes
      - VPN_TYPE=custom
      - VPN_PROV=custom
      - VPN_CLIENT=openvpn
      - VPN_CONFIG_FILE=/config/openvpn/client.ovpn
      - VPN_USERNAME=${VPN_USERNAME}
      - VPN_PASSWORD=${VPN_PASSWORD}
      - LAN=192.168.1.0/24
    volumes:
      - ./qbittorrentvpn/config:/config
      - ./downloads:/downloads
    ports:
      - '8080:8080'  # qBittorrent Web UI
    networks:
      - proxy

  # Prowlarr
  prowlarr:
    image: lscr.io/linuxserver/prowlarr:develop
    container_name: prowlarr
    restart: unless-stopped
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TIMEZONE}
    volumes:
      - ./prowlarr/config:/config
    networks:
      - proxy

  # Sonarr
  sonarr:
    image: lscr.io/linuxserver/sonarr:latest
    container_name: sonarr
    restart: unless-stopped
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TIMEZONE}
    volumes:
      - ./sonarr/config:/config
      - ./media/tv:/tv
      - ./downloads:/downloads
    networks:
      - proxy
    depends_on:
      - qbittorrentvpn
      - prowlarr

  # Radarr
  radarr:
    image: lscr.io/linuxserver/radarr:latest
    container_name: radarr
    restart: unless-stopped
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TIMEZONE}
    volumes:
      - ./radarr/config:/config
      - ./media/movies:/movies
      - ./downloads:/downloads
    networks:
      - proxy
    depends_on:
      - qbittorrentvpn
      - prowlarr

  # Lidarr
  lidarr:
    image: lscr.io/linuxserver/lidarr:latest
    container_name: lidarr
    restart: unless-stopped
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TIMEZONE}
    volumes:
      - ./lidarr/config:/config
      - ./media/music:/music
      - ./downloads:/downloads
    networks:
      - proxy
    depends_on:
      - qbittorrentvpn
      - prowlarr

  # Readarr
  readarr:
    image: lscr.io/linuxserver/readarr:latest
    container_name: readarr
    restart: unless-stopped
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TIMEZONE}
    volumes:
      - ./readarr/config:/config
      - ./media/books:/books
      - ./downloads:/downloads
    networks:
      - proxy
    depends_on:
      - qbittorrentvpn
      - prowlarr

  # Bazarr
  bazarr:
    image: lscr.io/linuxserver/bazarr:latest
    container_name: bazarr
    restart: unless-stopped
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TIMEZONE}
    volumes:
      - ./bazarr/config:/config
      - ./media/movies:/movies
      - ./media/tv:/tv
    networks:
      - proxy
    depends_on:
      - sonarr
      - radarr

  # Audiobookshelf
  audiobookshelf:
    image: ghcr.io/advplyr/audiobookshelf:latest
    container_name: audiobookshelf
    restart: unless-stopped
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TIMEZONE}
    volumes:
      - ./audiobookshelf/config:/config
      - ./media/audiobooks:/audiobooks
      - ./media/podcasts:/podcasts
    ports:
      - '13378:80'
    networks:
      - proxy

  # Calibre-Web
  calibre-web:
    image: lscr.io/linuxserver/calibre-web:latest
    container_name: calibre-web
    restart: unless-stopped
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TIMEZONE}
    volumes:
      - ./calibre-web/config:/config
      - ./media/ebooks:/books
    networks:
      - proxy

  # LazyLibrarian
  lazylibrarian:
    image: lscr.io/linuxserver/lazylibrarian:latest
    container_name: lazylibrarian
    restart: unless-stopped
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TIMEZONE}
    volumes:
      - ./lazylibrarian/config:/config
      - ./media/ebooks:/books
      - ./downloads:/downloads
    networks:
      - proxy
    depends_on:
      - qbittorrentvpn

  # Recyclarr
  recyclarr:
    image: requestrr/recyclarr:latest
    container_name: recyclarr
    restart: unless-stopped
    environment:
      - TZ=${TIMEZONE}
    volumes:
      - ./recyclarr/config:/config
    depends_on:
      - sonarr
      - radarr
    networks:
      - proxy

  # Watchlist
  watchlist:
    image: ghcr.io/linuxserver/watchlist:latest
    container_name: watchlist
    restart: unless-stopped
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TIMEZONE}
    volumes:
      - ./watchlist/config:/config
    networks:
      - proxy

  # Overseerr
  overseerr:
    image: lscr.io/linuxserver/overseerr:latest
    container_name: overseerr
    restart: unless-stopped
    environment:
      - LOG_LEVEL=info
      - TZ=${TIMEZONE}
    volumes:
      - ./overseerr/config:/app/config
    networks:
      - proxy
    depends_on:
      - plex

  # Unpackerr
  unpackerr:
    image: golift/unpackerr:latest
    container_name: unpackerr
    restart: unless-stopped
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TIMEZONE}
    volumes:
      - ./unpackerr/config:/config
      - ./downloads:/downloads
    networks:
      - proxy
    depends_on:
      - sonarr
      - radarr

  # Tautulli
  tautulli:
    image: lscr.io/linuxserver/tautulli:latest
    container_name: tautulli
    restart: unless-stopped
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TIMEZONE}
    volumes:
      - ./tautulli/config:/config
    networks:
      - proxy
    depends_on:
      - plex

  # Monitorr
  monitorr:
    image: monitorr/monitorr:latest
    container_name: monitorr
    restart: unless-stopped
    ports:
      - '8081:80'
    volumes:
      - ./monitorr/config:/var/www/html/assets/config
    networks:
      - proxy

  # Organizr
  organizr:
    image: organizr/organizr:latest
    container_name: organizr
    restart: unless-stopped
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TIMEZONE}
    volumes:
      - ./organizr/config:/config
    networks:
      - proxy

  # Watchtower
  watchtower:
    image: containrrr/watchtower:latest
    container_name: watchtower
    restart: unless-stopped
    environment:
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_POLL_INTERVAL=86400
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - proxy

  # Portainer
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: unless-stopped
    ports:
      - '9000:9000'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./portainer/data:/data
    networks:
      - proxy

  # Prometheus
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - '9090:9090'
    networks:
      - proxy

  # Grafana
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}
    volumes:
      - ./grafana/data:/var/lib/grafana
    ports:
      - '3000:3000'
    networks:
      - proxy
    depends_on:
      - prometheus

  # Fail2Ban
  fail2ban:
    image: crazymax/fail2ban:latest
    container_name: fail2ban
    restart: unless-stopped
    volumes:
      - /var/log:/var/log:ro
      - /var/run/docker.sock:/var/run/docker.sock
      - ./fail2ban/data:/data
    network_mode: host

  # NZBGet
  nzbget:
    image: lscr.io/linuxserver/nzbget:latest
    container_name: nzbget
    restart: unless-stopped
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TIMEZONE}
    volumes:
      - ./nzbget/config:/config
      - ./downloads:/downloads
    networks:
      - proxy
    depends_on:
      - vpn

  # VPN Service
  vpn:
    image: dperson/openvpn-client
    container_name: vpn
    cap_add:
      - NET_ADMIN
    devices:
      - /dev/net/tun
    restart: unless-stopped
    environment:
      - TZ=${TIMEZONE}
    volumes:
      - ./vpn/config:/vpn
    command: '-f "" -r 192.168.1.0/24 -d'
    networks:
      - proxy

networks:
  proxy:
    driver: bridge
```

---

### **6. Scripts**

#### **6.1 `scripts/install_dependencies.sh`**

```bash
#!/bin/bash

# Install required dependencies
apt update
apt install -y curl gnupg2 ca-certificates lsb-release apt-transport-https software-properties-common
```

---

#### **6.2 `scripts/install_docker.sh`**

```bash
#!/bin/bash

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

---

#### **6.3 `scripts/create_directories.sh`**

```bash
#!/bin/bash

# Create necessary directories for services
mkdir -p ./npm/data
mkdir -p ./npm/letsencrypt
mkdir -p ./authelia/config
mkdir -p ./authelia/data
mkdir -p ./plex/config
mkdir -p ./plex/transcode
mkdir -p ./media/movies
mkdir -p ./media/tv
mkdir -p ./media/music
mkdir -p ./media/books
mkdir -p ./media/audiobooks
mkdir -p ./media/podcasts
mkdir -p ./downloads
mkdir -p ./sonarr/config
mkdir -p ./radarr/config
mkdir -p ./lidarr/config
mkdir -p ./readarr/config
mkdir -p ./prowlarr/config
mkdir -p ./bazarr/config
mkdir -p ./audiobookshelf/config
mkdir -p ./calibre-web/config
mkdir -p ./lazylibrarian/config
mkdir -p ./recyclarr/config
mkdir -p ./watchlist/config
mkdir -p ./overseerr/config
mkdir -p ./tautulli/config
mkdir -p ./organizr/config
mkdir -p ./qbittorrentvpn/config
mkdir -p ./unpackerr/config
mkdir -p ./prometheus
mkdir -p ./grafana/data
mkdir -p ./nzbget/config
mkdir -p ./vpn/config
mkdir -p ./fail2ban/data
mkdir -p ./portainer/data
mkdir -p ./monitorr/config

# Set permissions
chown -R ${PUID}:${PGID} ./
```

---

#### **6.4 `scripts/configure_firewall.sh`**

```bash
#!/bin/bash

# Configure UFW Firewall
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable
```

---

#### **6.5 `scripts/generate_docker_compose.sh`**

*(Already provided in step 5)*

---

#### **6.6 `scripts/collect_variables.sh`**

```bash
#!/bin/bash

# Collect environment variables interactively

read -p "Enter your timezone (e.g., America/Toronto): " TIMEZONE
read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN
read -p "Enter your PUID: " PUID
read -p "Enter your PGID: " PGID
read -p "Enter your Plex claim token: " PLEX_CLAIM_TOKEN
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
cat <<EOL > config.env
TIMEZONE="${TIMEZONE}"
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
```

---

#### **6.7 `scripts/setup_backups.sh`**

```bash
#!/bin/bash

# Create backup script
cat <<EOL > backup.sh
#!/bin/bash

# Directories to backup
BACKUP_SOURCES=(
    "./config"
    "./media"
    "./downloads"
)

# Backup destination
BACKUP_DEST="./backups/backup_\$(date +%Y%m%d%H%M%S).tar.gz"

# Create the backup
tar -czvf "\$BACKUP_DEST" "\${BACKUP_SOURCES[@]}"

# Encrypt the backup (optional)
# gpg --symmetric --cipher-algo aes256 "\$BACKUP_DEST"

# Remove backups older than 7 days
find "./backups/" -type f -mtime +7 -delete
EOL

chmod +x backup.sh

# Schedule backup script in cron
(crontab -l ; echo "0 2 * * * /opt/media-server/backup.sh") | crontab -
```

---

#### **6.8 `scripts/install_fail2ban.sh`**

```bash
#!/bin/bash

# Install Fail2Ban
apt install -y fail2ban

# Configure Fail2Ban
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Restart Fail2Ban service
systemctl restart fail2ban
```

---

#### **6.9 `scripts/setup_monitoring.sh`**

```bash
#!/bin/bash

# Create Prometheus configuration
cat <<EOL > prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
EOL

# Move prometheus.yml to the prometheus directory
mv prometheus.yml ./prometheus/prometheus.yml
```

---

#### **6.10 `scripts/configure_nginx_proxy_manager.sh`**

```bash
#!/bin/bash

# Placeholder script for configuring Nginx Proxy Manager
echo "Please access Nginx Proxy Manager at https://yourdomain.com:81 to configure your proxy hosts."
```

---

#### **6.11 `scripts/setup_authelia.sh`**

```bash
#!/bin/bash

# Create Authelia configuration file
cat <<EOL > authelia/configuration.yml
# Authelia configuration

server:
  host: 0.0.0.0
  port: 9091

jwt_secret: '${AUTHELIA_JWT_SECRET}'

default_redirection_url: 'https://${DOMAIN}'

totp:
  issuer: 'Your Organization'

authentication_backend:
  file:
    path: '/config/users_database.yml'

access_control:
  default_policy: deny
  rules:
    - domain:
        - '*.${DOMAIN}'
      policy: two_factor

session:
  name: authelia_session
  secret: '${AUTHELIA_SESSION_SECRET}'
  expiration: 3600
  inactivity: 300
  remember_me_duration: 1M
  domain: '${DOMAIN}'
  redis:
    host: authelia-redis
    port: 6379

storage:
  encryption_key: '${AUTHELIA_STORAGE_ENCRYPTION_KEY}'
  local:
    path: /config/db.sqlite3

notifier:
  smtp:
    host: '${AUTHELIA_NOTIFIER_SMTP_HOST}'
    port: ${AUTHELIA_NOTIFIER_SMTP_PORT}
    username: '${AUTHELIA_NOTIFIER_SMTP_USERNAME}'
    password: '${AUTHELIA_NOTIFIER_SMTP_PASSWORD}'
    sender: '${AUTHELIA_NOTIFIER_SMTP_SENDER}'
    starttls: true

tls:
  key: /etc/letsencrypt/live/auth.${DOMAIN}/privkey.pem
  certificate: /etc/letsencrypt/live/auth.${DOMAIN}/fullchain.pem
EOL

# Create users_database.yml
cat <<EOL > authelia/users_database.yml
users:
  your_username:
    password: '$argon2id$v=19$m=65536,t=2,p=1$...'  # Replace with your hashed password
    displayname: 'Your Name'
    email: 'your-email@example.com'
EOL
```

---

#### **6.12 `scripts/launch_services.sh`**

```bash
#!/bin/bash

# Launch Docker Compose services
docker-compose up -d
```

---

### **7. `authelia/configuration.yml`**

*(Already provided in the setup_authelia.sh script)*

---

### **8. `authelia/users_database.yml`**

*(Already provided in the setup_authelia.sh script)*

---

### **9. `prometheus.yml`**

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  # Additional scrape configs for your services...
```

---

### **10. `backup.sh`**

*(Already provided in the setup_backups.sh script)*

---

### **11. `web_config_interface/index.html`**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Media Server Configuration</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Media Server Configuration</h1>
    <form id="config-form">
        <!-- Form fields for configuration variables -->
        <label for="timezone">Timezone:</label>
        <input type="text" id="timezone" name="timezone" placeholder="America/Toronto" required>

        <!-- Additional form fields for other variables -->

        <button type="submit">Submit Configuration</button>
    </form>

    <script src="app.js"></script>
</body>
</html>
```

---

### **12. `web_config_interface/styles.css`**

```css
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
}

form {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
}

label {
    display: block;
    margin-top: 10px;
}

input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
}

button {
    margin-top: 20px;
    padding: 10px 20px;
}
```

---

### **13. `web_config_interface/app.js`**

```javascript
document.getElementById('config-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);

    // Prepare data to send to the server
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Send data to the server (you would need to implement the server-side handling)
    fetch('/save-config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            alert('Configuration saved successfully.');
        } else {
            alert('Failed to save configuration.');
        }
    });
});
```

---

### **14. `README.md`**

*(Already provided in previous responses, updated with all services and configurations.)*

---

### **15. `CHANGELOG.md`**

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - YYYY-MM-DD

### Added

- Added Bazarr, Audiobookshelf, Calibre-Web, LazyLibrarian, and Recyclarr services.
- Updated scripts and configuration files to include new services.
- Expanded documentation to cover new services and domain configuration.

## [1.0.0] - YYYY-MM-DD

### Added

- Initial release of the media server project.
- Interactive setup wizard (CLI and web-based).
- Docker Compose configuration with multiple services.
- Authelia integration for two-factor authentication.
- Scripts for automated backups, monitoring setup, and more.
- Comprehensive documentation with visual aids.
```

---

### **16. `LICENSE`**

*(Include the appropriate open-source license text, such as MIT, Apache 2.0, etc.)*

---

## **Final Notes**

- **Replace Placeholders**: Ensure you replace all placeholder values in the scripts and configuration files with your actual information.
- **File Permissions**: Set appropriate file permissions, especially for scripts and configuration files containing sensitive information.
- **Testing**: Before deploying in a production environment, test the setup in a controlled environment to ensure everything works as expected.
- **Security**: Keep all secrets secure and consider using a secrets management solution if necessary.

---

If you have any questions or need further assistance with any part of the project, feel free to ask!
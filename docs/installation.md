# Installation Guide

This guide provides detailed instructions for installing and configuring the Monsterr Media Server.

## Table of Contents
- [System Requirements](#system-requirements)
- [Pre-installation Steps](#pre-installation-steps)
- [Installation Methods](#installation-methods)
- [Post-installation Setup](#post-installation-setup)
- [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Hardware Requirements
- CPU: 4 cores
- RAM: 8GB
- Storage: 20GB for base installation
- Additional storage for media files

### Recommended Hardware
- CPU: 6+ cores
- RAM: 16GB+
- Storage: 
  - SSD for system: 100GB+
  - HDD for media: 4TB+
- Network: Gigabit Ethernet

### Software Requirements
- Operating System: Ubuntu 20.04+ or similar Linux distribution
- Docker Engine
- Docker Compose
- Git (for installation)

## Pre-installation Steps

1. **Update System**
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

2. **Check System Resources**
   ```bash
   # Check CPU and Memory
   lscpu
   free -h
   
   # Check Storage
   df -h
   ```

3. **Configure Network and Domain**

   a. Network Setup
   - Set static IP (recommended) or configure DDNS for dynamic IP
   - Configure port forwarding for ports 80, 443, and 81
   - Ensure your router allows these ports through the firewall

   b. Domain Setup
   1. Static IP Setup:
      - Log in to your domain registrar (e.g., Namecheap, Cloudflare)
      - Create an A record pointing your domain to your server's IP
      - Create CNAME records for subdomains (or a wildcard *.domain.com)
      - In config.env, set DOMAIN="yourdomain.com"

   2. Dynamic IP Setup (DDNS):
      - Sign up at a DDNS provider (e.g., Dynu, DuckDNS)
      - Obtain a hostname (e.g., myhome.dynu.net)
      - Run our DDNS setup script:
        ```bash
        sudo ./scripts/setup_ddns_dynu.sh
        ```
      - The script will:
        * Configure automatic IP updates
        * Set up a systemd service for updates
        * Update your config.env with the DDNS hostname

   c. Service Subdomains
   The following table shows recommended subdomain configurations:

   | Service            | Default Port | Suggested Subdomain         | Container Name       |
   |-------------------|--------------|----------------------------|---------------------|
   | Nginx Proxy Manager| 81          | npm.yourdomain.com        | nginx-proxy-manager |
   | Plex              | 32400        | plex.yourdomain.com       | plex               |
   | Sonarr            | 8989         | sonarr.yourdomain.com     | sonarr             |
   | Radarr            | 7878         | radarr.yourdomain.com     | radarr             |
   | Lidarr            | 8686         | lidarr.yourdomain.com     | lidarr             |
   | Readarr           | 8787         | readarr.yourdomain.com    | readarr            |
   | Bazarr            | 6767         | bazarr.yourdomain.com     | bazarr             |
   | qBittorrent       | 8080         | qbittorrent.yourdomain.com| qbittorrentvpn     |
   | Prowlarr          | 9696         | prowlarr.yourdomain.com   | prowlarr           |
   | NZBGet            | 6789         | nzbget.yourdomain.com     | nzbget             |
   | Overseerr         | 5055         | overseerr.yourdomain.com  | overseerr          |
   | Tautulli          | 8181         | tautulli.yourdomain.com   | tautulli           |
   | Portainer         | 9000         | portainer.yourdomain.com  | portainer          |
   | Organizr          | 80           | organizr.yourdomain.com   | organizr           |
   | Authelia          | 9091         | auth.yourdomain.com       | authelia           |

   After installation, configure these in Nginx Proxy Manager:
   1. Access NPM at http://<SERVER_IP>:81
   2. Add a Proxy Host for each service
   3. Point each subdomain to the corresponding container and port
   4. Enable SSL certificates through Let's Encrypt

## Installation Methods

### Method 1: Automated Installation (Recommended)

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/monsterr-media-server.git
   cd monsterr-media-server
   ```

2. **Make Scripts Executable**
   ```bash
   chmod +x *.sh scripts/*.sh
   ```

3. **Run Installation Script**
   ```bash
   sudo ./install_media_server.sh
   ```

4. **Follow Setup Wizard**
   - Choose between web-based or CLI configuration
   - Enter required information when prompted

### Method 2: Manual Installation

1. **Install Dependencies**
   ```bash
   sudo ./scripts/install_dependencies.sh
   ```

2. **Install Docker**
   ```bash
   sudo ./scripts/install_docker.sh
   ```

3. **Configure Environment**
   ```bash
   cp sample_config.env config.env
   # Edit config.env with your settings
   ```

4. **Create Directories**
   ```bash
   sudo ./scripts/create_directories.sh
   ```

5. **Configure Services**
   ```bash
   sudo ./scripts/configure_firewall.sh
   sudo ./scripts/setup_authelia.sh
   # Configure additional services as needed
   ```

6. **Launch Services**
   ```bash
   sudo ./scripts/launch_services.sh
   ```

## Post-installation Setup

1. **Access Services**
   - Nginx Proxy Manager: https://npm.yourdomain.com
   - Portainer: https://portainer.yourdomain.com
   - Plex: http://localhost:32400/web

2. **Configure Media Libraries**
   During installation, you'll be prompted to specify custom locations for your media and downloads folders. This allows you to:
   - Use an external drive (e.g., `/mnt/externaldrive/media`)
   - Use a NAS mount (e.g., `/mnt/nas/media`)
   - Use any custom location on your system

   Default locations if not specified:
   - Media: `/opt/media-server/media`
   - Downloads: `/opt/media-server/downloads`

   Important considerations:
   - Ensure the specified directories exist and are mounted before installation
   - The paths must be accessible and writable
   - For external drives, ensure they are mounted at boot (via /etc/fstab)
   - Permissions will be set automatically using your PUID/PGID

   The following subdirectories will be created in your media location:
   ```
   media/
   ├── movies/
   ├── tv/
   ├── music/
   ├── books/
   ├── audiobooks/
   └── podcasts/
   ```

   And in your downloads location:
   ```
   downloads/
   ├── complete/
   └── incomplete/
   ```

3. **Security Setup**
   - Configure Authelia
   - Set up Fail2Ban
   - Configure SSL certificates

4. **Configure Backup System**
   ```bash
   # Verify backup script
   sudo ./scripts/setup_backups.sh
   
   # Test backup
   sudo ./backup.sh
   ```

## Troubleshooting

### Common Issues

1. **Permission Errors**
   ```bash
   # Fix permissions
   sudo chown -R $PUID:$PGID /opt/media-server
   ```

2. **Network Issues**
   ```bash
   # Check Docker network
   docker network ls
   docker network inspect proxy
   ```

3. **Service Failures**
   ```bash
   # Check service logs
   docker-compose logs [service_name]
   
   # Restart service
   docker-compose restart [service_name]
   ```

4. **Database Issues**
   ```bash
   # Backup database
   docker-compose exec [service] pg_dump -U [user] > backup.sql
   
   # Restore database
   docker-compose exec -i [service] psql -U [user] < backup.sql
   ```

### Logs Location
- Docker logs: `/var/log/docker/`
- Service logs: `/opt/media-server/logs/`
- Nginx logs: `/opt/media-server/npm/logs/`

### Support Resources
- GitHub Issues
- Community Forums
- Documentation Wiki
- Support Email

## Next Steps
- [Security Configuration](security.md)
- [Service Configuration](services.md)
- [Backup Configuration](backup.md)
- [Monitoring Setup](monitoring.md)

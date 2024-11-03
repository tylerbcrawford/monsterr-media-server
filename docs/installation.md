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

3. **Configure Network**
   - Set static IP (recommended)
   - Configure port forwarding if needed
   - Set up domain/subdomain DNS

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
   ```bash
   # Create media directories
   mkdir -p /opt/media-server/media/{movies,tv,music,books}
   
   # Set permissions
   chown -R $PUID:$PGID /opt/media-server/media
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

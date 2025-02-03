# Configuration Guide

## Overview
This guide explains all configuration options and best practices for Monsterr Media Server. It covers both initial setup and ongoing configuration management.

## Configuration Files

### config.env
The main configuration file containing all environment variables:

```bash
# System Configuration
TIMEZONE=America/Toronto    # Your local timezone
PUID=1000                  # User ID for service permissions
PGID=1000                  # Group ID for service permissions

# Domain Configuration
DOMAIN=example.com         # Your domain name
USE_DDNS=no               # Use DDNS? (yes/no)
DYNU_API_KEY=             # Dynu API key (if using DDNS)

# Media Locations
MEDIA_DIR=/opt/media-server/media       # Media storage location
DOWNLOADS_DIR=/opt/media-server/downloads # Downloads location

# Service Configuration
PLEX_CLAIM_TOKEN=         # Get from plex.tv/claim
VPN_USERNAME=             # VPN service username
VPN_PASSWORD=             # VPN service password
GRAFANA_ADMIN_PASSWORD=   # Grafana dashboard password

# Email Configuration (Optional)
AUTHELIA_NOTIFIER_SMTP_HOST=     # SMTP server hostname
AUTHELIA_NOTIFIER_SMTP_PORT=     # SMTP server port
AUTHELIA_NOTIFIER_SMTP_USERNAME= # SMTP username
AUTHELIA_NOTIFIER_SMTP_PASSWORD= # SMTP password
AUTHELIA_NOTIFIER_SMTP_SENDER=   # Sender email address
```

## Directory Structure

### Media Organization
```
/opt/media-server/
├── media/
│   ├── movies/      # Movie files
│   ├── tv/          # TV show files
│   ├── music/       # Music files
│   ├── books/       # E-book files
│   ├── audiobooks/  # Audiobook files
│   └── podcasts/    # Podcast files
└── downloads/
    ├── complete/    # Completed downloads
    └── incomplete/  # In-progress downloads
```

### Service Configuration
```
/opt/media-server/
├── plex/
│   └── config/      # Plex configuration
├── sonarr/
│   └── config/      # Sonarr configuration
├── radarr/
│   └── config/      # Radarr configuration
└── ...
```

## Configuration Best Practices

### 1. File Permissions
- Set correct PUID/PGID:
  ```bash
  # Find your user's ID and group
  id $USER
  
  # Update config.env with these values
  PUID=1000  # Replace with your user ID
  PGID=1000  # Replace with your group ID
  ```

### 2. Storage Management
- Separate system and media storage:
  ```bash
  # System files on SSD
  MEDIA_DIR=/mnt/storage/media
  
  # Downloads on separate drive
  DOWNLOADS_DIR=/mnt/downloads
  ```

### 3. Network Configuration
- Use SSL for all services
- Configure reverse proxy
- Set up proper port forwarding

### 4. Security Settings
- Enable 2FA with Authelia
- Use strong passwords
- Keep VPN enabled for downloads
- Regular backup configuration

## Service-Specific Configuration

### 1. Plex Media Server
```yaml
# docker-compose.yml excerpt
plex:
  environment:
    - PLEX_CLAIM=${PLEX_CLAIM_TOKEN}
    - ADVERTISE_IP=https://plex.${DOMAIN}
```

### 2. Download Services
```yaml
# docker-compose.yml excerpt
qbittorrentvpn:
  environment:
    - VPN_ENABLED=yes
    - VPN_USERNAME=${VPN_USERNAME}
    - VPN_PASSWORD=${VPN_PASSWORD}
```

### 3. Monitoring Services
```yaml
# docker-compose.yml excerpt
grafana:
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}
```

## Optional Features

### 1. Email Notifications
Enable email notifications by configuring SMTP settings:
```bash
# In config.env
AUTHELIA_NOTIFIER_SMTP_HOST=smtp.gmail.com
AUTHELIA_NOTIFIER_SMTP_PORT=587
AUTHELIA_NOTIFIER_SMTP_USERNAME=your-email@gmail.com
AUTHELIA_NOTIFIER_SMTP_PASSWORD=your-app-password
AUTHELIA_NOTIFIER_SMTP_SENDER=your-email@gmail.com
```

### 2. Dynamic DNS
Enable DDNS support for dynamic IP addresses:
```bash
# In config.env
USE_DDNS=yes
DYNU_API_KEY=your-api-key
```

## Configuration Management

### 1. Backup Configuration
Regular backups of configuration:
```bash
# Backup configuration
sudo ./scripts/backup_system.sh

# Verify backup
sudo ./scripts/backup_system.sh --verify
```

### 2. Update Configuration
Modify settings safely:
```bash
# Edit configuration
sudo nano config.env

# Apply changes
sudo ./scripts/configure_settings.sh
```

### 3. Validate Configuration
Check configuration validity:
```bash
# Verify configuration
sudo ./scripts/post_install_check.sh --config

# Test services
sudo ./scripts/post_install_check.sh --services
```

## Troubleshooting

### 1. Configuration Issues
If you encounter configuration problems:
```bash
# Check configuration
sudo ./scripts/error_handler.sh --check-config

# Restore from backup
sudo ./scripts/error_handler.sh --restore-config
```

### 2. Permission Issues
Fix permission problems:
```bash
# Fix permissions
sudo ./scripts/error_handler.sh --fix-permissions
```

### 3. Service Issues
Resolve service problems:
```bash
# Check service status
sudo ./scripts/post_install_check.sh --services

# Restart services
sudo ./scripts/error_handler.sh --restart-services
```

## Additional Resources
- [Quick Start Guide](quick-start.md)
- [Installation Guide](installation.md)
- [Troubleshooting Guide](troubleshooting.md)
- [Monitoring Guide](monitoring.md)
- [Backup Guide](backup.md)
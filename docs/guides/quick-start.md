# Quick Start Guide

## Overview
This guide provides a streamlined setup process for Monsterr Media Server, getting you up and running quickly with a basic configuration.

## Hardware Recommendations

### Small Home Setup (1-2 users, 1080p content)
- CPU: 4 cores (Intel i3/Ryzen 3 or better)
- RAM: 8GB
- Storage: 
  * System SSD: 120GB
  * Media HDD: 2TB+
- Network: 100Mbps+

### Medium Home Setup (2-4 users, mixed 1080p/4K content)
- CPU: 6 cores (Intel i5/Ryzen 5 or better)
- RAM: 16GB
- Storage:
  * System SSD: 250GB
  * Media HDD: 4TB+
- Network: Gigabit

### Large Home Setup (4+ users, heavy 4K content)
- CPU: 8+ cores (Intel i7/Ryzen 7 or better)
- RAM: 32GB
- Storage:
  * System SSD: 500GB
  * Media HDD: 8TB+
- Network: Gigabit

## 5-Minute Setup

1. **Download and Extract**
   ```bash
   git clone https://github.com/yourusername/monsterr-media-server.git
   cd monsterr-media-server
   ```

2. **Run Quick Setup**
   ```bash
   sudo ./install_media_server.sh --quick
   ```

3. **Configure Basic Settings**
   - Choose media storage location
   - Set up basic authentication
   - Configure network access

## First-Time Configuration

### 1. Access Services
- Open http://localhost:32400/web for Plex
- Open http://localhost:81 for Nginx Proxy Manager
- Default credentials in config.env

### 2. Add Media
1. Create basic folders:
   ```bash
   movies/
   tv/
   music/
   ```
2. Point Plex to your media folders
3. Start media scanning

### 3. Enable Monitoring
```bash
sudo ./scripts/setup_monitoring.sh
```

### 4. Set Up Backups
```bash
sudo ./scripts/setup_backup.sh
```

## Common Tasks

### Adding Media
1. Add to appropriate folder:
   - Movies → movies/
   - TV Shows → tv/
   - Music → music/
2. Plex will automatically detect new content

### Checking System Health
```bash
# View system status
sudo ./scripts/post_install_check.sh

# View monitoring dashboard
http://localhost:3000
```

### Managing Backups
```bash
# Manual backup
sudo ./scripts/backup_system.sh daily

# View backup status
sudo ./scripts/backup_system.sh status
```

## Basic Troubleshooting

### Service Issues
```bash
# Restart a service
docker-compose restart [service_name]

# View service logs
docker-compose logs [service_name]
```

### Permission Problems
```bash
# Fix common permission issues
sudo ./scripts/fix_permissions.sh
```

### Network Issues
```bash
# Check service connectivity
sudo ./scripts/post_install_check.sh --network
```

## Getting Help

### Check Logs
- System logs: `/var/log/monsterr/`
- Service logs: `docker-compose logs`
- Monitoring: http://localhost:3000

### Common Solutions
1. **Service won't start**
   - Check logs
   - Verify permissions
   - Ensure ports are free

2. **Can't access service**
   - Check network settings
   - Verify service is running
   - Check proxy configuration

3. **Media not showing**
   - Verify file permissions
   - Check folder structure
   - Force library scan

## Next Steps
1. Configure remote access
2. Set up automated downloads
3. Enable media requests
4. Configure backup schedule

For detailed configuration, see the [full documentation](installation.md).
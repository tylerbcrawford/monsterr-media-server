# Quick Start Guide

This guide provides a streamlined installation process for Monsterr Media Server. For a detailed walkthrough, see our [Complete Installation Guide](installation-walkthrough.md).

## Minimum Requirements

### Hardware
- CPU: 4+ cores
- RAM: 8GB
- Storage: 20GB + media storage
- Network: 10Mbps+ internet

### Software
- Ubuntu 20.04+ or similar Linux
- Git
- Node.js 18.0.0+
- npm 9.0.0+

### Network
- Domain name or DDNS
- Router access
- Available ports: 80, 443, 9000 (Portainer), 32400 (Plex)

## Quick Installation

### 1. Clone & Install
```bash
# Clone repository
git clone https://github.com/yourusername/monsterr-media-server.git
cd monsterr-media-server

# Start installation
sudo ./install_media_server.sh
```

### 2. Setup Wizard Steps
1. **System Check**
   - Confirms requirements
   - Verifies dependencies
   - Tests network

2. **Choose Services**
   - Required Core Services:
     * Nginx Proxy Manager
     * Authelia (2FA)
     * Portainer (System Management)
     * Fail2Ban
   - Optional Services:
     * Media (Plex, Sonarr, Radarr)
     * Downloads (qBittorrent with VPN)
     * Books (Readarr, Calibre)
     * Monitoring (Prometheus, Grafana)

3. **Configure Storage**
   - Set media location
   - Configure permissions
   - Create directories

4. **Network Setup**
   - Enter domain
   - Configure ports
   - Setup SSL

5. **Security**
   - Set admin password
   - Configure 2FA
   - Set up firewall

### 3. Access Services
After installation, access your services at:
- Dashboard: https://dashboard.yourdomain.com
- Portainer: https://portainer.yourdomain.com
- Plex: https://plex.yourdomain.com

### 4. Quick Verification
```bash
# Check system health
sudo ./scripts/post_install_check.sh --all

# View service status
docker-compose ps
```

## Common Issues

### Can't Access Services
1. Check port forwarding
2. Verify DNS settings
3. Test firewall rules

### Services Won't Start
1. Verify permissions
2. Check resource availability
3. Review service logs

### SSL Problems
1. Verify domain
2. Check certificate setup
3. Test HTTPS access

## Next Steps

1. **Configure Media**
   - Set up libraries
   - Configure scanning
   - Add content

2. **Security**
   - Review access
   - Test 2FA
   - Check firewall

3. **Monitoring**
   - Set up alerts
   - Configure dashboards
   - Test notifications

4. **Backups**
   - Schedule backups
   - Test recovery
   - Verify data

## Need Help?
- Full documentation: /docs directory
- Detailed guide: [Installation Walkthrough](installation-walkthrough.md)
- Support: GitHub Issues

Remember: This is a quick start guide. For detailed instructions, troubleshooting, and best practices, refer to our [Complete Installation Guide](installation-walkthrough.md).
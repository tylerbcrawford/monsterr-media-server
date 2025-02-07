# Installation Guide

## Overview
This guide provides step-by-step instructions for installing Monsterr Media Server using our enhanced React-based setup wizard. For a quicker setup, see our [Quick Start Guide](quick-start.md).

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation Methods](#installation-methods)
- [Post-Installation Setup](#post-installation-setup)
- [Verification](#verification)
- [Next Steps](#next-steps)

## Prerequisites

### Hardware Requirements
See our [Hardware Guide](hardware.md) for detailed recommendations.

Minimum Requirements:
- CPU: 4 cores
- RAM: 8GB
- Storage: 20GB for system + storage for media
- Network: 10Mbps+ internet connection

### Network Requirements
See our [Network Setup Guide](network-setup.md) for detailed instructions.

Required Setup:
- Domain name or DDNS hostname
- Port forwarding capability
- Router access for configuration
- Static local IP or DHCP reservation

### Software Requirements
- Operating System: Ubuntu 20.04+ or similar Linux distribution
- Docker Engine (installed automatically)
- Docker Compose (installed automatically)
- Git (for installation)
- Node.js 18.0.0+ (for setup wizard)
- npm 9.0.0+ (installed with Node.js)

## Installation Methods

### Method 1: Automated Installation (Recommended)

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/monsterr-media-server.git
   cd monsterr-media-server
   ```

2. **Start Installation**
   ```bash
   sudo ./install_media_server.sh
   ```

   The installer will:
   - Check system requirements
   - Install dependencies
   - Launch the React-based setup wizard
   - Configure services
   - Start the system

3. **Follow Setup Wizard**
   The enhanced React-based setup wizard provides:

   a. **System Requirements Check**
   - Hardware validation
   - Software dependency verification
   - Network connectivity tests
   - Real-time feedback

   b. **Service Selection**
   - Visual service dependency map
   - Resource requirement estimates
   - Automated dependency resolution
   - Custom service combinations
   - Optional remote access (VNC)
     * Can be enabled/disabled during installation
     * Part of the "remote" service profile
     * Not required for basic media server functionality

   c. **Storage Configuration**
   - Path validation and creation
   - Permission checks
   - Space requirement calculation
   - Automated directory structure

   d. **Network Setup**
   - Domain validation
   - Port availability checking
   - SSL certificate automation
   - VPN configuration

   e. **Security Configuration**
   - Two-factor authentication setup
   - Fail2Ban configuration
   - Firewall rule management
   - Access control setup

   f. **Final Review & Deployment**
   - Configuration summary
   - Pre-deployment validation
   - Progress tracking
   - Error recovery

### Method 2: Manual Installation

1. **Install Dependencies**
   ```bash
   sudo ./scripts/install_dependencies.sh
   ```

2. **Install Docker**
   ```bash
   sudo ./scripts/install_docker.sh
   ```

3. **Configure System**
   ```bash
   # Copy sample configuration
   cp sample_config.env config.env
   
   # Edit configuration
   nano config.env
   ```
   See [Configuration Guide](configuration.md) for details.

4. **Create Directories**
   ```bash
   sudo ./scripts/create_directories.sh
   ```

5. **Configure Services**
   ```bash
   sudo ./scripts/configure_settings.sh
   ```

6. **Launch Services**
   ```bash
   sudo ./scripts/launch_services.sh
   ```

## Post-Installation Setup

### 1. Access Services
After installation, access your services at:
- Dashboard: https://dashboard.yourdomain.com
- Plex: https://plex.yourdomain.com
- Remote Desktop: https://vnc.yourdomain.com (if enabled)
- Other services: See [Service Configuration](configuration.md#service-specific-configuration)

### 2. Remote Access Setup
If you enabled VNC during installation:
1. Access VNC interface at https://vnc.yourdomain.com
2. Complete two-factor authentication
3. Set up VNC password in settings
4. Configure desktop environment preferences
See [VNC Access Guide](guides/vnc-access.md) for detailed setup and usage.

### 2. Configure Media Libraries
See [Configuration Guide](configuration.md#media-organization) for detailed media organization.

Default Locations:
```
media/
├── movies/
├── tv/
├── music/
├── books/
├── audiobooks/
└── podcasts/
```

### 3. Security Setup
See [Domain Setup Guide](domain-setup.md) for detailed domain configuration and [Network Setup Guide](network-setup.md#security-configuration) for security configuration.

Required Steps:
1. Configure Authelia
2. Set up SSL certificates
3. Configure Fail2Ban
4. Review firewall rules

### 4. Configure Backup System
See [Backup Guide](backup.md) for detailed backup configuration.

Basic Setup:
```bash
# Set up backup system
sudo ./scripts/setup_backup.sh

# Verify backup system
sudo ./scripts/backup_system.sh --verify
```

## Verification

### 1. System Health Check
```bash
# Full system check
sudo ./scripts/post_install_check.sh --all

# View specific checks
sudo ./scripts/post_install_check.sh --help
```

### 2. Service Status
```bash
# Check container status
docker-compose ps

# View service logs
docker-compose logs [service_name]
```

### 3. Network Verification
```bash
# Check network setup
sudo ./scripts/post_install_check.sh --network

# Test domain configuration
sudo ./scripts/post_install_check.sh --domain
```

## Troubleshooting

If you encounter issues during installation:

1. Check the setup wizard logs:
   ```bash
   # View setup wizard logs
   tail -f /var/log/monsterr/setup-wizard.log

   # View API server logs
   tail -f /var/log/monsterr/setup-api.log
   ```

2. Use the error handler:
   ```bash
   sudo ./scripts/error_handler.sh --check-config
   ```

3. Collect debug information:
   ```bash
   sudo ./scripts/collect_debug_info.sh
   ```

4. Check setup wizard status:
   ```bash
   # Check setup wizard process
   sudo systemctl status monsterr-setup

   # Check API server
   sudo systemctl status monsterr-setup-api
   ```

See [Troubleshooting Guide](troubleshooting.md) for detailed problem resolution.

## Next Steps

1. [Configure Services](configuration.md)
   - Set up media libraries
   - Configure automation
   - Customize settings

2. [Set Up Monitoring](monitoring.md)
   - Configure alerts
   - Set up dashboards
   - Monitor system health

3. [Configure Backups](backup.md)
   - Set up backup schedule
   - Configure retention
   - Test recovery

4. [Review Security](network-setup.md#security-configuration)
   - Check SSL setup
   - Review firewall rules
   - Test authentication

## Additional Resources
- [Quick Start Guide](quick-start.md)
- [Configuration Guide](configuration.md)
- [Network Setup Guide](network-setup.md)
- [Troubleshooting Guide](troubleshooting.md)
- [Hardware Guide](hardware.md)
- [Monitoring Guide](monitoring.md)
- [Backup Guide](backup.md)

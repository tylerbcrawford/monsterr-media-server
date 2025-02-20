# Monsterr Media Server Installation Guide

This guide provides comprehensive instructions for installing Monsterr Media Server, covering quick setup, detailed walkthroughs, and common troubleshooting steps.

## Table of Contents

*   [Minimum Requirements](#minimum-requirements)
*   [Quick Installation](#quick-installation)
*   [Detailed Installation Walkthrough](#detailed-installation-walkthrough)
*   [Post-Installation Setup](#post-installation-setup)
*   [Verification](#verification)
*   [Common Issues](#common-issues)
*   [Next Steps](#next-steps)
*   [Support Resources](#support-resources)
*   [Version Information](#version-information)

## Minimum Requirements

### Hardware

*   CPU: 4+ cores
*   RAM: 8GB
*   Storage: 20GB + media storage
*   Network: 10Mbps+ internet

### Software

*   Ubuntu 20.04+ or similar Linux distribution
*   Git
*   Node.js 18.0.0+
*   npm 9.0.0+

### Network

*   Domain name or DDNS
*   Router access
*   Available ports: 80, 443, 9000 (Portainer), 32400 (Plex)

## Quick Installation

1.  **Clone and Install:**

    ```bash
    git clone https://github.com/yourusername/monsterr-media-server.git
    cd monsterr-media-server
    sudo ./install_media_server.sh
    ```

2.  **Setup Wizard:** Follow the on-screen prompts in the setup wizard. The wizard guides you through system checks, service selection, storage configuration, network setup, security configuration, and deployment. Each step is represented by a menu bubble:

    *   Active step: Blue
    *   Completed steps: Green
    *   Upcoming steps: Gray

    ![Setup Wizard Screenshot](images/setup-wizard.png)

3.  **Access Services:** After installation, access your services at:

    *   Dashboard: `https://dashboard.yourdomain.com`
    *   Portainer: `https://portainer.yourdomain.com`
    *   Plex: `https://plex.yourdomain.com`

4.  **Verification:**

    ```bash
    sudo ./scripts/post_install_check.sh --all
    docker-compose ps
    ```

## Detailed Installation Walkthrough

This walkthrough provides a more in-depth explanation of each step in the installation process.

### Pre-Installation Checklist

#### System Requirements

1.  **Hardware:**
    *   [ ] CPU: 4+ cores (Intel i5/Ryzen 5 or better recommended)
    *   [ ] RAM: 8GB minimum (16GB+ recommended)
    *   [ ] Storage: 20GB for system + media storage space
    *   [ ] Network: 10Mbps+ internet connection (100Mbps+ recommended)

2.  **Software:**
    *   [ ] Ubuntu 20.04+ or similar Linux distribution
    *   [ ] Git installed (`sudo apt-get install git`)
    *   [ ] Node.js 18.0.0+ and npm 9.0.0+
    *   [ ] Root/sudo access

3.  **Network:**
    *   [ ] Domain name or DDNS hostname
    *   [ ] Router access for port forwarding
    *   [ ] Static IP or DHCP reservation configured
    *   [ ] Required ports available (80, 443, 32400)

### Installation Journey

#### Stage 1: Preparation (15-30 minutes)

1.  **System Updates:**

    ```bash
    sudo apt-get update
    sudo apt-get upgrade
    ```

    *   *Potential Issue:* Slow repository response
    *   *Solution:* Try different mirrors or check your internet connection.

2.  **Directory Setup:**

    ```bash
    mkdir -p /opt/media-server
    cd /opt/media-server
    ```

    *   *Potential Issue:* Permission denied
    *   *Solution:* Use `sudo` or adjust directory permissions.

3.  **Repository Clone:**

    ```bash
    git clone https://github.com/yourusername/monsterr-media-server.git
    cd monsterr-media-server
    ```

    *   *Potential Issue:* Git clone fails
    *   *Solution:* Check your internet connection and GitHub access.

#### Stage 2: Setup Wizard Launch (5-10 minutes)

1.  **Start Installation:**

    ```bash
    sudo ./install_media_server.sh
    ```

    *   *Potential Issue:* Script permission denied
    *   *Solution:* Run `chmod +x install_media_server.sh`

2.  **Initial Checks:** The installer will perform initial checks for system requirements, dependencies, and network connectivity.
    *   *Potential Issue:* Failed requirements
    *   *Solution:* Follow the on-screen instructions to install missing dependencies.

#### Stage 3: Setup Wizard Interface

The setup wizard will guide you through the following steps:

1.  **System:** Hardware, software, and network validation.
2.  **Services:** Select the services you want to install.
3.  **Storage:** Configure storage locations for media, configuration, and backups.
4.  **Network:** Configure your domain, port forwarding, and SSL.
5.  **Security:** Set up two-factor authentication, firewall rules, and access control.
6.  **Deploy:** Review your configuration and deploy the services.

#### Stage 4: Verification (15-20 minutes)

1.  **System Health Check:**

    ```bash
    sudo ./scripts/post_install_check.sh --all
    ```

2.  **Service Access:** Access your services via their respective URLs.

## Post-Installation Setup

### Accessing Services

After installation, access your services at their respective URLs, which will be displayed at the end of the setup process. Common service URLs include:

*   Dashboard: `https://dashboard.yourdomain.com`
*   Plex: `https://plex.yourdomain.com`
*   Remote Desktop (if enabled): `https://vnc.yourdomain.com`

### Configuring Media Libraries

See the [Configuration Guide](configuration.md#media-organization) for detailed media organization instructions. Default media locations are:

```
media/
├── movies/
├── tv/
├── music/
├── books/
├── audiobooks/
└── podcasts/
```

### Security Setup

See the [Domain Setup Guide](domain-setup.md) for detailed domain configuration and the [Network Setup Guide](network-setup.md#security-configuration) for security configuration instructions. Required security steps include configuring Authelia, setting up SSL certificates, configuring Fail2Ban, and reviewing firewall rules.

### Configuring Backups

See the [Backup Guide](backup.md) for detailed backup configuration instructions. Basic backup setup:

```bash
sudo ./scripts/setup_backup.sh
sudo ./scripts/backup_system.sh --verify
```

## Verification

### System Health Check

```bash
sudo ./scripts/post_install_check.sh --all
sudo ./scripts/post_install_check.sh --help  # For specific checks
```

### Service Status

```bash
docker-compose ps
docker-compose logs [service_name]
```

### Network Verification

```bash
sudo ./scripts/post_install_check.sh --network
sudo ./scripts/post_install_check.sh --domain
```

## Common Issues

### Network Issues

*   **Symptom:** Cannot access services externally.
*   **Solution:** Verify port forwarding, check firewall rules, and validate DNS settings.

### Permission Problems

*   **Symptom:** Services fail to start.
*   *Solution:* Check directory permissions, verify user/group settings, and review container permissions.

### Resource Constraints

*   **Symptom:** System is sluggish or services crash.
*   **Solution:** Reduce the number of running services, increase resource allocation, or optimize configurations.

### SSL Certificate Issues

*   **Symptom:** Security warnings in the browser.
*   **Solution:** Verify domain configuration, check certificate renewal, and validate SSL setup.

## Next Steps

1.  Configure Services: Set up media libraries, configure automation, and customize settings.
2.  Set Up Monitoring: Configure alerts, set up dashboards, and monitor system health.
3.  Configure Backups: Set up a backup schedule, configure retention, and test recovery.
4.  Review Security: Check SSL setup, review firewall rules, and test authentication.

## Support Resources

*   Documentation: `/docs` directory
*   Issue Tracker: GitHub Issues
*   Community Forums: \[Link to forums]
*   Error Logs: `/var/log/monsterr/`

## Version Information

Refer to the individual guides for their respective version information.

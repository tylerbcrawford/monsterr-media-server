# VNC Remote Access Guide

## Overview

The media server offers optional secure VNC access through a web browser, protected by two-factor authentication and multiple security layers. This feature is part of the "remote" service profile and can be enabled or disabled during installation or afterward.

### Enabling VNC Access

VNC access is not enabled by default. To enable it:

1.  **During Installation:**
    *   Select "Remote Access" in the service selection step.
    *   The setup wizard will configure all necessary components.

2.  **After Installation:**

    ```bash
    # Enable VNC services
    docker-compose --profile remote up -d
    ```

3.  **To Disable:**

    ```bash
    # Stop VNC services
    docker-compose --profile remote down
    ```

## Features

*   Web-based VNC access (no VNC client required)
*   Two-factor authentication via Authelia
*   SSL/TLS encryption
*   Fail2Ban protection against brute-force attempts
*   Full desktop environment access

## Security Measures

1.  **Two-Factor Authentication:**
    *   Required for all VNC access attempts
    *   Managed through Authelia

2.  **SSL/TLS Encryption:**
    *   All traffic is encrypted via NGINX.
    *   Uses your domain's SSL certificates.

3.  **Intrusion Prevention:**
    *   Fail2Ban monitors for unauthorized access attempts.
    *   Automatic IP banning after three failed attempts
    *   1-hour ban duration

4.  **Network Security:**
    *   VNC server only accessible through a web proxy
    *   Direct VNC port access is restricted
    *   All connections are logged and monitored

## Accessing VNC

1.  **Web Access:**
    *   Navigate to `https://vnc.yourdomain.com`.
    *   Complete two-factor authentication.
    *   Connect to the VNC session.

2.  **Emergency Access:**  If web access is unavailable, an SSH tunnel can be used:

    ```bash
    ssh -L 5901:localhost:5901 user@your-server-ip
    ```

    Then connect your VNC client to `localhost:5901`.

## Troubleshooting

1.  **Connection Issues:**
    *   Verify Authelia authentication is working.
    *   Check NGINX logs for SSL/proxy errors.
    *   Ensure the VNC service is running.

2.  **Performance Tips:**
    *   Adjust quality settings in the noVNC interface.
    *   Use a wired connection when possible.
    *   Consider reducing resolution for slower connections.

## Security Best Practices

1.  **Access Control:**
    *   Only grant VNC access to necessary users.
    *   Regularly review access logs.
    *   Update passwords periodically.

2.  **Monitoring:**
    *   Check Fail2Ban logs for unauthorized attempts.
    *   Monitor system resources during VNC sessions.
    *   Review NGINX access logs regularly.

## Technical Details

### Port Usage

*   443: HTTPS access (NGINX)
*   6080: noVNC WebSocket (internal)
*   5901: VNC server (internal)

### Service Dependencies

1.  NGINX Proxy Manager
2.  Authelia
3.  noVNC
4.  VNC Server

### Configuration Files

*   `/config/nginx/vnc.conf`: NGINX configuration
*   `/config/authelia/configuration.yml`: Authentication rules
*   `/config/fail2ban/filter.d/vnc.conf`: Fail2Ban filter
*   `/config/fail2ban/jail.d/vnc.conf`: Fail2Ban jail settings

## Maintenance

1.  **Regular Updates:**
    *   VNC services are updated via Watchtower.
    *   Security patches are applied automatically.
    *   Configuration changes require manual review.

2.  **Backup Considerations:**
    *   VNC configurations are included in system backups.
    *   User preferences are persistent across restarts.
    *   Session data is temporary and not backed up.

## Support

For additional assistance:

1.  Check system logs in the Grafana dashboard.
2.  Review service status in Portainer.
3.  Consult the main system documentation.
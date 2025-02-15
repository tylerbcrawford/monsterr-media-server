# Network Setup Guide

## Overview
This guide explains how to configure your network for Monsterr Media Server, including domain setup, port forwarding, and security considerations.

## Network Requirements

### Minimum Requirements
- Internet connection: 10Mbps+ download/upload
- Router with port forwarding capability
- Static local IP or DHCP reservation
- Ability to configure DNS settings

### Recommended Setup
- Internet: 100Mbps+ download/upload
- Gigabit internal network
- UPnP support (optional)
- Modern router with firewall

## Domain Configuration

### 1. Static IP Setup
If you have a static IP address:

1. Purchase a domain (e.g., from Namecheap, Cloudflare)
2. Add DNS records:
   ```
   # A Record
   @ IN A your.static.ip.address
   
   # CNAME Records (or use wildcard)
   plex     IN CNAME your.domain.com
   sonarr   IN CNAME your.domain.com
   radarr   IN CNAME your.domain.com
   ```
3. Configure in `config.env`:
   ```bash
   DOMAIN=your.domain.com
   USE_DDNS=no
   ```

### 2. Dynamic IP Setup
If you have a dynamic IP address:

1. Sign up for Dynu DDNS
2. Create a hostname (e.g., myhome.dynu.net)
3. Get your API credentials
4. Configure in `config.env`:
   ```bash
   DOMAIN=myhome.dynu.net
   USE_DDNS=yes
   DYNU_API_KEY=your-api-key
   ```

## Port Forwarding

### Required Ports
| Port | Protocol | Service | Required |
|------|----------|----------|-----------|
| 80   | TCP      | HTTP     | Yes       |
| 443  | TCP      | HTTPS    | Yes       |
| 81   | TCP      | NPM UI   | No        |
| 32400| TCP      | Plex     | External  |
| 9000 | TCP      | Portainer| Yes       |

### Setup Steps
1. Access router admin panel
2. Find port forwarding section
3. Add port forwards:
   ```
   80   -> SERVER_IP:80
   443  -> SERVER_IP:443
   81   -> SERVER_IP:81 (optional)
   32400-> SERVER_IP:32400 (for direct Plex access)
   9000 -> SERVER_IP:9000 (for Portainer access)
   ```

### DHCP Reservation
1. Find your server's MAC address:
   ```bash
   ip link show
   ```
2. Configure DHCP reservation in router
3. Assign static IP (e.g., 192.168.1.100)

## SSL Configuration

### 1. Let's Encrypt Setup
Nginx Proxy Manager will handle this automatically:
1. Access NPM at http://SERVER_IP:81
2. Add proxy host
3. Enable SSL
4. Choose Let's Encrypt

### 2. Manual SSL
If needed, generate certificates manually:
```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d your.domain.com
```

## Security Configuration

### 1. Firewall Setup
Configure UFW:
```bash
# Enable UFW
sudo ufw enable

# Allow required ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 81/tcp
sudo ufw allow 32400/tcp
sudo ufw allow 9000/tcp

# Allow SSH (important!)
sudo ufw allow ssh
```

### 2. Fail2Ban Configuration
```bash
# Install Fail2Ban
sudo apt-get install fail2ban

# Configure jail
sudo nano /etc/fail2ban/jail.local

[nginx-proxy-manager]
enabled = true
port = http,https
filter = nginx-proxy-manager
logpath = /var/log/nginx/*.log
maxretry = 3
```

### 3. VPN Configuration
qBittorrent includes built-in VPN support:
1. Configure in qBittorrent settings:
   ```bash
   # Environment variables in config.env
   QBITTORRENT_VPN_USERNAME=your-username
   QBITTORRENT_VPN_PASSWORD=your-password
   ```
2. Enable VPN in qBittorrent:
   - VPN_ENABLED=yes
   - VPN_TYPE=openvpn
   - Configure kill switch
   - Set up port forwarding if needed

3. Verify VPN connection:
   ```bash
   sudo ./scripts/post_install_check.sh --vpn
   ```

## Network Optimization

### 1. Quality of Service (QoS)
Configure router QoS:
1. Prioritize Plex traffic
2. Limit download bandwidth
3. Reserve upload bandwidth

### 2. MTU Optimization
```bash
# Find optimal MTU
ping -c 5 -M do -s 1500 google.com

# Set MTU in network config
sudo nano /etc/network/interfaces
```

### 3. DNS Configuration
Use reliable DNS servers:
```bash
# Edit resolv.conf
sudo nano /etc/resolv.conf

nameserver 1.1.1.1
nameserver 8.8.8.8
```

## Troubleshooting

### 1. Connection Issues
Check connectivity:
```bash
# Test internet
ping -c 4 google.com

# Test DNS
nslookup your.domain.com

# Check ports
sudo netstat -tulpn
```

### 2. SSL Problems
Verify SSL setup:
```bash
# Check certificate
sudo certbot certificates

# Test SSL
curl -vI https://your.domain.com
```

### 3. Port Forwarding
Verify port forwarding:
```bash
# Check local ports
sudo netstat -tulpn

# Test from external network
curl -v telnet://your.public.ip:80
```

### 4. VPN Issues
Troubleshoot VPN connection:
```bash
# Check VPN status in qBittorrent
docker logs qbittorrentvpn

# Verify IP address
curl -s https://ipinfo.io

# Test kill switch
sudo ./scripts/post_install_check.sh --vpn-killswitch
```

## Network Monitoring

### 1. Basic Monitoring
```bash
# Check network status
sudo ./scripts/post_install_check.sh --network

# Monitor bandwidth
iftop -i eth0
```

### 2. Advanced Monitoring
- Use Grafana dashboard
- Monitor network metrics
- Set up alerts
- Track VPN status

## Additional Resources
- [Router Port Forwarding Guide](https://portforward.com)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs)
- [UFW Guide](https://help.ubuntu.com/community/UFW)
- [Fail2Ban Documentation](https://www.fail2ban.org/wiki/index.php/Main_Page)
- [qBittorrent VPN Documentation](https://github.com/qbittorrent/qBittorrent/wiki/SOCKS5-Proxy-Setup)
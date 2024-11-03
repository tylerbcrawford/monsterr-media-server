# Monsterr Media Server

A comprehensive, Docker-based media server solution with automated setup and management capabilities. This project provides a complete suite of media management services including Plex, Sonarr, Radarr, and more, all configured with security and monitoring in mind.

## 🌟 Features

- **Automated Setup**: Easy-to-use installation scripts and web-based configuration
- **Media Management**:
  - Plex Media Server for streaming
  - Sonarr for TV shows
  - Radarr for movies
  - Lidarr for music
  - Readarr for books
  - Bazarr for subtitles
  - Audiobookshelf for audiobooks
  - Calibre-Web for ebooks
- **Download Management**:
  - qBittorrent with VPN integration
  - NZBGet for Usenet
  - Prowlarr for indexer management
- **Security**:
  - Authelia for two-factor authentication
  - Fail2Ban for intrusion prevention
  - Nginx Proxy Manager for reverse proxy
  - VPN integration for secure downloads
- **Monitoring & Management**:
  - Prometheus & Grafana for monitoring
  - Tautulli for Plex statistics
  - Portainer for Docker management
  - Watchtower for automatic updates
  - Organizr for unified interface

## 📋 Prerequisites

- Linux-based operating system (tested on Ubuntu 20.04+)
- Root access or sudo privileges
- Basic understanding of Docker and networking
- Domain name (for remote access)
- Minimum System Requirements:
  - CPU: 4 cores
  - RAM: 8GB
  - Storage: 20GB for base installation (excluding media storage)

## 🚀 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/monsterr-media-server.git
   cd monsterr-media-server
   ```

2. Make scripts executable:
   ```bash
   chmod +x *.sh scripts/*.sh
   ```

3. Run the installation script:
   ```bash
   sudo ./install_media_server.sh
   ```

4. Follow the setup wizard prompts or use the web interface for configuration.

## 🛠️ Configuration

### Environment Variables

Copy the sample configuration file:
```bash
cp sample_config.env config.env
```

Edit the following required variables in `config.env`:
- `TIMEZONE`: Your timezone (e.g., "America/Toronto")
- `DOMAIN`: Your domain name
- `PUID/PGID`: User/Group IDs for file permissions
- `PLEX_CLAIM_TOKEN`: Your Plex claim token
- `VPN_USERNAME/VPN_PASSWORD`: VPN credentials
- Additional service-specific variables

### Directory Structure

```
/opt/media-server/
├── media/          # Media libraries
│   ├── movies/
│   ├── tv/
│   ├── music/
│   ├── books/
│   └── audiobooks/
├── downloads/      # Download directory
├── config/         # Service configurations
└── backups/        # Backup directory
```

## 🔒 Security

- All services are protected behind Authelia's two-factor authentication
- Fail2Ban monitors for suspicious activity
- VPN integration for secure downloads
- Regular security updates via Watchtower

## 📊 Monitoring

Access monitoring tools at:
- Grafana: `https://grafana.yourdomain.com`
- Prometheus: `https://prometheus.yourdomain.com`
- Tautulli: `https://tautulli.yourdomain.com`

## 💾 Backup

Automated daily backups are configured for:
- Service configurations
- Media metadata
- Download history
- User preferences

Backups are stored in `/opt/media-server/backups/` and retained for 7 days.

## 🔄 Updates

Services are automatically updated using Watchtower. Manual updates can be performed using:
```bash
docker-compose pull
docker-compose up -d
```

## 🐛 Troubleshooting

Common issues and solutions:
1. **Permission Issues**: Verify PUID/PGID in config.env match your user
2. **Network Issues**: Check firewall settings and port forwarding
3. **VPN Problems**: Verify VPN credentials and configuration
4. **Service Access**: Ensure Nginx Proxy Manager is properly configured

For detailed logs:
```bash
docker-compose logs [service_name]
```

## 📝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on contributing to this project.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- LinuxServer.io for many Docker images
- All open-source projects included in this suite
- Community contributors and testers

## 📞 Support

- Create an issue for bug reports or feature requests
- Join our community discussions
- Check the [documentation](docs/) for detailed guides

## ⚠️ Disclaimer

This project is for personal use only. Users are responsible for complying with local laws and regulations regarding media consumption and distribution.

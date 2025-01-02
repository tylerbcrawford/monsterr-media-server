# Monsterr Media Server

## About

Monsterr Media Server is a comprehensive, Docker-based media server solution designed to simplify the management and organization of your digital media library. This project provides a complete suite of media management services, including Plex, Sonarr, Radarr, and more, all configured with security and monitoring in mind.

The project aims to offer an easy-to-use and highly customizable media server setup, allowing users to manage their TV shows, movies, music, and books from a centralized platform. With features like automated downloads, two-factor authentication, and advanced monitoring capabilities, Monsterr Media Server ensures your media collection is secure, organized, and accessible.

Whether you're a home user or a small business, Monsterr Media Server is the perfect solution to streamline your media management and enjoy your content seamlessly across devices.

## Key Features

- Plex Media Server for streaming
- Sonarr, Radarr, Lidarr, and Readarr for TV, movies, music, and books
- Bazarr for subtitles
- Audiobookshelf and Calibre-Web for audiobooks and ebooks
- qBittorrent with VPN integration for secure downloads
- Prowlarr for indexer management
- Authelia for two-factor authentication
- Fail2Ban for intrusion prevention
- Nginx Proxy Manager for reverse proxy
- Prometheus and Grafana for monitoring
- Tautulli for Plex statistics
- Portainer for Docker management
- Watchtower for automatic updates
- Organizr for unified interface

## Getting Started

To get started with Monsterr Media Server, please refer to the [Installation Guide](docs/installation.md) in the project documentation.

## Post-Installation Health Checks

Monsterr Media Server includes a comprehensive health check script that verifies:
- Container health status
- Service connectivity
- Network configuration
- Security settings
- Resource availability

Run the health check at any time with:
```bash
sudo ./scripts/post_install_check.sh --all
```

This script is automatically run after installation, but you can use it anytime to:
- Verify system health
- Troubleshoot issues
- Check service status
- Validate configuration

## Contributing

We welcome contributions from the community! Please read the [Contributing Guidelines](CONTRIBUTING.md) to learn more about how you can get involved.

## License

This project is licensed under the [MIT License](LICENSE).

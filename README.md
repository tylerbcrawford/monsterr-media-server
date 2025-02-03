# Monsterr Media Server

A comprehensive, Docker-based media server solution with automated management and a user-friendly web interface.

## Features

- 🎬 Complete media server stack (Plex, Sonarr, Radarr, etc.)
- 🔒 Secure authentication with Authelia
- 🔄 Automated content management
- 📊 System monitoring and notifications
- 🛠️ Easy setup wizard
- 🚀 Docker-based deployment
- 📱 Mobile-friendly interface
- 🔐 VPN integration for downloads

## Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/tylerbcrawford/monsterr-media-server.git
cd monsterr-media-server
```

2. **Run the installer**
```bash
sudo ./install_media_server.sh
```

3. **Follow the setup wizard**
- Configure your domain
- Set up media locations
- Choose services to install
- Configure security settings

For detailed instructions, see our [Installation Guide](docs/guides/installation.md).

## System Requirements

### Minimum Requirements
- CPU: 4 cores
- RAM: 8GB
- Storage: 20GB + media storage
- OS: Ubuntu 20.04+ or similar
- Docker & Docker Compose

### Recommended
- CPU: 6+ cores
- RAM: 16GB+
- Storage: SSD for system, HDD for media
- Gigabit network connection

See [Hardware Guide](docs/guides/hardware.md) for detailed recommendations.

## Documentation

### User Guides
- [Quick Start Guide](docs/guides/quick-start.md)
- [Installation Guide](docs/guides/installation.md)
- [Configuration Guide](docs/guides/configuration.md)
- [Network Setup Guide](docs/guides/network-setup.md)
- [Troubleshooting Guide](docs/guides/troubleshooting.md)

### Technical Documentation
- [Architecture Overview](docs/api/architecture.md)
- [API Documentation](docs/api/api.md)
- [Security Guide](docs/guides/security.md)
- [Monitoring Guide](docs/guides/monitoring.md)
- [Backup Guide](docs/guides/backup.md)

## Project Structure

```
/
├── .github/                    # GitHub specific files
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   └── workflows/             # GitHub Actions
├── config/                    # Configuration files
│   ├── authelia/             # Authelia config
│   ├── docker/               # Docker compose files
│   ├── nginx/                # Nginx config
│   └── services/             # Service configs
├── docs/                      # Documentation
│   ├── assets/               # Images, diagrams
│   ├── guides/               # User guides
│   └── api/                  # API documentation
├── scripts/                   # Shell scripts
│   ├── install/              # Installation scripts
│   ├── maintenance/          # Maintenance scripts
│   └── utils/                # Utility scripts
├── src/                      # Source code
│   └── web_interface/        # Web UI code
├── tests/                    # Test files
│   ├── integration/         # Integration tests
│   └── unit/               # Unit tests
└── tools/                    # Development tools
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. **Install dependencies**
```bash
# Install system dependencies
sudo ./scripts/install/install_dependencies.sh

# Install web interface dependencies
cd src/web_interface
npm install
```

2. **Start development server**
```bash
npm run dev
```

3. **Run tests**
```bash
npm test
```

See [Development Guide](docs/guides/development.md) for more details.

## Support

If you encounter any issues:

1. Check the [Troubleshooting Guide](docs/guides/troubleshooting.md)
2. Run the debug collection tool:
```bash
sudo ./scripts/utils/collect_debug_info.sh
```
3. [Open an issue](../../issues/new/choose) with the debug information

## Security

- All services are protected by Authelia 2FA
- Fail2Ban integration for brute force protection
- VPN support for anonymous downloads
- Regular security updates
- SSL/TLS encryption

See [Security Guide](docs/guides/security.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- All the amazing open-source projects that make this possible
- The community for their feedback and contributions
- [Docker](https://www.docker.com/) for containerization
- [Plex](https://www.plex.tv/) for media streaming
- [Authelia](https://www.authelia.com/) for authentication

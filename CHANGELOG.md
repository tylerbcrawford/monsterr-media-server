# Changelog

All notable changes to Monsterr Media Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-01-25

### Added
- Watchlistarr Integration
  - Added watchlist synchronization with Trakt and IMDB
  - Automatic sync with Sonarr and Radarr
  - Configuration documentation and setup guide
  - Environment variable support for API keys
- Custom media and downloads location support
  - Users can now specify custom paths during installation
  - Support for external drives and NAS mounts
  - Automatic directory structure creation
  - Updated documentation with path configuration guide
- Enhanced directory management
  - Improved permission handling
  - Structured downloads directory with complete/incomplete folders
  - Better organization of media subdirectories
- Improved domain and DDNS support
  - Integrated DDNS setup directly into installation wizard
  - Added interactive prompts for static/dynamic IP choice
  - Automated Dynu DDNS configuration with systemd service
  - Added comprehensive domain setup documentation
  - Added service subdomain reference table
  - Enhanced support for both static and dynamic IP configurations

- Enhanced security configuration
  - Added conditional security feature installation
  - Improved UFW configuration with custom SSH port support
  - Added proper checks for enabled security features
  - Added clear warning messages for disabled security
  - Enhanced logging and error handling in scripts

## [1.0.0] - 2024-01-20

### Added
- Initial release of Monsterr Media Server
- Automated installation and setup scripts
- Docker Compose configuration for all services
- Web-based configuration interface
- Core media services:
  - Plex Media Server
  - Sonarr, Radarr, Lidarr, Readarr
  - Bazarr for subtitles
  - Audiobookshelf and Calibre-Web
- Download management:
  - qBittorrent with VPN integration
  - NZBGet
  - Prowlarr
- Security features:
  - Authelia two-factor authentication
  - Fail2Ban integration
  - Nginx Proxy Manager
  - VPN support
- Monitoring and management:
  - Prometheus and Grafana
  - Tautulli
  - Portainer
  - Watchtower
  - Organizr
- Automated backup system
- Comprehensive documentation

### Security
- Implemented secure authentication with Authelia
- Added Fail2Ban for intrusion prevention
- Configured secure reverse proxy with Nginx Proxy Manager
- Integrated VPN support for anonymous downloads

## [0.9.0] - 2024-01-15

### Added
- Beta release for testing
- Basic installation scripts
- Initial Docker configurations
- Preliminary documentation

### Changed
- Refined installation process
- Updated service configurations
- Improved error handling

### Fixed
- Permission issues in media directories
- Network configuration problems
- Service dependency ordering

## [0.8.0] - 2024-01-10

### Added
- Alpha release for internal testing
- Proof of concept implementation
- Basic service structure

### Known Issues
- Installation process needs refinement
- Documentation incomplete
- Security features not fully implemented

## Future Plans

### [1.1.0] - Planned
- Enhanced monitoring capabilities
- Additional media organization tools
- Improved backup solutions
- Extended documentation

### [1.2.0] - Planned
- Multi-architecture support
- Advanced networking features
- Enhanced security options
- Performance optimizations

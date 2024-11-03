# Changelog

All notable changes to Monsterr Media Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

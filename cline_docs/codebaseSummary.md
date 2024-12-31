# Codebase Summary

## Key Components & Their Interactions

### Installation Scripts
- **install_media_server.sh**: Entry point
  - Launches setup wizard
  - Handles initial system checks
  - Coordinates overall installation process

- **setup_media_server.sh**: Main setup script
  - Orchestrates component installation
  - Manages configuration
  - Handles service deployment

- **setup_wizard.sh**: Configuration interface
  - Collects user preferences
  - Validates inputs
  - Sets up initial configuration

### Script Modules (/scripts)
- **collect_variables.sh**: Environment configuration
- **configure_firewall.sh**: UFW setup
- **configure_nginx_proxy_manager.sh**: Proxy configuration
- **create_directories.sh**: Directory structure setup
- **install_dependencies.sh**: System package installation
- **install_docker.sh**: Docker setup
- **install_fail2ban.sh**: Security configuration
- **launch_services.sh**: Service startup
- **setup_authelia.sh**: Authentication setup
- **setup_backups.sh**: Backup configuration
- **setup_monitoring.sh**: Monitoring implementation

### Web Configuration Interface
- **index.html**: Main interface
- **app.js**: Frontend logic
- **styles.css**: UI styling

## Data Flow

### Configuration Flow
1. User input → setup_wizard.sh
2. setup_wizard.sh → config.env
3. config.env → Individual service configurations
4. Service configurations → Docker containers

### Authentication Flow
1. User request → Nginx Proxy Manager
2. Nginx Proxy Manager → Authelia
3. Authelia → Protected service

### Backup Flow
1. Cron trigger → Backup script
2. Backup script → Configuration files
3. Configuration files → Backup storage

## External Dependencies

### Core Dependencies
- Docker & Docker Compose
- Nginx Proxy Manager
- Authelia
- UFW
- Fail2Ban

### Service Images
- lscr.io/linuxserver/* (Plex, Sonarr, etc.)
- jc21/nginx-proxy-manager
- authelia/authelia
- portainer/portainer-ce

## Recent Significant Changes

### Documentation Updates
- Added comprehensive installation guide
- Enhanced security documentation
- Added monitoring guidelines
- Updated backup procedures

### Security Enhancements
- Implemented Fail2Ban
- Added UFW configuration
- Integrated Authelia
- Added SSL automation

### Structural Changes
- Modularized scripts
- Added web configuration interface
- Improved backup system
- Enhanced monitoring capabilities

## User Feedback Integration

### Requested Features
- Selective service installation
- Improved security options
- Better error handling
- More flexible configuration

### Planned Improvements
- Modular Docker Compose structure
- Enhanced setup wizard
- Improved secret management
- Extended security monitoring

## Current Development Focus

### Primary Objectives
1. Implementing selective service installation
2. Enhancing security configurations
3. Improving error handling
4. Updating documentation

### In Progress
- Service catalog development
- Docker Compose modularization
- Security enhancement implementation
- Documentation updates

### Next Steps
1. Complete service catalog
2. Implement service selection system
3. Update installation scripts
4. Test new features

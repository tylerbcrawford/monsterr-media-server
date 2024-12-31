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
- Added service-specific guides
- Added detailed configuration documentation

### Security Enhancements
- Implemented Fail2Ban with extensible configuration
- Added UFW configuration with custom port support
- Integrated Authelia with secure defaults
- Added SSL automation
- Improved secrets management
- Added security best practices documentation

### Structural Changes
- Modularized scripts with improved error handling
- Implemented service catalog system
- Split Docker Compose into modular components
- Added selective service installation
- Enhanced configuration management
- Improved backup system
- Enhanced monitoring capabilities

### Code Quality Improvements
- Added error handling with set -euo pipefail
- Implemented graceful error handling
- Added colored output for better visibility
- Improved validation and dependency checks

## User Feedback Integration

### Implemented Features
- Selective service installation system
- Modular Docker Compose structure
- Enhanced error handling
- Flexible configuration options
- Improved security measures

### Planned Improvements
- Custom SSH port configuration in UFW
- Extended Fail2Ban protection for all services
- Automated Argon2 hash generation for Authelia
- Resource usage optimization options
- External secrets manager integration

## Current Development Focus

### Primary Objectives
1. Testing and validation of selective installation
2. Enhancing security configurations
3. Resource optimization
4. Documentation refinement

### In Progress
- Pre-deployment testing on fresh Ubuntu VM
- Upgrade path validation
- Performance optimization
- Security hardening

### Next Steps
1. Add custom port configuration for UFW
2. Extend Fail2Ban protection
3. Create Authelia password helper script
4. Implement resource usage recommendations
5. Add external secrets manager support

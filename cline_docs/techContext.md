# Technical Context

## Technology Stack

### Core Infrastructure
- **Container Platform**: Docker + Docker Compose
- **Operating System**: Ubuntu 20.04+ or similar Linux distribution
- **Reverse Proxy**: Nginx Proxy Manager
- **Authentication**: Authelia + Redis
- **Security**: UFW Firewall, Fail2Ban
- **Monitoring**: Prometheus, Grafana, Tautulli
- **Container Management**: Portainer
- **Updates**: Watchtower

### Setup Wizard
- **Frontend Framework**: React 18
- **UI Library**: Material-UI v5
- **State Management**: React Hooks
- **Form Handling**: Formik + Yup
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library

### Backend Services
- **Server**: Express.js
- **API Documentation**: OpenAPI/Swagger
- **Logging**: Winston
- **Security**: Helmet
- **Compression**: Compression middleware
- **Docker API**: Dockerode
- **Process Management**: Node.js child_process

### Media Services
- **Media Server**: Plex
- **TV Management**: Sonarr
- **Movie Management**: Radarr
- **Music Management**: Lidarr
- **Book Management**: Readarr
- **Subtitle Management**: Bazarr
- **Audiobook Server**: Audiobookshelf
- **Ebook Server**: Calibre-Web
- **Book Download**: LazyLibrarian

### Download Management
- **Torrent Client**: qBittorrent with VPN
- **Usenet Client**: NZBGet
- **Indexer Management**: Prowlarr
- **Download Processing**: Unpackerr, Recyclarr

### User Interface
- **Dashboard**: Organizr
- **Request Management**: Overseerr
- **Watchlist**: Watchlist
- **Statistics**: Monitorr

## Development Environment

### Hardware Requirements
- **Minimum**:
  - CPU: 4 cores
  - RAM: 8GB
  - Storage: 20GB base + media storage
- **Recommended**:
  - CPU: 6+ cores
  - RAM: 16GB+
  - Storage: 100GB SSD + 4TB+ HDD
  - Network: Gigabit Ethernet

### Network Configuration
- Required Ports:
  - 80: HTTP
  - 443: HTTPS
  - 81: Nginx Proxy Manager
  - Service-specific ports (32400, 8989, etc.)
- Domain/DNS setup options:
  - Static IP with A records
  - Dynamic DNS (DDNS) support
- VPN integration for secure downloads

### File System Structure
```
/opt/media-server/
├── media/
│   ├── movies/
│   ├── tv/
│   ├── music/
│   ├── books/
│   ├── audiobooks/
│   └── podcasts/
├── downloads/
│   ├── complete/
│   └── incomplete/
└── service_configs/
    ├── plex/
    ├── sonarr/
    ├── radarr/
    └── etc...
```

## Technical Constraints

### Security Requirements
- Two-factor authentication mandatory
- SSL/TLS encryption for all services
- VPN requirement for download services
- Regular security updates via Watchtower
- Intrusion prevention with Fail2Ban

### Performance Considerations
- Media transcoding capabilities
- Network bandwidth requirements
- Storage I/O performance
- Memory allocation for services
- CPU scheduling for concurrent operations

### Scalability Limits
- Container resource allocation
- Storage capacity management
- Network bandwidth constraints
- Backup storage requirements
- Database size limitations

### Maintenance Requirements
- Regular database backups
- Log rotation and management
- Storage cleanup procedures
- Configuration version control
- Update management procedures

## Dependencies

### External Services
- Domain registrar
- DDNS provider (optional)
- VPN service provider
- SSL certificate provider (Let's Encrypt)

### System Dependencies
- Docker Engine
- Docker Compose
- Git
- Node.js (≥18.0.0)
- Basic system utilities
- UFW (Uncomplicated Firewall)

### Frontend Dependencies
- React (^18.2.0)
- React Router (^6.21.1)
- Material-UI (^5.15.1)
- Formik (^2.4.5)
- Yup (^1.3.3)
- Axios (^1.6.2)

### Backend Dependencies
- Express (^4.18.2)
- Cors (^2.8.5)
- Helmet (^7.1.0)
- Winston (^3.11.0)
- Socket.io (^4.7.2)
- Dockerode (^4.0.0)

### Network Dependencies
- Port forwarding capabilities
- DNS resolution
- VPN connectivity
- Internet bandwidth

## Deployment Process

### Installation Methods
1. Automated Installation (Recommended)
   - Setup wizard interface
   - Interactive configuration
   - Automated dependency installation

2. Manual Installation
   - Step-by-step service setup
   - Custom configuration options
   - Greater control over installation

### Configuration Management
- Environment variables
- Service-specific configs
- Network settings
- Storage locations
- Security parameters

### Monitoring & Logging
- Centralized logging
- Performance metrics
- Service health checks
- Resource utilization
- Error tracking
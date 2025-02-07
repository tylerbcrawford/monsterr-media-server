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

### Software Requirements
- **Runtime**: Node.js 18.0.0+
- **Package Manager**: npm 9.0.0+
- **Version Control**: Git
- **Container Runtime**: Docker 24.0.0+
- **Container Orchestration**: Docker Compose v2
- **Build Tools**: Vite, TypeScript

### Development Tools
- **IDE**: VS Code (recommended)
- **Extensions**:
  - ESLint
  - Prettier
  - Docker
  - React Developer Tools
- **Testing Tools**:
  - Jest
  - React Testing Library
  - Supertest
  - Coverage reporting

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

### Repository Structure
```
monsterr-media-server/
├── cline_docs/               # System memory and documentation
├── src/                     # Source code
│   ├── core/               # Core system functionality
│   ├── ui/                 # Web interface components
│   ├── services/          # Service-specific code
│   ├── types/             # TypeScript definitions
│   └── tests/             # Test files
├── docs/                   # Project documentation
│   ├── api/               # API documentation
│   ├── architecture/      # System design docs
│   └── guides/           # User and development guides
├── config/                # Configuration management
│   ├── defaults/         # Default configurations
│   ├── templates/        # Configuration templates
│   ├── docker/          # Docker configurations
│   └── services/        # Service-specific configs
└── scripts/              # Automation scripts
    ├── install/         # Installation scripts
    ├── maintenance/     # System maintenance
    ├── templates/       # Script templates
    └── utils/          # Utility scripts
```

### Media File System Structure
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
- CSRF protection
- Rate limiting
- Input validation

### Performance Considerations
- Media transcoding capabilities
- Network bandwidth requirements
- Storage I/O performance
- Memory allocation for services
- CPU scheduling for concurrent operations
- React application optimization
- API response times

### Scalability Limits
- Container resource allocation
- Storage capacity management
- Network bandwidth constraints
- Backup storage requirements
- Database size limitations
- Concurrent user sessions
- API rate limits

### Maintenance Requirements
- Regular database backups
- Log rotation and management
- Storage cleanup procedures
- Configuration version control
- Update management procedures
- Test suite maintenance
- Documentation updates

## Dependencies

### Frontend Dependencies
- React 18.2.0+
- Material-UI 5.15.0+
- React Router 6.21.0+
- Formik 2.4.0+
- Yup 1.3.0+
- Axios 1.6.0+

### Backend Dependencies
- Express 4.18.0+
- Cors 2.8.0+
- Helmet 7.1.0+
- Winston 3.11.0+
- Dockerode 4.0.0+
- Body Parser 1.20.0+

### Development Dependencies
- Vite 5.0.0+
- Jest 29.7.0+
- React Testing Library 14.1.0+
- ESLint 8.56.0+
- Prettier 3.1.0+
- TypeScript 5.0.0+

### System Dependencies
- Docker Engine
- Docker Compose
- Git
- Node.js
- Basic system utilities
- UFW (Uncomplicated Firewall)

### External Services
- Domain registrar
- DDNS provider (optional)
- VPN service provider
- SSL certificate provider (Let's Encrypt)
- Package registries (npm)
- Container registries

## Deployment Process

### Installation Methods
1. Automated Installation (Recommended)
   - React setup wizard
   - Interactive configuration
   - Automated dependency installation
   - Real-time validation

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
- Test configurations

### Monitoring & Logging
- Centralized logging
- Performance metrics
- Service health checks
- Resource utilization
- Error tracking
- Test coverage reporting
- Build status monitoring
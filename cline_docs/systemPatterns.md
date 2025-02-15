# System Patterns

## Repository Organization Patterns

### 1. Directory Structure
- Modular organization:
  * src/ - All source code and tests
    - core/ - Core system functionality
    - ui/ - Web interface components
    - services/ - Service-specific code
    - types/ - TypeScript definitions
    - tests/ - All test files
  * docs/ - Project documentation
    - api/ - API documentation
    - architecture/ - System design docs
    - guides/ - User and development guides
  * config/ - Configuration management
    - defaults/ - Default configurations
    - templates/ - Configuration templates
    - docker/ - Docker configurations
    - services/ - Service-specific configs
    - examples/ - Example configurations
  * scripts/ - Automation scripts
    - install/ - Installation scripts
    - maintenance/ - System maintenance
    - templates/ - Script templates
    - utils/ - Utility scripts

### 2. File Organization
- Consistent naming conventions:
  * Documentation: kebab-case with category prefixes
  * Source Code: PascalCase for components, camelCase for utilities
  * Scripts: kebab-case with category prefixes
  * Configuration: kebab-case with .template suffix for templates

### 3. Critical Components
- cline_docs/ directory (system memory)
  * Must remain unchanged
  * Contains critical memory bank files
  * Protected from reorganization
- Tests located with corresponding source code
- Configuration templates separate from actual configs
- Clear separation of concerns in directory structure

## Architectural Patterns

### 1. Microservices Architecture
- Containerized services using Docker
- Each service has a single responsibility
- Services communicate over a shared Docker network
- Clear separation of concerns between media management, security, and monitoring

### 2. Domain Management
- **Configuration Layer**
  - Type-safe domain configuration
  - Flexible subdomain management
  - SSL certificate automation
  - DDNS integration
  - Service URL generation

- **Security Layer**
  - SSL/TLS enforcement
  - Automated certificate renewal
  - CORS origin management
  - Security header configuration
  - Rate limiting per domain

- **Proxy Layer**
  - Nginx Proxy Manager integration
  - Dynamic proxy configuration
  - WebSocket support
  - Custom header management
  - Health check integration

### 3. Setup Wizard Architecture
- **Frontend Layer**
  - React-based single-page application
  - Material-UI component library
  - Step-based wizard pattern
  - Real-time validation
  - State management with React hooks

- **Backend Layer**
  - Express.js API server
  - System validation endpoints
  - Configuration management
  - Docker orchestration
  - Deployment automation

### 4. Security Layer
- **Frontend Security**
  - Nginx Proxy Manager for reverse proxy
  - Authelia for two-factor authentication
  - Redis for session management
  - Fail2Ban for intrusion prevention
  - Domain-based access control

- **Download Security**
  - Network isolation for sensitive services
  - IP leak prevention
  - Rate limiting
  - Access control
  - Activity monitoring

### 5. Data Management
- **Volume Management**
  - Persistent storage for configurations
  - Shared media volumes between related services
  - Separate download and media directories
  - Consistent PUID/PGID across services

- **Media Organization**
  - Hierarchical media structure
  - Automated media sorting
  - Centralized download management
  - Metadata management

### 6. Service Organization
- **Core Infrastructure (Required)**
  - Nginx Proxy Manager
  - Authelia authentication
  - Redis session management
  - Fail2Ban security
  - Portainer management
  - System monitoring

- **Optional Profiles**
  - Media services profile
  - Download management profile
  - Book services profile
  - Interface profile

- **Dependency Management**
  - Automated dependency resolution
  - Service startup ordering
  - Health check integration
  - Failure recovery

### 7. Network Management
- **DDNS Integration**
  - Multi-provider DDNS support
  - Automatic IP detection and updates
  - Configurable update intervals
  - IP type selection (dynamic/static)
  - Secure credential management

- **Domain Management**
  - Automated DNS verification
  - SSL certificate management
  - Subdomain configuration
  - Proxy rule generation
  - Domain health monitoring

- **Network Monitoring**
  - IP change detection
  - Update status tracking
  - Connection health monitoring
  - DNS resolution verification
  - SSL certificate management

### 8. Monitoring & Maintenance
- **System Monitoring**
  - Prometheus metrics collection
  - Grafana visualization
  - Service health monitoring
  - Resource usage tracking
  - Container management through Portainer

- **Automated Maintenance**
  - Watchtower for updates
  - Automated backups
  - Log rotation
  - Health checks
  - Certificate renewal

## Technical Decisions

### 1. Frontend Implementation
- React for dynamic UI
- Material-UI for consistent design
- Vite for build tooling
- Jest for testing
- Real-time validation

### 2. Backend Implementation
- Express.js for API server
- Docker API integration
- WebSocket for real-time updates
- JWT for authentication
- Rate limiting

### 3. Container Orchestration
- Docker Compose with profiles
- Bridge network for communication
- Host network for specific services
- Automatic container recovery
- Centralized management through Portainer

### 4. Configuration Management
- Environment variables
- External config files
- Service templates
- Version control
- Centralized management interface
- Domain configuration validation

### 5. Testing Strategy
- Component testing
- API integration testing
- End-to-end testing
- Security scanning
- Performance testing
- Domain configuration testing

### 6. CI/CD Pipeline
- GitHub Actions
- Automated testing
- Security scanning
- Docker builds
- Automated releases

## Design Principles

### 1. Security First
- Two-factor authentication
- Intrusion prevention
- Secure proxy management
- Regular security updates
- Domain-based security

### 2. User Experience
- Intuitive setup process
- Real-time feedback
- Progressive disclosure
- Error prevention
- Guided configuration
- Domain management UI

### 3. Modularity
- Independent services
- Pluggable components
- Clear boundaries
- Minimal dependencies
- Profile-based deployment

### 4. Maintainability
- Automated updates
- Centralized monitoring
- Consistent configuration
- Health checks
- Documentation
- Domain monitoring

### 5. Scalability
- Independent scaling
- Resource isolation
- Load management
- Performance monitoring
- Resource optimization

### 6. Reliability
- Health monitoring
- Automated recovery
- Backup systems
- Error handling
- Logging
- Domain resilience

## Implementation Patterns

### 1. Frontend Patterns
- Component composition
- Custom hooks
- Form validation
- Error boundaries
- Responsive design
- Domain configuration UI

### 2. Backend Patterns
- RESTful API design
- Middleware layers
- Service abstraction
- Error handling
- Rate limiting
- Domain validation

### 3. Testing Patterns
- Component testing
- Integration testing
- Mock services
- Test fixtures
- Coverage reporting
- Domain configuration testing

### 4. Deployment Patterns
- Rolling updates
- Health checks
- Backup verification
- Configuration validation
- Dependency resolution
- Domain verification

### 5. Security Patterns
- Authentication middleware
- Authorization checks
- Input validation
- Rate limiting
- Secure communication
- Domain-based security

### 6. Monitoring Patterns
- Metric collection
- Alert management
- Log aggregation
- Performance tracking
- Health checking
- Domain monitoring
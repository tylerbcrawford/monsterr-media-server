# System Patterns

## Architectural Patterns

### 1. Microservices Architecture
- Containerized services using Docker
- Each service has a single responsibility
- Services communicate over a shared Docker network
- Clear separation of concerns between media management, security, and monitoring

### 2. Setup Wizard Architecture
- **Frontend Layer**
  - React-based single-page application
  - Material-UI component library
  - Step-based wizard pattern
  - Real-time validation
  - State management for configuration

- **Backend Layer**
  - Express.js API server
  - System validation endpoints
  - Configuration management
  - Docker orchestration
  - Deployment automation

### 3. Security Layer
- **Frontend Security**
  - Nginx Proxy Manager for reverse proxy
  - Authelia for two-factor authentication
  - Redis for session management
  - Fail2Ban for intrusion prevention

- **Download Security**
  - VPN integration for secure downloads
  - Separate VPN container for NZBGet
  - Network isolation for sensitive services

### 4. Data Management
- **Volume Management**
  - Persistent storage for configurations
  - Shared media volumes between related services
  - Separate download and media directories
  - Consistent PUID/PGID across services

- **Media Organization**
  - Hierarchical media structure (movies, tv, music, books)
  - Automated media sorting and categorization
  - Centralized download management

### 5. Monitoring & Maintenance
- **System Monitoring**
  - Prometheus for metrics collection
  - Grafana for visualization
  - Tautulli for Plex statistics
  - Monitorr for service health monitoring

- **Automated Maintenance**
  - Watchtower for automatic updates
  - Recyclarr for configuration management
  - Unpackerr for automated extraction

## Technical Decisions

### 1. Setup Wizard Implementation
- React for dynamic user interface
- Material-UI for consistent design
- Express.js for backend API
- Real-time validation pattern
- Progressive configuration flow

### 2. Container Orchestration
- Docker Compose for service orchestration
- Bridge network for internal communication
- Host network mode for specific services
- Automatic container restart policies

### 3. Service Dependencies
- Clearly defined service dependencies
- Proper startup order management
- Shared resource access control
- Automated dependency resolution

### 4. Configuration Management
- Environment variables for sensitive data
- External configuration files
- Consistent configuration structure
- Version-controlled service definitions

### 5. Network Architecture
- Isolated proxy network
- VPN integration for download services
- Port mapping for required services
- Internal service discovery

### 6. Resource Management
- Volume mapping for persistence
- Shared resource access
- Consistent environment variables
- Unified user/group management

## Design Principles

### 1. Security First
- Two-factor authentication
- VPN for sensitive traffic
- Intrusion prevention
- Secure proxy management

### 2. User Experience
- Intuitive setup process
- Clear error messages
- Real-time feedback
- Progressive disclosure
- Guided configuration

### 3. Modularity
- Independent service scaling
- Pluggable components
- Clear service boundaries
- Minimal inter-service dependencies

### 4. Maintainability
- Automated updates
- Centralized monitoring
- Consistent configuration
- Health checks and logging

### 5. Scalability
- Independent service scaling
- Resource isolation
- Efficient resource sharing
- Load management

### 6. Error Handling
- Graceful degradation
- Clear error messages
- Recovery procedures
- Validation feedback
- User guidance

## Implementation Patterns

### 1. Frontend Patterns
- Step wizard pattern
- Form validation pattern
- Real-time feedback pattern
- Progressive disclosure
- Responsive design

### 2. Backend Patterns
- RESTful API design
- Middleware pattern
- Service layer pattern
- Repository pattern
- Error handling middleware

### 3. Deployment Patterns
- Rolling updates
- Health checks
- Automatic recovery
- Configuration validation
- Dependency management

### 4. Testing Patterns
- Unit testing
- Integration testing
- End-to-end testing
- Component testing
- API testing

### 5. Security Patterns
- Authentication middleware
- Authorization checks
- Input validation
- Rate limiting
- Secure communication
# System Patterns

## Architecture Overview

### 1. Core Services
- **ConfigService**: Central configuration management
- **SystemService**: System-level operations
- **AuthService**: Authentication and authorization
- **DomainService**: Domain and SSL management

### 2. Service Architecture
```
├── Core Services
│   ├── ConfigService
│   │   └── Configuration persistence
│   ├── SystemService
│   │   └── System operations
│   ├── AuthService
│   │   └── Authentication
│   └── DomainService
│       ├── DNS validation
│       ├── SSL management
│       └── Real-time updates
├── Controllers
│   ├── API endpoints
│   ├── WebSocket handlers
│   └── Validation logic
└── UI Components
    ├── Setup wizard
    ├── Real-time feedback
    └── Progress indicators
```

### 3. Domain Integration Pattern
```
User Request → Setup Wizard → DomainController
                                  ↓
                            DomainService
                            ↙          ↘
                     DNS Validation  SSL Validation
                            ↓          ↓
                      Real-time Updates (WebSocket)
```

## Design Patterns

### 1. Service Layer Pattern
- Clear separation of concerns
- Domain logic encapsulation
- Centralized business rules
- Reusable validation logic

### 2. Controller Pattern
- Request handling
- Input validation
- Response formatting
- Error handling

### 3. WebSocket Integration
- Real-time updates
- Bidirectional communication
- Event-driven architecture
- Connection management

### 4. Configuration Management
- Environment-based config
- Secure credential storage
- Dynamic updates
- Validation rules

## Data Flow

### 1. Domain Validation Flow
```
1. User Input → Validation Request
2. DNS Check → Propagation Verification
3. SSL Setup → Certificate Issuance
4. Real-time Status Updates
```

### 2. Configuration Flow
```
1. User Settings → Config Validation
2. Template Processing → File Generation
3. Service Configuration → Proxy Setup
4. Health Checks → Status Monitoring
```

## Security Patterns

### 1. Authentication
- Centralized auth service
- Token-based authentication
- Role-based access control
- Session management

### 2. SSL/TLS
- Automated certificate management
- Forced HTTPS
- Secure headers
- Certificate renewal

### 3. Network Security
- Proxy configuration
- Rate limiting
- Fail2Ban integration
- DDNS management

## Testing Patterns

### 1. Unit Testing
- Service layer tests
- Controller tests
- WebSocket tests
- Validation logic tests

### 2. Integration Testing
- API endpoint tests
- Configuration tests
- DNS validation tests
- SSL verification tests

### 3. End-to-End Testing
- Setup wizard flow
- Domain configuration
- Real-time updates
- Error scenarios

## Monitoring Patterns

### 1. Health Checks
- Service status
- DNS propagation
- SSL certificate validity
- Proxy connectivity

### 2. Performance Monitoring
- Response times
- WebSocket latency
- Resource usage
- Error rates

### 3. Security Monitoring
- Access logs
- Failed attempts
- Certificate expiration
- DNS changes

## Error Handling

### 1. Validation Errors
- Input validation
- DNS verification
- SSL configuration
- Proxy setup

### 2. Runtime Errors
- Network issues
- Service failures
- Configuration errors
- Resource constraints

### 3. Recovery Patterns
- Automatic retries
- Fallback options
- Rollback procedures
- Error notifications
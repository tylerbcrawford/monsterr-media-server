# Portainer Core Service Integration Plan

## Overview
Integrate Portainer as a required core service alongside existing core infrastructure services (Nginx Proxy Manager, Authelia, Redis, and Fail2ban).

## Required Changes

### 1. Service Catalog Updates
- Move Portainer from monitoring category to core services
- Mark Portainer as required: true
- Update service configuration:
  ```yaml
  portainer:
    name: "Portainer"
    description: "Docker management interface"
    image: "portainer/portainer-ce:latest"
    required: true
    resources:
      cpu: 1
      memory: 256
    ports:
      - "9000:9000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./portainer/data:/data
    depends_on:
      - nginx-proxy-manager
      - authelia
  ```

### 2. Docker Compose Updates
- Add Portainer to core services section
- Configure with proper security settings:
  ```yaml
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    environment:
      - TZ=UTC
    ports:
      - "9000:9000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./portainer/data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000"]
      interval: 30s
      timeout: 10s
      retries: 3
    depends_on:
      nginx-proxy-manager:
        condition: service_healthy
      authelia:
        condition: service_healthy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.portainer.rule=Host(`portainer.${DOMAIN}`)"
      - "traefik.http.routers.portainer.entrypoints=websecure"
      - "traefik.http.routers.portainer.tls=true"
      - "traefik.http.services.portainer.loadbalancer.server.port=9000"
  ```

### 3. Setup Wizard UI Updates
- Move Portainer to Core Services section
- Add required flag
- Update resource calculations
- Add dependency indicators

### 4. Nginx Configuration
- Add reverse proxy configuration:
  ```nginx
  location /portainer/ {
    proxy_pass http://portainer:9000/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
  }
  ```

### 5. Authelia Configuration
- Add access control rules:
  ```yaml
  access_control:
    rules:
      - domain: portainer.${DOMAIN}
        policy: two_factor
  ```

### 6. Installation Scripts
- Update scripts/install/setup_core_services.sh to include Portainer setup
- Add Portainer-specific configuration steps
- Add volume creation and permissions setup

### 7. Documentation Updates
- Update core services documentation
- Add Portainer configuration guide
- Update architecture diagrams
- Update security documentation

## Implementation Steps

1. Switch to Code mode to:
   - Update service catalog
   - Update docker-compose configuration
   - Update setup wizard UI

2. Create Portainer-specific configuration files:
   - Nginx reverse proxy config
   - Authelia access rules
   - Volume initialization script

3. Update documentation:
   - Core services overview
   - Installation guide
   - Security considerations

4. Test integration:
   - Verify Portainer starts with core services
   - Test authentication flow
   - Validate reverse proxy access
   - Check volume persistence
   - Verify security settings

## Security Considerations

1. Access Control:
   - Enforce 2FA through Authelia
   - Restrict access to admin users only
   - Use secure HTTPS connection

2. Container Security:
   - Read-only access to Docker socket
   - No privilege escalation
   - Resource limits enforced

3. Data Protection:
   - Persistent volume for configuration
   - Regular backups of Portainer data
   - Secure communication between services

## Next Steps

1. Switch to Code mode to implement file changes
2. Test changes in development environment
3. Update documentation
4. Perform security audit
5. Deploy to staging for validation
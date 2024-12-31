# Current Task: Implementing Selective Service Installation

## Current Objectives
- Implement a flexible system for users to choose which services to install
- Enhance security configurations
- Improve error handling and user feedback

## Context
Based on the project review and feedback, we need to implement an "opt-in/out" installation approach. This will allow users to selectively install only the services they need, improving resource usage and user experience.

## Implementation Plan

### Phase 1: Service Catalog Creation ✓
1. Created service catalog in YAML format
   - Defined all available services
   - Added descriptions and dependencies
   - Set required/optional states
   - Organized services into logical groups

### Phase 2: Script Modifications ✓
1. Added error handling improvements
   - Implemented set -euo pipefail
   - Added graceful error handling with trap
   - Added colored output for better visibility
   - Improved error messages with line numbers

2. Created service selection system
   - Implemented interactive yes/no prompts
   - Added automatic dependency resolution
   - Added service validation
   - Created select_services.sh script

### Phase 3: Docker Compose Restructuring ✓
1. Split docker-compose.yml into modular components
   - docker-compose.core.yml (required services)
   - docker-compose.media.yml (media services)
   - docker-compose.downloads.yml (download services)
   - docker-compose.extras.yml (utility services)

2. Implemented dynamic compose file generation
   - Added compose file combination logic
   - Implemented dependency resolution
   - Added configuration validation
   - Created sample_config.env with documentation

### Phase 4: Testing & Validation
1. Pre-deployment Testing
   - Test on fresh Ubuntu VM
   - Verify all scripts run without errors
   - Confirm Docker container health
   - Validate upgrade paths

2. Performance Testing
   - Monitor resource usage
   - Document hardware recommendations
   - Test selective installation impact
   - Verify Watchtower updates

### Phase 5: Security Enhancements
1. Improve UFW Configuration
   - Add custom SSH port prompts
   - Implement port validation
   - Add user confirmation
   - Document port requirements

2. Enhance Fail2Ban Protection
   - Add recommended rules for services
   - Extend monitoring beyond SSH/Nginx
   - Implement custom jail configurations
   - Add log monitoring

3. Improve Authentication Security
   - Create Authelia password helper script
   - Add secure password generation
   - Implement external secrets support
   - Document security best practices

### Phase 6: Resource Optimization
1. Performance Improvements
   - Add resource usage monitoring
   - Implement usage recommendations
   - Document optimization strategies
   - Add container resource limits

## Next Steps
1. Begin pre-deployment testing on fresh Ubuntu VM
2. Create Authelia password helper script:
   ```bash
   # Example implementation
   docker run --rm authelia/authelia:latest authelia hash-password 'MyPlaintextPassword'
   ```
3. Add UFW custom port configuration
4. Implement recommended Fail2Ban rules
5. Document resource optimization guidelines

## Related Tasks from Roadmap
- Service Management > Service catalog implementation
- Service Management > Interactive service selection
- Security Enhancements > Improved secret management
- User Experience > Enhanced setup wizard

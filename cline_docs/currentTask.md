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

### Phase 4: Security Enhancements (Next Steps)
1. Improve secret management
   - Add sample_config.env
   - Implement password hashing helper
   - Add external secrets documentation

2. Enhance security configurations
   - Extend Fail2Ban protection
   - Improve firewall configuration
   - Add security best practices

## Next Steps
1. Test the service selection system thoroughly
2. Implement security enhancements
   - Add password hashing helper script
   - Improve secret management
   - Extend Fail2Ban protection
3. Update main installation scripts to use new modular system
4. Update documentation with new installation process

## Related Tasks from Roadmap
- Service Management > Service catalog implementation
- Service Management > Interactive service selection
- Security Enhancements > Improved secret management
- User Experience > Enhanced setup wizard

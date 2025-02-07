# Repository Structure

## Overview
This document outlines the organization and structure of the Monsterr Media Server repository. The repository follows a clear, modular structure to improve maintainability and developer experience.

## Directory Structure

```
monsterr-media-server/
├── cline_docs/               # CRITICAL: Memory system documentation
├── docs/                     # Project documentation
│   ├── api/                 # API documentation
│   ├── architecture/        # System design documentation
│   └── guides/             # User and development guides
├── config/                  # Configuration files
│   ├── defaults/           # Default configurations
│   ├── templates/          # Configuration templates
│   ├── docker/            # Docker configurations
│   ├── services/          # Service-specific configs
│   ├── nginx/            # NGINX configurations
│   ├── fail2ban/         # Fail2Ban configurations
│   │   ├── filter.d/     # Custom Fail2Ban filters
│   │   └── jail.d/       # Fail2Ban jail configurations
│   └── vnc/              # VNC service configurations
├── src/                    # Source code
│   ├── core/              # Core system functionality
│   ├── ui/                # Web interface components
│   ├── services/          # Service-specific code
│   ├── types/             # TypeScript definitions
│   └── tests/             # Test files
├── scripts/                # Automation scripts
│   ├── install/           # Installation scripts
│   ├── maintenance/       # System maintenance
│   ├── templates/         # Script templates
│   └── utils/             # Utility scripts
└── tools/                 # Development tools

## File Naming Conventions

### Documentation
- Use kebab-case for filenames
- Add category prefixes (e.g., guide-installation.md)
- Include version numbers where applicable

### Source Code
- React components: PascalCase
- Utilities: camelCase
- Tests: componentName.test.jsx
- Types: componentName.types.ts

### Scripts
- Use kebab-case
- Add category prefix (install-, config-, maintain-)
- Include .sh extension for shell scripts

### Configuration
- Use kebab-case
- Add .template suffix for templates
- Use .env for environment files

## Important Notes

1. The cline_docs directory is critical for system memory and must not be moved or renamed
2. All documentation should be kept up to date with any structural changes
3. Import paths in source code should be updated when files are moved
4. Test files should be located close to their corresponding source code
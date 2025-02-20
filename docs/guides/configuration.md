# Configuration Guide

## Overview

The Monsterr Media Server uses a modular configuration system, separating concerns into distinct configuration files. This approach simplifies management of different system aspects and enables selective service activation.

## Configuration Structure

```
config/
├── defaults/           # Default configuration files
│   ├── base.env       # Core system settings
│   ├── media-services.env
│   ├── security-services.env
│   └── monitoring-services.env
├── schemas/           # JSON/YAML validation schemas
│   ├── nginx-proxy-config.schema.json
│   └── service-catalog.schema.yaml
├── templates/         # Configuration templates
│   ├── environment.template.env
│   └── nginx-proxy-config.template.json
└── services/         # Service-specific configurations
    └── catalog.yml   # Service catalog definition
```

## Getting Started

1.  Copy the environment template:

    ```bash
    cp config/templates/environment.template.env .env
    ```

2.  Edit the `.env` file to enable required services:

    *   Uncomment service-specific configuration sources.
    *   Customize environment variables as needed.

3.  Validate your configuration:

    *   Use provided schema files to validate JSON/YAML configurations.
    *   Test environment variable resolution.
    *   Verify service dependencies.

## Configuration Modules

### Base Configuration (Required)

The base configuration (`defaults/base.env`) contains core system settings:

*   System user configuration
*   Storage paths
*   Network settings
*   Basic security parameters
*   Database configuration
*   Email settings

### Media Services Configuration (Optional)

Media service settings (`defaults/media-services.env`) include:

*   Plex configuration
*   Sonarr/Radarr settings
*   Download client setup
*   Media path definitions
*   Quality profiles

### Security Services Configuration (Optional)

Security settings (`defaults/security-services.env`) cover:

*   Authelia configuration
*   Fail2Ban settings
*   NGINX Proxy Manager
*   SSL/TLS parameters
*   VNC security

### Monitoring Services Configuration (Optional)

Monitoring configuration (`defaults/monitoring-services.env`) includes:

*   Prometheus settings
*   Grafana configuration
*   System metrics
*   Alert thresholds
*   Notification settings

## Service Catalog

The service catalog (`services/catalog.yml`) defines:

*   Available services
*   Service categories
*   Resource requirements
*   Dependencies
*   Volume mappings

Validate the catalog using the schema:

```bash
yamllint -c config/schemas/service-catalog.schema.yaml config/services/catalog.yml
```

## Configuration Best Practices

1.  **Environment Variables:**
    *   Keep sensitive data in the `.env` file.
    *   Use descriptive variable names.
    *   Document all custom variables.
    *   Use appropriate default values.

2.  **Service Configuration:**
    *   Enable only required services.
    *   Verify resource allocations.
    *   Check service dependencies.
    *   Test configuration changes.

3.  **Security Considerations:**
    *   Protect sensitive configurations.
    *   Use strong passwords.
    *   Enable appropriate logging.
    *   Regular security audits.

4.  **Maintenance:**
    *   Regular configuration backups.
    *   Document custom changes.
    *   Version control configurations.
    *   Update documentation.

## Validation and Testing

### Schema Validation

```bash
# Validate NGINX proxy configuration
jsonschema -i config/nginx-proxy-config.json config/schemas/nginx-proxy-config.schema.json

# Validate service catalog
yamllint -c config/schemas/service-catalog.schema.yaml config/services/catalog.yml
```

### Environment Testing

```bash
# Test environment variable resolution
source .env
echo $BASE_PATH  # Should show configured path
```

### Service Validation

```bash
# Verify service configuration
docker-compose config
```

## Troubleshooting

Common configuration issues and solutions:

1.  **Missing Environment Variables:**
    *   Check that the `.env` file exists.
    *   Verify variable names.
    *   Check file permissions.

2.  **Service Conflicts:**
    *   Verify port assignments.
    *   Check resource allocations.
    *   Validate dependencies.

3.  **Path Issues:**
    *   Verify directory permissions.
    *   Check path variables.
    *   Validate volume mappings.

4.  **Schema Validation Errors:**
    *   Check JSON/YAML syntax.
    *   Verify required fields.
    *   Validate data types.

## Additional Resources

*   [Installation Guide](installation.md)
*   [Security Guide](security.md)
*   [Monitoring Guide](monitoring.md)
*   [Troubleshooting Guide](troubleshooting.md)
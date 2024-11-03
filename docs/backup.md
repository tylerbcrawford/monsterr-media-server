# Backup and Restore Guide

This guide covers backup and restore procedures for the Monsterr Media Server, ensuring data safety and system recovery capabilities.

## Table of Contents
- [Backup Strategy](#backup-strategy)
- [Automated Backups](#automated-backups)
- [Manual Backups](#manual-backups)
- [Restore Procedures](#restore-procedures)
- [Disaster Recovery](#disaster-recovery)
- [Best Practices](#best-practices)

## Backup Strategy

### What to Backup

1. **Configuration Files**
   - Docker Compose files
   - Environment variables
   - Service configurations

2. **Application Data**
   - Database files
   - User preferences
   - Service metadata

3. **Media Files** (Optional)
   - Movies
   - TV Shows
   - Music
   - Books

### Backup Hierarchy

```
/opt/media-server/backups/
├── daily/
│   ├── configs/
│   ├── databases/
│   └── logs/
├── weekly/
│   ├── configs/
│   └── databases/
└── monthly/
    └── full-backup/
```

## Automated Backups

### Daily Backup Script

```bash
#!/bin/bash
# /opt/media-server/scripts/backup.sh

# Set backup directory
BACKUP_DIR="/opt/media-server/backups/daily/$(date +%Y%m%d)"
RETENTION_DAYS=7

# Create backup directories
mkdir -p "$BACKUP_DIR"/{configs,databases,logs}

# Backup configurations
tar -czf "$BACKUP_DIR/configs/docker-configs.tar.gz" \
    ./*/config \
    ./docker-compose.yml \
    ./config.env

# Backup databases
for service in plex sonarr radarr; do
    docker-compose exec -T $service \
        sqlite3 /config/database.db ".backup '/config/backup.db'"
    cp "./services/$service/config/backup.db" \
        "$BACKUP_DIR/databases/$service.db"
done

# Cleanup old backups
find /opt/media-server/backups/daily -type d -mtime +$RETENTION_DAYS -exec rm -rf {} +
```

### Backup Schedule

1. **Cron Configuration**
   ```bash
   # /etc/cron.d/media-server-backup
   0 2 * * * root /opt/media-server/scripts/backup.sh
   0 3 * * 0 root /opt/media-server/scripts/weekly-backup.sh
   0 4 1 * * root /opt/media-server/scripts/monthly-backup.sh
   ```

2. **Retention Policy**
   - Daily backups: 7 days
   - Weekly backups: 4 weeks
   - Monthly backups: 6 months

## Manual Backups

### Configuration Backup

```bash
# Backup all configuration directories
tar -czf configs_backup.tar.gz \
    ./*/config \
    ./docker-compose.yml \
    ./config.env \
    ./scripts

# Backup specific service
tar -czf plex_config.tar.gz ./plex/config
```

### Database Backup

```bash
# Plex Database
docker-compose exec plex \
    sqlite3 /config/Library/Application\ Support/Plex\ Media\ Server/Plug-in\ Support/Databases/com.plexapp.plugins.library.db \
    ".backup '/config/plexdb_backup.db'"

# Sonarr Database
docker-compose exec sonarr \
    sqlite3 /config/sonarr.db ".backup '/config/sonarr_backup.db'"
```

### Media Backup (Optional)

```bash
# Backup media libraries
rsync -av --progress /opt/media-server/media/ /backup/media/

# Backup with exclusions
rsync -av --progress \
    --exclude='*.partial~' \
    --exclude='.DS_Store' \
    /opt/media-server/media/ /backup/media/
```

## Restore Procedures

### Full System Restore

1. **Prerequisites**
   ```bash
   # Install required packages
   apt update
   apt install -y docker.io docker-compose
   ```

2. **Configuration Restore**
   ```bash
   # Extract configurations
   tar -xzf configs_backup.tar.gz -C /opt/media-server/
   
   # Set permissions
   chown -R $PUID:$PGID /opt/media-server
   ```

3. **Service Restoration**
   ```bash
   # Start services
   cd /opt/media-server
   docker-compose up -d
   ```

### Individual Service Restore

1. **Plex Restore**
   ```bash
   # Stop Plex
   docker-compose stop plex
   
   # Restore configuration
   tar -xzf plex_config.tar.gz -C /opt/media-server/
   
   # Start Plex
   docker-compose up -d plex
   ```

2. **Database Restore**
   ```bash
   # Restore Sonarr database
   docker-compose stop sonarr
   cp sonarr_backup.db /opt/media-server/sonarr/config/sonarr.db
   docker-compose up -d sonarr
   ```

## Disaster Recovery

### Recovery Plan

1. **System Failure**
   ```bash
   # Quick recovery script
   #!/bin/bash
   
   # Stop all services
   docker-compose down
   
   # Restore latest backup
   ./scripts/restore-latest.sh
   
   # Start services
   docker-compose up -d
   ```

2. **Data Corruption**
   ```bash
   # Verify backup integrity
   ./scripts/verify-backup.sh
   
   # Restore from last known good backup
   ./scripts/restore-backup.sh --timestamp="YYYYMMDD"
   ```

### Verification Procedures

1. **Backup Testing**
   ```bash
   # Test restore in isolated environment
   docker-compose -f docker-compose.test.yml \
       --env-file test.env \
       up -d
   ```

2. **Integrity Checks**
   ```bash
   # Verify backup checksums
   sha256sum -c backup_checksums.txt
   
   # Test database integrity
   sqlite3 backup.db "PRAGMA integrity_check;"
   ```

## Best Practices

### Security

1. **Encryption**
   ```bash
   # Encrypt backup
   gpg --symmetric --cipher-algo AES256 backup.tar.gz
   
   # Decrypt backup
   gpg --decrypt backup.tar.gz.gpg > backup.tar.gz
   ```

2. **Access Control**
   ```bash
   # Set secure permissions
   chmod 600 backup.tar.gz
   chown root:root backup.tar.gz
   ```

### Monitoring

1. **Backup Status**
   ```bash
   # Check backup success
   if [ $? -eq 0 ]; then
       echo "Backup successful"
       notify-admin "Backup completed successfully"
   else
       echo "Backup failed"
       notify-admin "Backup failed - manual intervention required"
   fi
   ```

2. **Space Management**
   ```bash
   # Monitor backup space
   df -h /opt/media-server/backups
   
   # Cleanup old backups if needed
   ./scripts/cleanup-old-backups.sh
   ```

## Additional Resources
- [Installation Guide](installation.md)
- [Security Guide](security.md)
- [Services Guide](services.md)
- [Monitoring Guide](monitoring.md)

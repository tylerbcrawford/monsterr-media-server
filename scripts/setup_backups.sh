#!/bin/bash

# Create backup script
cat <<EOL > backup.sh
#!/bin/bash

# Directories to backup
BACKUP_SOURCES=(
    "./config"
    "./media"
    "./downloads"
)

# Backup destination
BACKUP_DEST="./backups/backup_\$(date +%Y%m%d%H%M%S).tar.gz"

# Create the backup
tar -czvf "\$BACKUP_DEST" "\${BACKUP_SOURCES[@]}"

# Encrypt the backup (optional)
# gpg --symmetric --cipher-algo aes256 "\$BACKUP_DEST"

# Remove backups older than 7 days
find "./backups/" -type f -mtime +7 -delete
EOL

chmod +x backup.sh

# Schedule backup script in cron
(crontab -l ; echo "0 2 * * * /opt/media-server/backup.sh") | crontab -

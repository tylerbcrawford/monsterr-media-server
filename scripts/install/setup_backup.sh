#!/bin/bash

# Exit on error, undefined variables, and pipe failures
set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root"
    exit 1
fi

# Create backup directories
setup_directories() {
    log_info "Creating backup directories..."
    
    # Default backup location
    BACKUP_ROOT="${BACKUP_DIR:-/opt/media-server/backups}"
    mkdir -p "$BACKUP_ROOT"
    
    # Create log directory
    mkdir -p /var/log/monsterr
    
    # Set permissions
    chown -R "${PUID:-1000}:${PGID:-1000}" "$BACKUP_ROOT"
    chmod -R 755 "$BACKUP_ROOT"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    if command -v apt-get >/dev/null 2>&1; then
        # Debian/Ubuntu
        apt-get update
        apt-get install -y rsync
    elif command -v dnf >/dev/null 2>&1; then
        # Fedora/RHEL
        dnf install -y rsync
    elif command -v pacman >/dev/null 2>&1; then
        # Arch Linux
        pacman -Sy --noconfirm rsync
    fi
}

# Set up systemd services and timers
setup_systemd() {
    log_info "Setting up systemd services and timers..."
    
    # Copy service and timer files
    cp "$SCRIPT_DIR/monsterr-backup.service" /etc/systemd/system/
    cp "$SCRIPT_DIR/monsterr-backup-daily.timer" /etc/systemd/system/
    cp "$SCRIPT_DIR/monsterr-backup-weekly.timer" /etc/systemd/system/
    cp "$SCRIPT_DIR/monsterr-backup-monthly.timer" /etc/systemd/system/
    
    # Reload systemd
    systemctl daemon-reload
    
    # Enable and start timers
    systemctl enable monsterr-backup-daily.timer
    systemctl enable monsterr-backup-weekly.timer
    systemctl enable monsterr-backup-monthly.timer
    
    systemctl start monsterr-backup-daily.timer
    systemctl start monsterr-backup-weekly.timer
    systemctl start monsterr-backup-monthly.timer
}

# Set up log rotation
setup_log_rotation() {
    log_info "Setting up log rotation..."
    
    cat > /etc/logrotate.d/monsterr-backup << 'EOF'
/var/log/monsterr/backup*.log {
    weekly
    rotate 4
    compress
    delaycompress
    missingok
    notifempty
    create 0640 root root
}
EOF
}

# Update configuration
update_config() {
    log_info "Updating configuration..."
    
    if [ ! -f "$PROJECT_DIR/config.env" ]; then
        log_warn "config.env not found, creating with default backup settings..."
        cat >> "$PROJECT_DIR/config.env" << 'EOF'

# Backup Configuration
BACKUP_DIR=/opt/media-server/backups
BACKUP_RETENTION_DAILY=7
BACKUP_RETENTION_WEEKLY=4
BACKUP_RETENTION_MONTHLY=2
EOF
    else
        if ! grep -q "BACKUP_DIR" "$PROJECT_DIR/config.env"; then
            log_info "Adding backup configuration to config.env..."
            cat >> "$PROJECT_DIR/config.env" << 'EOF'

# Backup Configuration
BACKUP_DIR=/opt/media-server/backups
BACKUP_RETENTION_DAILY=7
BACKUP_RETENTION_WEEKLY=4
BACKUP_RETENTION_MONTHLY=2
EOF
        fi
    fi
}

# Make scripts executable
setup_scripts() {
    log_info "Setting up backup scripts..."
    chmod +x "$PROJECT_DIR/scripts/backup_system.sh"
}

# Verify installation
verify_installation() {
    log_info "Verifying installation..."
    
    # Check systemd services
    if ! systemctl is-enabled --quiet monsterr-backup-daily.timer; then
        log_error "Daily backup timer not enabled"
        return 1
    fi
    
    # Check directories
    if [ ! -d "${BACKUP_DIR:-/opt/media-server/backups}" ]; then
        log_error "Backup directory not created"
        return 1
    fi
    
    # Check scripts
    if [ ! -x "$PROJECT_DIR/scripts/backup_system.sh" ]; then
        log_error "Backup script not executable"
        return 1
    fi
    
    return 0
}

# Main installation
main() {
    log_info "Starting Monsterr Media Server backup system installation..."
    
    install_dependencies
    setup_directories
    setup_scripts
    setup_systemd
    setup_log_rotation
    update_config
    
    if verify_installation; then
        log_info "Backup system installation completed successfully!"
        log_info "\nBackup schedule:"
        echo "- Daily backups: Configuration and databases"
        echo "- Weekly backups: Configuration, databases, and media"
        echo "- Monthly backups: Full system backup"
        log_info "\nUsage:"
        echo "- Manual backup: sudo ./scripts/backup_system.sh [daily|weekly|monthly]"
        echo "- View logs: tail -f /var/log/monsterr/backup.log"
        echo "- Check status: systemctl status monsterr-backup-*.timer"
    else
        log_error "Backup system installation failed"
        exit 1
    fi
}

# Run main installation
main
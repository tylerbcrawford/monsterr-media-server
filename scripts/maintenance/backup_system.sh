#!/bin/bash

# Exit on error, undefined variables, and pipe failures
set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load environment variables
if [ -f "$PROJECT_DIR/config.env" ]; then
    # shellcheck disable=SC1091
    source "$PROJECT_DIR/config.env"
fi

# Default paths
BACKUP_ROOT="${BACKUP_DIR:-/opt/media-server/backups}"
MEDIA_ROOT="${MEDIA_DIR:-/opt/media-server/media}"
CONFIG_ROOT="${CONFIG_DIR:-/opt/media-server/config}"
LOG_DIR="/var/log/monsterr"
BACKUP_LOG="$LOG_DIR/backup.log"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1" | tee -a "$BACKUP_LOG"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$BACKUP_LOG"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" | tee -a "$BACKUP_LOG"; }

# Send desktop notification
send_notification() {
    local title=$1
    local message=$2
    if command -v notify-send >/dev/null 2>&1; then
        notify-send "Monsterr Backup - $title" "$message"
    fi
}

# Check available space
check_space() {
    local required_space=$1
    local available_space
    available_space=$(df -k "$BACKUP_ROOT" | awk 'NR==2 {print $4}')
    
    if [ "$available_space" -lt "$required_space" ]; then
        log_error "Insufficient space for backup. Required: ${required_space}KB, Available: ${available_space}KB"
        return 1
    fi
    return 0
}

# Create backup directories
create_backup_dirs() {
    local timestamp=$1
    local backup_path="$BACKUP_ROOT/$timestamp"
    
    mkdir -p "$backup_path"/{config,databases,media}
    mkdir -p "$backup_path/config"/{docker,nginx,services}
    mkdir -p "$backup_path/databases"/{plex,sonarr,radarr,lidarr,readarr}
    
    echo "$backup_path"
}

# Backup configuration files
backup_config() {
    local backup_path=$1
    log_info "Backing up configuration files..."
    
    # Docker compose files
    cp "$PROJECT_DIR"/docker-compose*.yml "$backup_path/config/docker/"
    cp "$PROJECT_DIR/config.env" "$backup_path/config/"
    
    # Service configurations
    local services=(plex sonarr radarr lidarr readarr bazarr qbittorrent prowlarr)
    for service in "${services[@]}"; do
        if [ -d "$CONFIG_ROOT/$service" ]; then
            rsync -a --delete "$CONFIG_ROOT/$service/" "$backup_path/config/services/$service/"
        fi
    done
    
    # Nginx configuration
    if [ -d "$CONFIG_ROOT/nginx" ]; then
        rsync -a --delete "$CONFIG_ROOT/nginx/" "$backup_path/config/nginx/"
    fi
}

# Backup databases
backup_databases() {
    local backup_path=$1
    log_info "Backing up databases..."
    
    # Stop services before backup
    docker-compose stop plex sonarr radarr lidarr readarr
    
    # Backup each service database
    local services=(plex sonarr radarr lidarr readarr)
    for service in "${services[@]}"; do
        if [ -d "$CONFIG_ROOT/$service" ]; then
            rsync -a --delete "$CONFIG_ROOT/$service"/*.db* "$backup_path/databases/$service/"
        fi
    done
    
    # Restart services
    docker-compose start plex sonarr radarr lidarr readarr
}

# Backup media files incrementally
backup_media() {
    local backup_path=$1
    log_info "Backing up media files incrementally..."
    
    local media_types=(movies tv music books audiobooks)
    for type in "${media_types[@]}"; do
        if [ -d "$MEDIA_ROOT/$type" ]; then
            log_info "Backing up $type..."
            rsync -a --delete --progress "$MEDIA_ROOT/$type/" "$backup_path/media/$type/"
        fi
    done
}

# Verify backup integrity
verify_backup() {
    local backup_path=$1
    log_info "Verifying backup integrity..."
    
    # Check config files
    if ! diff -r "$PROJECT_DIR/docker-compose.yml" "$backup_path/config/docker/docker-compose.yml" >/dev/null; then
        log_error "Configuration backup verification failed"
        return 1
    fi
    
    # Check database files exist
    local services=(plex sonarr radarr lidarr readarr)
    for service in "${services[@]}"; do
        if [ -d "$CONFIG_ROOT/$service" ] && [ ! -d "$backup_path/databases/$service" ]; then
            log_error "Database backup verification failed for $service"
            return 1
        fi
    done
    
    # Verify media files (sample check)
    local media_types=(movies tv music books audiobooks)
    for type in "${media_types[@]}"; do
        if [ -d "$MEDIA_ROOT/$type" ]; then
            local orig_count
            local backup_count
            orig_count=$(find "$MEDIA_ROOT/$type" -type f | wc -l)
            backup_count=$(find "$backup_path/media/$type" -type f | wc -l)
            if [ "$orig_count" != "$backup_count" ]; then
                log_error "Media backup verification failed for $type"
                return 1
            fi
        fi
    done
    
    log_info "Backup verification completed successfully"
    return 0
}

# Clean old backups
clean_old_backups() {
    log_info "Cleaning old backups..."
    
    # Keep 7 daily backups
    find "$BACKUP_ROOT" -maxdepth 1 -type d -name "daily_*" -mtime +7 -exec rm -rf {} \;
    
    # Keep 4 weekly backups
    find "$BACKUP_ROOT" -maxdepth 1 -type d -name "weekly_*" -mtime +28 -exec rm -rf {} \;
    
    # Keep 2 monthly backups
    find "$BACKUP_ROOT" -maxdepth 1 -type d -name "monthly_*" -mtime +60 -exec rm -rf {} \;
}

# Main backup function
perform_backup() {
    local backup_type=$1
    local timestamp
    timestamp="${backup_type}_$(date +%Y%m%d_%H%M%S)"
    
    log_info "Starting $backup_type backup..."
    send_notification "Backup Started" "Beginning $backup_type backup..."
    
    # Create backup directories
    local backup_path
    backup_path=$(create_backup_dirs "$timestamp")
    
    # Perform backup steps
    backup_config "$backup_path"
    backup_databases "$backup_path"
    
    # Only backup media for weekly and monthly backups
    if [ "$backup_type" != "daily" ]; then
        backup_media "$backup_path"
    fi
    
    # Verify backup
    if verify_backup "$backup_path"; then
        log_info "Backup completed successfully"
        send_notification "Backup Complete" "The $backup_type backup completed successfully"
    else
        log_error "Backup verification failed"
        send_notification "Backup Failed" "The $backup_type backup verification failed"
        exit 1
    fi
    
    # Clean old backups
    clean_old_backups
}

# Show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  daily    Perform daily backup (config and databases only)"
    echo "  weekly   Perform weekly backup (includes media files)"
    echo "  monthly  Perform monthly backup (full backup)"
    echo "  verify   Verify latest backup"
    echo "  clean    Clean old backups"
    echo "  help     Show this help message"
}

# Main script
main() {
    # Create log directory if it doesn't exist
    mkdir -p "$LOG_DIR"
    
    # Process command line arguments
    case ${1:-help} in
        daily|weekly|monthly)
            perform_backup "$1"
            ;;
        verify)
            latest_backup=$(find "$BACKUP_ROOT" -maxdepth 1 -type d -name "*_*" | sort -r | head -n1)
            if [ -n "$latest_backup" ]; then
                verify_backup "$latest_backup"
            else
                log_error "No backups found to verify"
                exit 1
            fi
            ;;
        clean)
            clean_old_backups
            ;;
        help)
            show_usage
            ;;
        *)
            log_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
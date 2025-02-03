#!/bin/bash

# Exit on error, undefined variables, and pipe failures
set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Source error handler
# shellcheck source=./error_handler.sh
source "$SCRIPT_DIR/error_handler.sh"

# Debug output directory
DEBUG_DIR="/tmp/monsterr-debug"
DEBUG_ARCHIVE="monsterr-debug-$(date +%Y%m%d_%H%M%S).tar.gz"

# Create debug directory
mkdir -p "$DEBUG_DIR"

# Function to collect system information
collect_system_info() {
    log_info "Collecting system information..."
    
    {
        echo "=== System Information ==="
        echo "Date: $(date)"
        echo "Hostname: $(hostname)"
        echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2)"
        echo "Kernel: $(uname -r)"
        echo
        echo "=== CPU Information ==="
        lscpu
        echo
        echo "=== Memory Information ==="
        free -h
        echo
        echo "=== Disk Usage ==="
        df -h
        echo
        echo "=== Network Information ==="
        ip addr
        echo
        echo "=== Docker Information ==="
        docker version
        docker info
    } > "$DEBUG_DIR/system_info.txt"
}

# Function to collect Docker container information
collect_container_info() {
    log_info "Collecting container information..."
    
    {
        echo "=== Container Status ==="
        docker ps -a
        echo
        echo "=== Container Stats ==="
        docker stats --no-stream --all
        echo
        echo "=== Docker Networks ==="
        docker network ls
        docker network inspect proxy
    } > "$DEBUG_DIR/container_info.txt"
    
    # Collect container logs
    mkdir -p "$DEBUG_DIR/container_logs"
    for container in $(docker ps -a --format "{{.Names}}"); do
        docker logs "$container" &> "$DEBUG_DIR/container_logs/$container.log"
    done
}

# Function to collect configuration files
collect_config_files() {
    log_info "Collecting configuration files..."
    
    mkdir -p "$DEBUG_DIR/config"
    
    # Copy main configuration
    if [ -f "$PROJECT_DIR/config.env" ]; then
        # Remove sensitive information
        grep -v "PASSWORD\|TOKEN\|SECRET\|KEY" "$PROJECT_DIR/config.env" > "$DEBUG_DIR/config/config.env"
    fi
    
    # Copy Docker Compose files
    cp "$PROJECT_DIR"/docker-compose*.yml "$DEBUG_DIR/config/"
    
    # Copy service configurations (excluding sensitive files)
    for service in plex sonarr radarr lidarr readarr bazarr; do
        if [ -d "$PROJECT_DIR/$service/config" ]; then
            mkdir -p "$DEBUG_DIR/config/$service"
            find "$PROJECT_DIR/$service/config" -type f \
                ! -name "*.db" \
                ! -name "*.key" \
                ! -name "apikey.txt" \
                -exec cp {} "$DEBUG_DIR/config/$service/" \;
        fi
    done
}

# Function to collect log files
collect_logs() {
    log_info "Collecting log files..."
    
    mkdir -p "$DEBUG_DIR/logs"
    
    # System logs
    cp /var/log/monsterr/*.log "$DEBUG_DIR/logs/" 2>/dev/null || true
    
    # Error and recovery logs
    if [ -d "/var/lib/monsterr/state" ]; then
        cp /var/lib/monsterr/state/*.json "$DEBUG_DIR/logs/" 2>/dev/null || true
        cp /var/lib/monsterr/state/*.log "$DEBUG_DIR/logs/" 2>/dev/null || true
    fi
}

# Function to collect network information
collect_network_info() {
    log_info "Collecting network information..."
    
    {
        echo "=== Network Ports ==="
        netstat -tulpn
        echo
        echo "=== Firewall Rules ==="
        if command -v ufw >/dev/null 2>&1; then
            ufw status verbose
        fi
        echo
        echo "=== DNS Resolution ==="
        if [ -f "$PROJECT_DIR/config.env" ]; then
            # shellcheck source=/dev/null
            source "$PROJECT_DIR/config.env"
            if [ -n "${DOMAIN:-}" ]; then
                host "$DOMAIN"
            fi
        fi
    } > "$DEBUG_DIR/network_info.txt"
}

# Function to create debug report
create_debug_report() {
    log_info "Creating debug report..."
    
    {
        echo "=== Monsterr Media Server Debug Report ==="
        echo "Generated: $(date)"
        echo
        echo "=== Installation Status ==="
        "$SCRIPT_DIR/post_install_check.sh" --all
        echo
        echo "=== Recent Errors ==="
        tail -n 50 /var/log/monsterr/error.log 2>/dev/null || echo "No errors found"
        echo
        echo "=== Recovery Attempts ==="
        tail -n 50 /var/lib/monsterr/state/recovery.log 2>/dev/null || echo "No recovery log found"
    } > "$DEBUG_DIR/debug_report.txt"
}

# Main function
main() {
    log_section "Starting Debug Information Collection"
    
    # Create clean debug directory
    rm -rf "$DEBUG_DIR"
    mkdir -p "$DEBUG_DIR"
    
    # Collect information
    collect_system_info
    collect_container_info
    collect_config_files
    collect_logs
    collect_network_info
    create_debug_report
    
    # Create archive
    log_info "Creating debug archive..."
    tar -czf "$DEBUG_ARCHIVE" -C "$(dirname "$DEBUG_DIR")" "$(basename "$DEBUG_DIR")"
    
    # Cleanup
    rm -rf "$DEBUG_DIR"
    
    log_info "Debug information collected: $DEBUG_ARCHIVE"
    log_info "Please attach this file when seeking support."
    
    # Print file location and size
    echo
    echo "Debug archive location: $DEBUG_ARCHIVE"
    echo "Archive size: $(du -h "$DEBUG_ARCHIVE" | cut -f1)"
}

# Run main function
main "$@"
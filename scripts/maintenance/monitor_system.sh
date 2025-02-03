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

# Configuration
DISK_THRESHOLD=${DISK_THRESHOLD:-90}
MEMORY_THRESHOLD=${MEMORY_THRESHOLD:-90}
CPU_THRESHOLD=${CPU_THRESHOLD:-90}
CHECK_INTERVAL=${CHECK_INTERVAL:-5}
LOG_DIR="/var/log/monsterr"
LOG_FILE="$LOG_DIR/monitor.log"
SUMMARY_FILE="$LOG_DIR/daily_summary.log"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Logging functions
log_event() {
    local level=$1
    local message=$2
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
    
    # For errors and warnings, also send notifications
    if [ "$level" = "ERROR" ] || [ "$level" = "WARNING" ]; then
        send_notification "$level" "$message"
    fi
}

# Notification function
send_notification() {
    local level=$1
    local message=$2
    
    # Desktop notification
    if command -v notify-send >/dev/null 2>&1; then
        if [ "$level" = "ERROR" ]; then
            notify-send -u critical "Monsterr Media Server - Error" "$message"
        else
            notify-send -u normal "Monsterr Media Server - Warning" "$message"
        fi
    fi
    
    # TODO: Add email notification support if configured
}

# Check disk space
check_disk_space() {
    log_event "INFO" "Checking disk space..."
    
    # Check root partition
    local root_usage
    root_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$root_usage" -gt "$DISK_THRESHOLD" ]; then
        log_event "WARNING" "Root partition usage at ${root_usage}%"
    fi
    
    # Check media directory
    if [ -d "/opt/media-server/media" ]; then
        local media_usage
        media_usage=$(df -h /opt/media-server/media | awk 'NR==2 {print $5}' | sed 's/%//')
        if [ "$media_usage" -gt "$DISK_THRESHOLD" ]; then
            log_event "WARNING" "Media partition usage at ${media_usage}%"
        fi
    fi
}

# Check memory usage
check_memory_usage() {
    log_event "INFO" "Checking memory usage..."
    
    local mem_total
    local mem_used
    local mem_percent
    
    mem_total=$(free | awk '/^Mem:/ {print $2}')
    mem_used=$(free | awk '/^Mem:/ {print $3}')
    mem_percent=$((mem_used * 100 / mem_total))
    
    if [ "$mem_percent" -gt "$MEMORY_THRESHOLD" ]; then
        log_event "WARNING" "Memory usage at ${mem_percent}%"
    fi
}

# Check CPU usage
check_cpu_usage() {
    log_event "INFO" "Checking CPU usage..."
    
    local cpu_usage
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d. -f1)
    
    if [ "$cpu_usage" -gt "$CPU_THRESHOLD" ]; then
        log_event "WARNING" "CPU usage at ${cpu_usage}%"
    fi
}

# Check container health
check_containers() {
    log_event "INFO" "Checking container health..."
    
    local containers
    containers=$(docker ps -q)
    
    for container in $containers; do
        local name
        local status
        local health
        
        name=$(docker inspect --format '{{.Name}}' "$container" | sed 's/\///')
        status=$(docker inspect --format '{{.State.Status}}' "$container")
        health=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$container")
        
        if [ "$status" != "running" ]; then
            log_event "ERROR" "Container $name is not running (Status: $status)"
        elif [ "$health" != "none" ] && [ "$health" != "healthy" ]; then
            log_event "WARNING" "Container $name health check: $health"
        fi
    done
}

# Check network connectivity
check_network() {
    log_event "INFO" "Checking network connectivity..."
    
    # Check internet connectivity
    if ! ping -c 1 8.8.8.8 >/dev/null 2>&1; then
        log_event "ERROR" "Internet connectivity check failed"
    fi
    
    # Check DNS resolution
    if ! host google.com >/dev/null 2>&1; then
        log_event "ERROR" "DNS resolution check failed"
    fi
}

# Generate daily summary
generate_daily_summary() {
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    {
        echo "=== Daily Summary ($timestamp) ==="
        echo "Disk Usage:"
        df -h / /opt/media-server/media 2>/dev/null || true
        echo -e "\nMemory Usage:"
        free -h
        echo -e "\nContainer Status:"
        docker ps --format "table {{.Names}}\t{{.Status}}"
        echo -e "\nRecent Warnings/Errors:"
        grep -E "WARNING|ERROR" "$LOG_FILE" | tail -n 10
        echo "=== End Summary ==="
    } > "$SUMMARY_FILE"
}

# Main monitoring loop
main() {
    log_event "INFO" "Starting Monsterr Media Server monitoring"
    
    while true; do
        check_disk_space
        check_memory_usage
        check_cpu_usage
        check_containers
        check_network
        
        # Generate daily summary at midnight
        if [ "$(date +%H:%M)" = "00:00" ]; then
            generate_daily_summary
        fi
        
        sleep $((CHECK_INTERVAL * 60))
    done
}

# Run main function
main
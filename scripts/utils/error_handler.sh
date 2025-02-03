#!/bin/bash

# Exit on error, undefined variables, and pipe failures
set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Error log file
ERROR_LOG="/var/log/monsterr/error.log"
STATE_DIR="/var/lib/monsterr/state"
RECOVERY_LOG="$STATE_DIR/recovery.log"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ensure log directories exist
mkdir -p "$(dirname "$ERROR_LOG")" "$STATE_DIR"

# Log functions
log_error() {
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${RED}[ERROR]${NC} $1"
    echo "[$timestamp] ERROR: $1" >> "$ERROR_LOG"
}

log_warn() {
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${YELLOW}[WARN]${NC} $1"
    echo "[$timestamp] WARN: $1" >> "$ERROR_LOG"
}

log_info() {
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${GREEN}[INFO]${NC} $1"
    echo "[$timestamp] INFO: $1" >> "$ERROR_LOG"
}

# Save error state
save_error_state() {
    local error_code=$1
    local script_name=$2
    local line_number=$3
    local error_message=$4
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    # Create state directory if it doesn't exist
    mkdir -p "$STATE_DIR"

    # Save error details
    cat > "$STATE_DIR/last_error.json" << EOF
{
    "timestamp": "$timestamp",
    "error_code": $error_code,
    "script": "$script_name",
    "line": $line_number,
    "message": "$error_message",
    "recovery_attempted": false
}
EOF

    # Save current environment variables
    env | grep -v "^_" > "$STATE_DIR/environment.bak"

    # Save current script state if it exists
    if [ -f "$PROJECT_DIR/config.env" ]; then
        cp "$PROJECT_DIR/config.env" "$STATE_DIR/config.env.bak"
    fi

    log_error "Error state saved to $STATE_DIR/last_error.json"
}

# Attempt recovery
attempt_recovery() {
    local error_code=$1
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    # Load last error state
    if [ ! -f "$STATE_DIR/last_error.json" ]; then
        log_error "No error state found to recover from"
        return 1
    fi

    # Mark recovery attempt
    local temp_file
    temp_file=$(mktemp)
    jq '.recovery_attempted = true' "$STATE_DIR/last_error.json" > "$temp_file"
    mv "$temp_file" "$STATE_DIR/last_error.json"

    # Log recovery attempt
    echo "[$timestamp] Attempting recovery from error code $error_code" >> "$RECOVERY_LOG"

    case $error_code in
        1) # General error
            log_info "Attempting general error recovery..."
            if [ -f "$STATE_DIR/config.env.bak" ]; then
                cp "$STATE_DIR/config.env.bak" "$PROJECT_DIR/config.env"
                log_info "Restored configuration from backup"
            fi
            ;;
        2) # Permission error
            log_info "Attempting to fix permissions..."
            if [ -f "$STATE_DIR/environment.bak" ]; then
                # shellcheck source=/dev/null
                source "$STATE_DIR/environment.bak"
                if [ -n "${PUID:-}" ] && [ -n "${PGID:-}" ]; then
                    chown -R "$PUID:$PGID" "$PROJECT_DIR"
                    log_info "Fixed permissions using PUID:PGID"
                fi
            fi
            ;;
        3) # Network error
            log_info "Attempting to fix network issues..."
            systemctl restart docker
            log_info "Restarted Docker service"
            ;;
        4) # Service error
            log_info "Attempting to fix service issues..."
            if [ -f "$PROJECT_DIR/docker-compose.yml" ]; then
                docker-compose down
                docker-compose up -d
                log_info "Restarted all services"
            fi
            ;;
        *)
            log_warn "No specific recovery procedure for error code $error_code"
            return 1
            ;;
    esac

    echo "[$timestamp] Recovery attempt completed" >> "$RECOVERY_LOG"
    return 0
}

# Clean up old error states
cleanup_error_states() {
    local max_age=7 # days
    
    # Remove old error states
    find "$STATE_DIR" -name "*.json" -mtime +"$max_age" -delete
    find "$STATE_DIR" -name "*.bak" -mtime +"$max_age" -delete
    
    # Rotate logs
    if [ -f "$ERROR_LOG" ]; then
        mv "$ERROR_LOG" "$ERROR_LOG.1"
    fi
    if [ -f "$RECOVERY_LOG" ]; then
        mv "$RECOVERY_LOG" "$RECOVERY_LOG.1"
    fi
}

# Get error details
get_error_details() {
    if [ -f "$STATE_DIR/last_error.json" ]; then
        cat "$STATE_DIR/last_error.json"
    else
        echo "{}"
    fi
}

# Main error handler function
handle_error() {
    local error_code=$1
    local script_name=$2
    local line_number=$3
    local error_message=$4

    # Save error state
    save_error_state "$error_code" "$script_name" "$line_number" "$error_message"

    # Attempt recovery if not already attempted
    if ! jq -e '.recovery_attempted' "$STATE_DIR/last_error.json" >/dev/null; then
        if attempt_recovery "$error_code"; then
            log_info "Recovery successful"
            return 0
        else
            log_error "Recovery failed"
            return 1
        fi
    else
        log_warn "Recovery already attempted, manual intervention required"
        return 1
    fi
}

# Usage example:
# handle_error "$?" "${BASH_SOURCE[0]}" "${LINENO}" "Failed to start service"
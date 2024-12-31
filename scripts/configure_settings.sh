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
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_section() { echo -e "\n${BLUE}=== $1 ===${NC}\n"; }

# Error handler
trap 'log_error "An error occurred on line $LINENO. Exiting..."; exit 1' ERR

# Function to prompt for yes/no
prompt_yes_no() {
    local prompt="$1"
    local default="${2:-n}"
    local REPLY
    
    while true; do
        read -p "$prompt [y/N] " REPLY
        REPLY=${REPLY:-$default}
        case "$REPLY" in
            [Yy]*) return 0 ;;
            [Nn]*) return 1 ;;
            *) echo "Please answer yes or no." ;;
        esac
    done
}

# Function to validate domain name
validate_domain() {
    local domain=$1
    if [[ ! "$domain" =~ ^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$ ]]; then
        return 1
    fi
    return 0
}

# Function to validate port number
validate_port() {
    local port=$1
    if [[ ! "$port" =~ ^[0-9]+$ ]] || [ "$port" -lt 1 ] || [ "$port" -gt 65535 ]; then
        return 1
    fi
    return 0
}

# Function to validate IP address
validate_ip() {
    local ip=$1
    if [[ ! "$ip" =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
        return 1
    fi
    return 0
}

# Function to configure domain settings
configure_domain() {
    log_section "Domain Configuration"
    echo "Your domain will be used for SSL certificates and service access."
    echo "Example: If your domain is example.com, services will be available at:"
    echo "  - https://plex.example.com"
    echo "  - https://sonarr.example.com"
    echo "  - etc."
    echo
    
    local domain
    while true; do
        read -p "Enter your domain name: " domain
        if validate_domain "$domain"; then
            break
        else
            log_error "Invalid domain format. Please enter a valid domain (e.g., example.com)"
        fi
    done
    
    echo "DOMAIN=$domain" >> "$PROJECT_DIR/config.env"
    log_info "Domain configuration saved"
}

# Function to configure SSH settings
configure_ssh() {
    log_section "SSH Configuration"
    echo "By default, SSH uses port 22. If you're using a custom SSH port for security,"
    echo "please specify it now to ensure the firewall is configured correctly."
    echo
    
    if prompt_yes_no "Are you using a custom SSH port?"; then
        local ssh_port
        while true; do
            read -p "Enter your custom SSH port: " ssh_port
            if validate_port "$ssh_port"; then
                break
            else
                log_error "Invalid port number. Please enter a number between 1 and 65535"
            fi
        done
        echo "SSH_PORT=$ssh_port" >> "$PROJECT_DIR/config.env"
    else
        echo "SSH_PORT=22" >> "$PROJECT_DIR/config.env"
    fi
    
    log_info "SSH configuration saved"
}

# Function to configure Plex settings
configure_plex() {
    log_section "Plex Configuration"
    echo "To claim your Plex server, you'll need a claim token from plex.tv"
    echo "1. Visit https://plex.tv/claim"
    echo "2. Log in to your Plex account"
    echo "3. Copy the claim token (it starts with 'claim-')"
    echo
    
    local claim_token
    while true; do
        read -p "Enter your Plex claim token: " claim_token
        if [[ "$claim_token" =~ ^claim- ]]; then
            break
        else
            log_error "Invalid claim token format. It should start with 'claim-'"
            if ! prompt_yes_no "Would you like to try again?"; then
                log_warn "Skipping Plex claim token. You'll need to claim your server manually later."
                claim_token=""
                break
            fi
        fi
    done
    
    echo "PLEX_CLAIM=$claim_token" >> "$PROJECT_DIR/config.env"
    log_info "Plex configuration saved"
}

# Function to configure backup settings
configure_backups() {
    log_section "Backup Configuration"
    echo "Regular backups help protect your configuration and data."
    echo "Recommended: Enable daily backups with 7-day retention"
    echo
    
    if prompt_yes_no "Would you like to enable automatic backups?"; then
        # Backup schedule
        echo "Select backup frequency:"
        echo "1) Daily (recommended)"
        echo "2) Weekly"
        echo "3) Monthly"
        
        local schedule
        while true; do
            read -p "Enter your choice (1-3): " schedule
            case $schedule in
                1) echo "BACKUP_SCHEDULE='0 0 * * *'" >> "$PROJECT_DIR/config.env"; break ;;
                2) echo "BACKUP_SCHEDULE='0 0 * * 0'" >> "$PROJECT_DIR/config.env"; break ;;
                3) echo "BACKUP_SCHEDULE='0 0 1 * *'" >> "$PROJECT_DIR/config.env"; break ;;
                *) log_error "Invalid choice. Please enter 1, 2, or 3" ;;
            esac
        done
        
        # Backup retention
        local retain_days
        while true; do
            read -p "Enter number of days to retain backups (recommended: 7): " retain_days
            if [[ "$retain_days" =~ ^[0-9]+$ ]] && [ "$retain_days" -gt 0 ]; then
                break
            else
                log_error "Please enter a positive number"
            fi
        done
        echo "BACKUP_RETAIN_DAYS=$retain_days" >> "$PROJECT_DIR/config.env"
        
        log_info "Backup configuration saved"
    else
        log_warn "Automatic backups disabled. You'll need to manage backups manually."
    fi
}

# Function to configure security settings
configure_security() {
    log_section "Security Configuration"
    echo "Configuring security settings for your media server..."
    echo
    
    # UFW Configuration
    if prompt_yes_no "Would you like to enable UFW firewall?"; then
        echo "ENABLE_UFW=true" >> "$PROJECT_DIR/config.env"
        configure_ssh
    else
        echo "ENABLE_UFW=false" >> "$PROJECT_DIR/config.env"
        log_warn "UFW firewall will not be enabled. Ensure you have alternative security measures."
    fi
    
    # Fail2Ban Configuration
    if prompt_yes_no "Would you like to enable Fail2Ban protection?"; then
        echo "ENABLE_FAIL2BAN=true" >> "$PROJECT_DIR/config.env"
        if prompt_yes_no "Enable Fail2Ban SSH protection?"; then
            echo "FAIL2BAN_SSH=true" >> "$PROJECT_DIR/config.env"
        fi
    else
        echo "ENABLE_FAIL2BAN=false" >> "$PROJECT_DIR/config.env"
        log_warn "Fail2Ban will not be enabled. Your server may be vulnerable to brute force attacks."
    fi
    
    log_info "Security configuration saved"
}

# Main function
main() {
    # Check if config.env already exists
    if [ -f "$PROJECT_DIR/config.env" ]; then
        if ! prompt_yes_no "config.env already exists. Would you like to reconfigure?"; then
            log_error "Configuration cancelled. Please remove or rename existing config.env to reconfigure."
            exit 1
        fi
        # Backup existing config
        cp "$PROJECT_DIR/config.env" "$PROJECT_DIR/config.env.bak"
        log_info "Existing configuration backed up to config.env.bak"
        # Start fresh
        > "$PROJECT_DIR/config.env"
    fi
    
    log_info "Starting configuration process..."
    
    # Core settings
    echo "# Monsterr Media Server Configuration" > "$PROJECT_DIR/config.env"
    echo "# Generated on $(date)" >> "$PROJECT_DIR/config.env"
    echo >> "$PROJECT_DIR/config.env"
    
    # Configure each section
    configure_domain
    configure_security
    configure_plex
    configure_backups
    
    log_section "Configuration Complete"
    log_info "Configuration has been saved to config.env"
    echo
    log_info "Next steps:"
    echo "1. Review config.env for any final adjustments"
    echo "2. Run setup_media_server.sh to apply configuration"
    echo "3. Use post_install_check.sh to verify installation"
}

# Run main function
main "$@"

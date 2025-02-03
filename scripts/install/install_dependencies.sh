#!/bin/bash
set -euo pipefail

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

# Required packages
PACKAGES=(
    # System utilities
    curl
    gnupg2
    ca-certificates
    lsb-release
    apt-transport-https
    software-properties-common
    ufw
    fail2ban
    
    # Network utilities
    net-tools
    iputils-ping
    dnsutils
    
    # Python for web interface
    python3
    python3-pip
    
    # Text processing
    jq
    sed
    
    # Process management
    supervisor
    
    # Monitoring
    htop
    
    # SSL/TLS
    openssl
    
    # VPN support
    openvpn
    
    # File management
    rsync
    
    # Development tools
    git
)

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to validate installed packages
validate_installation() {
    local package=$1
    if ! dpkg -l | grep -q "^ii.*$package"; then
        return 1
    fi
    return 0
}

# Main function
main() {
    log_section "Installing Dependencies"
    
    # Update package lists
    log_info "Updating package lists..."
    apt update
    
    # Install packages
    log_info "Installing required packages..."
    for package in "${PACKAGES[@]}"; do
        if ! validate_installation "$package"; then
            log_info "Installing $package..."
            DEBIAN_FRONTEND=noninteractive apt install -y "$package"
            if ! validate_installation "$package"; then
                log_error "Failed to install $package"
                exit 1
            fi
        else
            log_info "$package is already installed"
        fi
    done
    
    # Verify critical commands
    log_info "Verifying installations..."
    CRITICAL_COMMANDS=(curl python3 openssl ufw fail2ban)
    for cmd in "${CRITICAL_COMMANDS[@]}"; do
        if ! command_exists "$cmd"; then
            log_error "Critical command '$cmd' not found after installation"
            exit 1
        fi
    done
    
    # Clean up
    log_info "Cleaning up..."
    apt autoremove -y
    apt clean
    
    log_section "Dependencies Installation Complete"
    log_info "All required packages have been installed successfully"
}

# Run main function
main "$@"

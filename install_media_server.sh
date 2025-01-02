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

# Function to check system requirements
check_system_requirements() {
    log_section "Checking System Requirements"

    # Check OS
    if [ ! -f /etc/os-release ]; then
        log_error "Could not determine OS version"
        exit 1
    }
    source /etc/os-release
    if [[ ! "$ID" =~ ^(ubuntu|debian)$ ]]; then
        log_error "This script requires Ubuntu or Debian"
        exit 1
    }
    if [ "$ID" = "ubuntu" ] && [ "${VERSION_ID%%.*}" -lt 20 ]; then
        log_error "Ubuntu 20.04 or higher is required"
        exit 1
    }
    log_info "OS Check: $PRETTY_NAME"

    # Check CPU cores
    cpu_cores=$(nproc)
    if [ "$cpu_cores" -lt 2 ]; then
        log_warn "Recommended minimum: 2 CPU cores (found: $cpu_cores)"
    else
        log_info "CPU Cores: $cpu_cores"
    }

    # Check RAM
    total_ram=$(free -m | awk '/^Mem:/{print $2}')
    if [ "$total_ram" -lt 4096 ]; then
        log_warn "Recommended minimum: 4GB RAM (found: ${total_ram}MB)"
    else
        log_info "RAM: ${total_ram}MB"
    }

    # Check disk space
    root_space=$(df -BG / | awk 'NR==2 {print $4}' | sed 's/G//')
    if [ "$root_space" -lt 20 ]; then
        log_warn "Recommended minimum: 20GB free space (found: ${root_space}GB)"
    else
        log_info "Free Space: ${root_space}GB"
    }

    # Check internet connection
    if ! ping -c 1 google.com &> /dev/null; then
        log_error "Internet connection required"
        exit 1
    }
    log_info "Internet Connection: OK"
}

# Function to check for existing installations
check_existing_installation() {
    log_section "Checking for Existing Installation"

    if [ -f "./config.env" ]; then
        log_warn "Existing configuration found (config.env)"
        read -p "Do you want to proceed and overwrite existing configuration? [y/N] " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_error "Installation cancelled by user"
            exit 1
        fi
    fi

    if docker ps &> /dev/null; then
        log_warn "Docker is already installed and running"
        log_warn "Existing containers may conflict with this installation"
        read -p "Do you want to proceed? [y/N] " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_error "Installation cancelled by user"
            exit 1
        fi
    fi
}

# Function to make scripts executable
make_scripts_executable() {
    log_section "Preparing Installation Scripts"
    chmod +x scripts/*.sh
    chmod +x setup_wizard.sh
    chmod +x setup_media_server.sh
    log_info "Made scripts executable"
}

# Main installation function
main() {
    log_section "Starting Monsterr Media Server Installation"

    # Make sure we're running as root
    if [ "$(id -u)" != "0" ]; then
        log_error "This script must be run as root"
        log_error "Try: sudo ./install_media_server.sh"
        exit 1
    }

    # Perform checks
    check_system_requirements
    check_existing_installation
    make_scripts_executable

    # Install dependencies
    log_section "Installing Dependencies"
    ./scripts/install_dependencies.sh

    # Install Docker
    log_section "Installing Docker"
    ./scripts/install_docker.sh

    # Run setup wizard
    log_section "Running Setup Wizard"
    ./setup_wizard.sh

    log_section "Installation Complete!"
    log_info "Next steps:"
    echo "1. Review your configuration in config.env"
    echo "2. Start your services with: sudo ./setup_media_server.sh"
    echo "3. Check service status with: sudo ./scripts/post_install_check.sh"
}

# Run main function
main "$@"

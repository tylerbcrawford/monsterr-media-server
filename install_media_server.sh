#!/bin/bash

# Exit on error, undefined variables, and pipe failures
set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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

# Progress bar function
show_progress() {
    local current=$1
    local total=$2
    local width=50
    local percentage=$((current * 100 / total))
    local completed=$((width * current / total))
    local remaining=$((width - completed))
    
    printf "\rProgress: ["
    printf "%${completed}s" | tr ' ' '='
    printf "%${remaining}s" | tr ' ' ' '
    printf "] %d%%" "$percentage"
    
    if [ "$current" -eq "$total" ]; then
        echo
    fi
}

# Error handler
handle_error() {
    local exit_code=$?
    local line_number=$1
    log_error "An error occurred on line $line_number (Exit code: $exit_code)"
    
    # Save error state if it exists
    if [ -f "$SCRIPT_DIR/config.env" ]; then
        cp "$SCRIPT_DIR/config.env" "$SCRIPT_DIR/config.env.error"
    fi
    
    log_error "Installation failed. See error details above."
    log_info "You can resume the installation by running: sudo ./install_media_server.sh --resume"
    exit $exit_code
}

trap 'handle_error $LINENO' ERR

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "This script must be run as root"
    log_error "Try: sudo ./install_media_server.sh"
    exit 1
fi

# Initialize progress counter
TOTAL_STEPS=7
current_step=0

# Function to update progress
update_progress() {
    ((current_step++))
    show_progress "$current_step" "$TOTAL_STEPS"
}

# Check for resume flag
RESUME=false
if [ "${1:-}" = "--resume" ]; then
    RESUME=true
    if [ -f "$SCRIPT_DIR/config.env.error" ]; then
        log_info "Resuming installation from last error..."
        mv "$SCRIPT_DIR/config.env.error" "$SCRIPT_DIR/config.env"
    else
        log_error "No previous installation state found"
        exit 1
    fi
fi

# Display welcome message
log_section "Welcome to Monsterr Media Server Installation"
echo "This script will guide you through the installation process."
echo "You can cancel at any time by pressing Ctrl+C."
echo

# Check system requirements
if ! $RESUME; then
    log_section "Checking System Requirements"
    ./scripts/post_install_check.sh --check-only
    update_progress
fi

# Install dependencies
log_section "Installing Dependencies"
./scripts/install_dependencies.sh
update_progress

# Install Docker
log_section "Installing Docker"
./scripts/install_docker.sh
update_progress

# Create directories
log_section "Creating Directories"
./scripts/create_directories.sh
update_progress

# Run setup wizard
log_section "Running Setup Wizard"
./setup_wizard.sh
update_progress

# Configure services
log_section "Configuring Services"
./scripts/configure_settings.sh
update_progress

# Launch services
log_section "Launching Services"
./scripts/launch_services.sh
update_progress

# Final checks
log_section "Performing Final Checks"
./scripts/post_install_check.sh --all

# Installation complete
log_section "Installation Complete!"
log_info "Your Monsterr Media Server has been installed successfully!"
log_info "\nNext steps:"
echo "1. Access your services at: http://localhost:8080"
echo "2. Complete the initial configuration of each service"
echo "3. Review the documentation at: docs/installation.md"
echo
log_info "To check the status of your services:"
echo "sudo ./scripts/post_install_check.sh --all"
echo
log_info "To view the system dashboard:"
echo "http://localhost:3000"
echo
log_info "If you need help, check the troubleshooting guide:"
echo "docs/installation.md#troubleshooting"

# Clean up error state if it exists
rm -f "$SCRIPT_DIR/config.env.error"

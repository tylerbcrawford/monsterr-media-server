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

# Progress spinner
spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    while ps -p $pid > /dev/null; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# Check dependencies
check_dependencies() {
    log_section "Checking Dependencies"
    
    local missing_deps=()
    
    # Check Node.js
    if ! command -v node >/dev/null 2>&1; then
        missing_deps+=("nodejs")
    fi
    
    # Check npm
    if ! command -v npm >/dev/null 2>&1; then
        missing_deps+=("npm")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing dependencies: ${missing_deps[*]}"
        log_info "Installing missing dependencies..."
        
        if command -v apt-get >/dev/null 2>&1; then
            # Debian/Ubuntu
            curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
            sudo apt-get install -y "${missing_deps[@]}"
        elif command -v dnf >/dev/null 2>&1; then
            # Fedora/RHEL
            curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
            sudo dnf install -y "${missing_deps[@]}"
        elif command -v pacman >/dev/null 2>&1; then
            # Arch Linux
            sudo pacman -Sy --noconfirm "${missing_deps[@]}"
        else
            log_error "Unsupported package manager"
            exit 1
        fi
    else
        log_info "All dependencies are installed"
    fi
}

# Install setup interface dependencies
install_setup_interface() {
    log_section "Installing Setup Interface"
    
    cd "$SCRIPT_DIR/web_config_interface"
    
    log_info "Installing npm packages..."
    npm install express &
    spinner $!
    
    log_info "Setup interface dependencies installed"
}

# Start setup interface
start_setup_interface() {
    log_section "Starting Setup Interface"
    
    # Check if port 8080 is available
    if netstat -tuln | grep -q ":8080 "; then
        log_error "Port 8080 is already in use"
        log_error "Please free up port 8080 and try again"
        exit 1
    fi
    
    # Start the setup server
    log_info "Starting setup server..."
    node "$SCRIPT_DIR/web_config_interface/setup_server.js" &
    SERVER_PID=$!
    
    # Wait for server to start
    local retries=0
    local max_retries=30
    while ! netstat -tuln | grep -q ":8080 "; do
        if [ $retries -eq $max_retries ]; then
            log_error "Setup server failed to start"
            kill $SERVER_PID 2>/dev/null || true
            exit 1
        fi
        sleep 1
        ((retries++))
        echo -n "."
    done
    echo
    
    log_info "Setup interface is ready!"
}

# Open setup interface in browser
open_setup_interface() {
    log_section "Opening Setup Interface"
    
    # Try to open in default browser
    if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "http://localhost:8080" &
    elif command -v open >/dev/null 2>&1; then
        open "http://localhost:8080" &
    else
        log_warn "Could not open browser automatically"
        log_info "Please open http://localhost:8080 in your browser"
    fi
}

# Cleanup function
cleanup() {
    log_section "Cleaning Up"
    
    # Kill setup server if running
    if [ -n "${SERVER_PID:-}" ]; then
        kill $SERVER_PID 2>/dev/null || true
    fi
    
    log_info "Cleanup complete"
}

# Set up trap for cleanup
trap cleanup EXIT

# Main function
main() {
    log_section "Starting Monsterr Media Server Setup Wizard"
    
    # Check dependencies
    check_dependencies
    
    # Install setup interface dependencies
    install_setup_interface
    
    # Start setup interface
    start_setup_interface
    
    # Open setup interface
    open_setup_interface
    
    # Wait for setup to complete
    log_info "Waiting for setup to complete..."
    log_info "Press Ctrl+C to cancel setup"
    
    # Wait for server process
    wait $SERVER_PID
}

# Run main function
main "$@"

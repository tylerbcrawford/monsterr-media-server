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

# Install Node.js and npm if not present
install_nodejs() {
    log_info "Checking Node.js installation..."
    
    if ! command -v node >/dev/null 2>&1; then
        log_info "Installing Node.js..."
        
        if command -v apt-get >/dev/null 2>&1; then
            # Debian/Ubuntu
            curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
            apt-get install -y nodejs
        elif command -v dnf >/dev/null 2>&1; then
            # Fedora/RHEL
            curl -fsSL https://rpm.nodesource.com/setup_16.x | bash -
            dnf install -y nodejs
        elif command -v pacman >/dev/null 2>&1; then
            # Arch Linux
            pacman -Sy --noconfirm nodejs npm
        else
            log_error "Unsupported package manager"
            exit 1
        fi
    else
        log_info "Node.js is already installed"
    fi
}

# Install dashboard dependencies
install_dependencies() {
    log_info "Installing dashboard dependencies..."
    cd "$PROJECT_DIR/web_config_interface"
    npm install --production
}

# Set up systemd service
setup_systemd() {
    log_info "Setting up systemd service..."
    
    # Copy service file
    cp "$SCRIPT_DIR/monsterr-dashboard.service" /etc/systemd/system/
    
    # Reload systemd
    systemctl daemon-reload
    
    # Enable and start service
    systemctl enable monsterr-dashboard
    systemctl start monsterr-dashboard
}

# Create log directory if it doesn't exist
setup_logging() {
    log_info "Setting up logging..."
    mkdir -p /var/log/monsterr
    chmod 755 /var/log/monsterr
}

# Set up log rotation
setup_log_rotation() {
    log_info "Setting up log rotation..."
    
    cat > /etc/logrotate.d/monsterr-dashboard << 'EOF'
/var/log/monsterr/dashboard.log {
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

# Configure nginx proxy
setup_nginx() {
    log_info "Configuring Nginx proxy..."
    
    if [ -d "/opt/media-server/npm" ]; then
        log_info "Adding dashboard to Nginx Proxy Manager..."
        # Note: User needs to manually add proxy host in NPM UI
        echo "Please add a proxy host in Nginx Proxy Manager:"
        echo "- Domain: dashboard.yourdomain.com"
        echo "- Forward IP: 127.0.0.1"
        echo "- Forward Port: 3000"
    fi
}

# Verify installation
verify_installation() {
    log_info "Verifying installation..."
    
    # Check if service is running
    if ! systemctl is-active --quiet monsterr-dashboard; then
        log_error "Dashboard service is not running"
        return 1
    fi
    
    # Check if port is open
    if ! netstat -tuln | grep -q ":3000 "; then
        log_error "Dashboard port is not open"
        return 1
    fi
    
    return 0
}

# Main installation
main() {
    log_info "Starting Monsterr Media Server dashboard installation..."
    
    install_nodejs
    install_dependencies
    setup_logging
    setup_log_rotation
    setup_systemd
    setup_nginx
    
    if verify_installation; then
        log_info "Dashboard installation completed successfully!"
        log_info "\nDashboard is available at:"
        echo "- Local: http://localhost:3000"
        echo "- Network: http://<SERVER_IP>:3000"
        
        log_info "\nTo view logs:"
        echo "- Dashboard logs: tail -f /var/log/monsterr/dashboard.log"
        echo "- Service status: systemctl status monsterr-dashboard"
    else
        log_error "Dashboard installation failed"
        exit 1
    fi
}

# Run main installation
main
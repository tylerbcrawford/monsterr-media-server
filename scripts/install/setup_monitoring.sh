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

# Create log directory
log_info "Creating log directory..."
mkdir -p /var/log/monsterr

# Set up log rotation
log_info "Setting up log rotation..."
cat > /etc/logrotate.d/monsterr << 'EOF'
/var/log/monsterr/*.log {
    weekly
    rotate 4
    compress
    delaycompress
    missingok
    notifempty
    create 0640 root root
}
EOF

# Make monitoring script executable
log_info "Setting up monitoring script..."
chmod +x "$PROJECT_DIR/scripts/monitor_system.sh"

# Install systemd service
log_info "Installing systemd service..."
cp "$PROJECT_DIR/scripts/monsterr-monitor.service" /etc/systemd/system/
systemctl daemon-reload

# Install dependencies
log_info "Installing dependencies..."
if command -v apt-get >/dev/null 2>&1; then
    # Debian/Ubuntu
    apt-get update
    apt-get install -y notify-send libnotify-bin dnsutils
elif command -v dnf >/dev/null 2>&1; then
    # Fedora/RHEL
    dnf install -y libnotify dnsutils
elif command -v pacman >/dev/null 2>&1; then
    # Arch Linux
    pacman -Sy --noconfirm libnotify bind-tools
fi

# Create monitoring config file if it doesn't exist
if [ ! -f "$PROJECT_DIR/config.env" ]; then
    log_info "Creating default monitoring configuration..."
    cat >> "$PROJECT_DIR/config.env" << 'EOF'

# Monitoring Configuration
DISK_THRESHOLD=90
MEMORY_THRESHOLD=90
CPU_THRESHOLD=90
CHECK_INTERVAL=5
EOF
fi

# Start and enable the service
log_info "Starting monitoring service..."
systemctl enable monsterr-monitor
systemctl start monsterr-monitor

# Verify service status
if systemctl is-active --quiet monsterr-monitor; then
    log_info "Monitoring service successfully installed and started!"
    log_info "You can check the service status with: systemctl status monsterr-monitor"
    log_info "Logs are available in /var/log/monsterr/"
else
    log_error "Failed to start monitoring service. Please check the logs:"
    log_error "journalctl -u monsterr-monitor"
    exit 1
fi

# Print configuration information
log_info "\nMonitoring system configuration:"
echo "- Log directory: /var/log/monsterr/"
echo "- Service file: /etc/systemd/system/monsterr-monitor.service"
echo "- Configuration: $PROJECT_DIR/config.env"
echo "- Log rotation: /etc/logrotate.d/monsterr"

log_info "\nTo modify monitoring thresholds, edit $PROJECT_DIR/config.env"
log_info "To view recent alerts: tail -f /var/log/monsterr/monitor.log"
log_info "To view daily summary: cat /var/log/monsterr/daily_summary.log"

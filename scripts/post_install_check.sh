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

# Function to check if a container exists
container_exists() {
    local container=$1
    docker ps -a --format '{{.Names}}' | grep -q "^$container$"
    return $?
}

# Function to check container health
check_container() {
    local container=$1
    local status
    local state
    
    if ! container_exists "$container"; then
        echo "[SKIP] $container (Not installed)"
        return
    }
    
    status=$(docker inspect -f '{{.State.Health.Status}}' "$container" 2>/dev/null || echo "none")
    state=$(docker inspect -f '{{.State.Status}}' "$container" 2>/dev/null || echo "unknown")
    
    if [ "$status" = "healthy" ]; then
        echo "[${GREEN}OK${NC}] $container"
    elif [ "$status" = "none" ] && [ "$state" = "running" ]; then
        echo "[${GREEN}OK${NC}] $container (No health check defined)"
    else
        echo "[${RED}FAIL${NC}] $container (Status: $status, State: $state)"
        # Get recent logs for failed containers
        echo "Recent logs:"
        docker logs --tail 5 "$container" 2>&1 | sed 's/^/  /'
    fi
}

# Function to get container port mappings
get_port_mappings() {
    local container=$1
    if container_exists "$container"; then
        docker port "$container" 2>/dev/null || true
    fi
}

# Function to display service URLs
display_service_urls() {
    local domain=${DOMAIN:-}
    local ip
    ip=$(hostname -I | awk '{print $1}')
    
    log_section "Service Access URLs"
    echo "Access your services using these URLs:"
    echo "-------------------------------------------------"
    
    # Core Services
    if container_exists "nginx-proxy-manager"; then
        echo "Nginx Proxy Manager:  http://$ip:81"
    fi
    
    # Media Services
    if container_exists "plex"; then
        echo "Plex:                http://$ip:32400/web"
    fi
    
    # Extra Services
    if container_exists "portainer"; then
        echo "Portainer:           http://$ip:9000"
    fi
    
    # Domain-based services (if domain is configured)
    if [ -n "$domain" ]; then
        echo
        echo "Once DNS is configured, you can access services at:"
        echo "-------------------------------------------------"
        echo "Authelia:            https://auth.$domain"
        if container_exists "plex"; then
            echo "Plex:                https://plex.$domain"
        fi
        if container_exists "sonarr"; then
            echo "Sonarr:              https://sonarr.$domain"
        fi
        if container_exists "radarr"; then
            echo "Radarr:              https://radarr.$domain"
        fi
    fi
}

# Function to check network connectivity
check_network() {
    log_section "Network Connectivity"
    
    # Check DNS resolution
    if host google.com >/dev/null 2>&1; then
        log_info "DNS Resolution: OK"
    else
        log_error "DNS Resolution: Failed"
    fi
    
    # Check internet connectivity
    if ping -c 1 8.8.8.8 >/dev/null 2>&1; then
        log_info "Internet Connectivity: OK"
    else
        log_error "Internet Connectivity: Failed"
    fi
    
    # Check required ports
    local ports=(80 443 81)
    echo "Port Status:"
    for port in "${ports[@]}"; do
        if netstat -tuln | grep -q ":$port "; then
            echo "  Port $port: ${GREEN}Open${NC}"
        else
            echo "  Port $port: ${RED}Closed${NC}"
        fi
    done
}

# Function to check security configuration
check_security() {
    log_section "Security Configuration"
    
    # Check UFW status
    if command -v ufw >/dev/null 2>&1; then
        if ufw status | grep -q "Status: active"; then
            log_info "UFW Firewall: Active"
            echo "Allowed ports:"
            ufw status | grep ALLOW | sed 's/^/  /'
        else
            log_warn "UFW Firewall: Inactive"
        fi
    else
        log_error "UFW Firewall: Not installed"
    fi
    
    # Check Fail2Ban status
    if command -v fail2ban-client >/dev/null 2>&1; then
        if systemctl is-active fail2ban >/dev/null 2>&1; then
            log_info "Fail2Ban: Active"
            echo "Active jails:"
            fail2ban-client status | grep "Jail list" | sed 's/^.*://' | tr ',' '\n' | sed 's/^/  /'
        else
            log_warn "Fail2Ban: Inactive"
        fi
    else
        log_error "Fail2Ban: Not installed"
    fi
    
    # Check SSL certificates
    if [ -d "./npm/letsencrypt" ]; then
        log_info "SSL Certificates directory exists"
    else
        log_warn "SSL Certificates directory not found"
    fi
}

# Function to check directory permissions
check_permissions() {
    log_section "Directory Permissions"
    
    # Load environment variables
    if [ -f "./config.env" ]; then
        # shellcheck disable=SC1091
        source ./config.env
    fi
    
    local dirs=(
        "${MEDIA_DIR:-/opt/media-server/media}"
        "${DOWNLOADS_DIR:-/opt/media-server/downloads}"
        "./npm"
        "./authelia"
    )
    
    for dir in "${dirs[@]}"; do
        if [ -d "$dir" ]; then
            local perms
            perms=$(stat -c "%U:%G" "$dir")
            echo "$dir: $perms"
            if [ "$perms" != "${PUID:-1000}:${PGID:-1000}" ]; then
                log_warn "Incorrect permissions on $dir"
            fi
        else
            log_error "Directory not found: $dir"
        fi
    done
}

# Function to check web interface
check_web_interface() {
    log_section "Web Interface Check"
    
    # Check if Python HTTP server is running
    if pgrep -f "python.*http.server.*8080" >/dev/null; then
        log_info "Web interface server: Running"
        if curl -s http://localhost:8080 >/dev/null; then
            log_info "Web interface accessible: Yes"
        else
            log_warn "Web interface accessible: No"
        fi
    else
        log_info "Web interface server: Not running"
    fi
}

# Function to check system resources
check_system_resources() {
    log_section "System Resources"
    
    # Check CPU usage
    local cpu_usage
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}')
    echo "CPU Usage: $cpu_usage%"
    
    # Check memory usage
    local mem_total
    local mem_used
    local mem_free
    mem_total=$(free -h | awk '/^Mem:/ {print $2}')
    mem_used=$(free -h | awk '/^Mem:/ {print $3}')
    mem_free=$(free -h | awk '/^Mem:/ {print $4}')
    echo "Memory: Used=$mem_used, Free=$mem_free, Total=$mem_total"
    
    # Check disk usage
    echo "Disk Usage:"
    df -h / | tail -n 1 | awk '{print "  Root: Used="$3", Free="$4", Total="$2}'
    if [ -d "/opt/media-server" ]; then
        df -h /opt/media-server | tail -n 1 | awk '{print "  Media: Used="$3", Free="$4", Total="$2}'
    fi
}

# Function to check Docker status
check_docker() {
    log_section "Docker Status"
    
    # Check Docker service
    if systemctl is-active docker >/dev/null 2>&1; then
        log_info "Docker service: Active"
    else
        log_error "Docker service: Inactive"
        return
    fi
    
    # Check Docker Compose
    if command -v docker-compose >/dev/null 2>&1; then
        log_info "Docker Compose: Installed"
    else
        log_error "Docker Compose: Not installed"
    fi
    
    # Display Docker info
    echo "Docker Version:"
    docker version --format 'Client: {{.Client.Version}}\nServer: {{.Server.Version}}' 2>/dev/null || log_error "Failed to get Docker version"
    
    echo -e "\nDocker Networks:"
    docker network ls --format "  {{.Name}}" 2>/dev/null || log_error "Failed to list Docker networks"
}

# Main function
main() {
    log_section "Post-Installation Check"
    
    # Check core components
    check_network
    check_security
    check_docker
    check_permissions
    check_web_interface
    
    # Check containers
    log_section "Container Health Check"
    
    # Check core services
    check_container "nginx-proxy-manager"
    check_container "authelia"
    check_container "fail2ban"
    check_container "watchtower"
    
    # Check media services
    check_container "plex"
    check_container "sonarr"
    check_container "radarr"
    check_container "overseerr"
    
    # Check download services
    check_container "qbittorrent"
    check_container "prowlarr"
    check_container "sabnzbd"
    
    # Check extra services
    check_container "portainer"
    check_container "tautulli"
    check_container "organizr"
    
    # Check system resources
    check_system_resources
    
    # Display service URLs
    display_service_urls
    
    log_section "Next Steps"
    echo "1. Configure Nginx Proxy Manager at http://$ip:81"
    echo "   Default credentials:"
    echo "   Email:    admin@example.com"
    echo "   Password: changeme"
    echo
    echo "2. Set up Authelia authentication"
    echo "3. Configure individual services through their web interfaces"
    echo "4. Set up SSL certificates in Nginx Proxy Manager"
    
    log_info "\nPost-installation check complete!"
}

# Run main function
main "$@"

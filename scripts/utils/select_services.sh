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

# Log functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Error handler
trap 'log_error "An error occurred on line $LINENO. Exiting..."; exit 1' ERR

# Check if yq is installed (required for YAML processing)
if ! command -v yq &> /dev/null; then
    log_error "yq is required but not installed. Please install it first."
    log_info "On macOS: brew install yq"
    log_info "On Ubuntu: snap install yq"
    exit 1
fi

# Initialize variables
SELECTED_SERVICES=()
COMPOSE_FILES=("docker-compose.core.yml") # Core services are always included

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

# Function to check dependencies
check_dependencies() {
    local service="$1"
    local deps
    
    # Get dependencies from catalog
    deps=$(yq e ".service_groups.*.services.$service.depends_on[]" "$PROJECT_DIR/services/catalog.yml" 2>/dev/null)
    
    if [[ -n "$deps" ]]; then
        for dep in $deps; do
            if [[ ! " ${SELECTED_SERVICES[@]} " =~ " ${dep} " ]]; then
                log_warn "Service $service requires $dep. Adding it automatically."
                SELECTED_SERVICES+=("$dep")
            fi
        done
    fi
}

# Main function to select services
select_services() {
    log_info "Welcome to the Monsterr Media Server service selection"
    log_info "Core services (Nginx Proxy Manager, Authelia) will be installed automatically"
    echo

    # Read service groups from catalog
    local groups
    groups=$(yq e '.service_groups | keys | .[]' "$PROJECT_DIR/services/catalog.yml")

    for group in $groups; do
        # Skip core group as it's mandatory
        if [[ "$group" == "core" ]]; then
            continue
        fi

        echo
        log_info "=== ${group^} Services ==="
        
        # Get services in this group
        local services
        services=$(yq e ".service_groups.$group.services | keys | .[]" "$PROJECT_DIR/services/catalog.yml")

        for service in $services; do
            local description
            description=$(yq e ".service_groups.$group.services.$service.description" "$PROJECT_DIR/services/catalog.yml")
            
            if prompt_yes_no "Install $service ($description)?"; then
                SELECTED_SERVICES+=("$service")
                check_dependencies "$service"
                
                # Add corresponding compose file if it exists
                local compose_file="docker-compose.${group}.yml"
                if [[ -f "$PROJECT_DIR/$compose_file" ]] && [[ ! " ${COMPOSE_FILES[@]} " =~ " ${compose_file} " ]]; then
                    COMPOSE_FILES+=("$compose_file")
                fi
            fi
        done
    done
}

# Function to generate final docker-compose.yml
generate_compose() {
    local output="$PROJECT_DIR/docker-compose.yml"
    local compose_command="docker compose"
    
    # Build the docker compose command
    for file in "${COMPOSE_FILES[@]}"; do
        compose_command+=" -f $file"
    done
    
    # Generate the combined compose file
    log_info "Generating docker-compose.yml..."
    $compose_command config > "$output"
    
    if [[ $? -eq 0 ]]; then
        log_info "Successfully generated $output"
        log_info "Selected services: ${SELECTED_SERVICES[*]}"
        echo
        log_info "You can now run: docker compose up -d"
    else
        log_error "Failed to generate docker-compose.yml"
        exit 1
    fi
}

# Main execution
main() {
    # Ensure we're in the project directory
    cd "$PROJECT_DIR"
    
    # Check if catalog exists
    if [[ ! -f "services/catalog.yml" ]]; then
        log_error "Service catalog not found at services/catalog.yml"
        exit 1
    }
    
    # Run service selection
    select_services
    
    # Generate final compose file
    generate_compose
}

# Run main function
main "$@"

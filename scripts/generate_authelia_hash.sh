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

# Function to validate password strength
validate_password() {
    local password=$1
    local length=${#password}
    
    # Check minimum length
    if [ "$length" -lt 8 ]; then
        log_error "Password must be at least 8 characters long"
        return 1
    fi
    
    # Check for uppercase letters
    if [[ ! "$password" =~ [A-Z] ]]; then
        log_error "Password must contain at least one uppercase letter"
        return 1
    fi
    
    # Check for lowercase letters
    if [[ ! "$password" =~ [a-z] ]]; then
        log_error "Password must contain at least one lowercase letter"
        return 1
    fi
    
    # Check for numbers
    if [[ ! "$password" =~ [0-9] ]]; then
        log_error "Password must contain at least one number"
        return 1
    fi
    
    # Check for special characters
    if [[ ! "$password" =~ [!@#\$%^&*] ]]; then
        log_error "Password must contain at least one special character (!@#$%^&*)"
        return 1
    fi
    
    return 0
}

# Function to generate a secure random password
generate_password() {
    local length=16
    local chars='!@#$%^&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    local password=""
    
    # Ensure at least one of each required character type
    password+=${chars:$((RANDOM % 8)):1}  # special char
    password+=${chars:$((RANDOM % 10 + 8)):1}  # number
    password+=${chars:$((RANDOM % 26 + 18)):1}  # uppercase
    password+=${chars:$((RANDOM % 26 + 44)):1}  # lowercase
    
    # Fill rest with random characters
    while [ ${#password} -lt $length ]; do
        password+=${chars:$((RANDOM % ${#chars})):1}
    done
    
    # Shuffle the password
    echo "$password" | fold -w1 | shuf | tr -d '\n'
}

# Main function
main() {
    log_section "Authelia Password Hash Generator"
    echo "This script will help you generate a secure password hash for Authelia"
    echo "The hash will use Argon2id with secure parameters"
    echo
    
    # Offer to generate a secure password
    if [ "$#" -eq 0 ]; then
        echo "Would you like to:"
        echo "1) Generate a secure random password"
        echo "2) Enter your own password"
        
        local choice
        read -p "Enter your choice (1-2): " choice
        
        case $choice in
            1)
                password=$(generate_password)
                log_info "Generated password: $password"
                echo "Please save this password securely!"
                echo
                ;;
            2)
                while true; do
                    read -s -p "Enter your password: " password
                    echo
                    if validate_password "$password"; then
                        read -s -p "Confirm your password: " password2
                        echo
                        if [ "$password" = "$password2" ]; then
                            break
                        else
                            log_error "Passwords do not match"
                        fi
                    fi
                done
                ;;
            *)
                log_error "Invalid choice"
                exit 1
                ;;
        esac
    else
        password=$1
        if ! validate_password "$password"; then
            exit 1
        fi
    fi
    
    log_info "Generating Argon2id hash..."
    
    # Generate hash using Authelia container
    # Parameters:
    # - m: Memory (65536 = 64MB)
    # - t: Iterations (3 for interactive login)
    # - p: Parallelism (4 threads)
    hash=$(docker run --rm authelia/authelia:latest authelia hash-password "$password" -m 65536 -t 3 -p 4)
    
    echo
    log_info "Password hash generated successfully!"
    echo
    echo "Add the following to your users_database.yml:"
    echo "----------------------------------------"
    echo "password: $hash"
    echo "----------------------------------------"
}

# Run main function with all arguments
main "$@"

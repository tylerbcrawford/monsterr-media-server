#!/bin/bash

# Exit on error
set -e

echo "Running installation integration tests..."

# Test environment setup
TEST_DIR=$(mktemp -d)
trap 'rm -rf "$TEST_DIR"' EXIT

# Copy necessary files to test directory
cp -r . "$TEST_DIR/"
cd "$TEST_DIR"

# Test installation script
echo "Testing installation script..."
sudo ./install_media_server.sh --test

# Test configuration
echo "Testing configuration..."
sudo ./scripts/utils/post_install_check.sh --config

# Test services
echo "Testing services..."
sudo ./scripts/utils/post_install_check.sh --services

# Test monitoring
echo "Testing monitoring..."
sudo ./scripts/utils/post_install_check.sh --monitoring

echo "All integration tests passed!"
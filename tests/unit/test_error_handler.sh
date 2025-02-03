#!/bin/bash

# Exit on error
set -e

echo "Running error handler unit tests..."

# Source error handler
source ../../scripts/utils/error_handler.sh

# Test error state saving
test_error_state_saving() {
    echo "Testing error state saving..."
    save_error_state 1 "test.sh" 10 "Test error"
    
    if [ ! -f "$STATE_DIR/last_error.json" ]; then
        echo "FAIL: Error state file not created"
        exit 1
    fi
    
    if ! grep -q "Test error" "$STATE_DIR/last_error.json"; then
        echo "FAIL: Error message not found in state file"
        exit 1
    fi
    
    echo "PASS: Error state saving"
}

# Test error recovery
test_error_recovery() {
    echo "Testing error recovery..."
    save_error_state 1 "test.sh" 10 "Test error"
    
    if ! attempt_recovery 1; then
        echo "FAIL: Recovery attempt failed"
        exit 1
    fi
    
    echo "PASS: Error recovery"
}

# Test cleanup
test_cleanup() {
    echo "Testing cleanup..."
    cleanup_error_states
    
    if [ -f "$STATE_DIR/last_error.json.1" ]; then
        echo "FAIL: Old error states not cleaned up"
        exit 1
    fi
    
    echo "PASS: Cleanup"
}

# Run tests
test_error_state_saving
test_error_recovery
test_cleanup

echo "All unit tests passed!"
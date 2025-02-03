#!/bin/bash

# Exit on error
set -e

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Setting up development environment..."

# Install development dependencies
echo "Installing development dependencies..."
if command -v npm >/dev/null 2>&1; then
    cd "$PROJECT_DIR/src/web_interface"
    npm install
else
    echo "Error: npm not found. Please install Node.js and npm first."
    exit 1
fi

# Set up git hooks
echo "Setting up git hooks..."
if [ -d "$PROJECT_DIR/.git" ]; then
    # Pre-commit hook for linting and testing
    cat > "$PROJECT_DIR/.git/hooks/pre-commit" << 'EOF'
#!/bin/bash
set -e

echo "Running pre-commit checks..."

# Check for shellcheck
if ! command -v shellcheck >/dev/null 2>&1; then
    echo "Error: shellcheck not found. Please install shellcheck."
    exit 1
fi

# Lint shell scripts
echo "Linting shell scripts..."
find . -type f -name "*.sh" -exec shellcheck {} \;

# Run tests if web interface files changed
if git diff --cached --name-only | grep -q "src/web_interface/"; then
    echo "Running web interface tests..."
    cd src/web_interface
    npm test
fi

echo "All pre-commit checks passed!"
EOF
    chmod +x "$PROJECT_DIR/.git/hooks/pre-commit"

    # Pre-push hook for full test suite
    cat > "$PROJECT_DIR/.git/hooks/pre-push" << 'EOF'
#!/bin/bash
set -e

echo "Running pre-push checks..."

# Run all tests
echo "Running test suite..."
cd tests/unit
./test_error_handler.sh
cd ../integration
./test_installation.sh

echo "All pre-push checks passed!"
EOF
    chmod +x "$PROJECT_DIR/.git/hooks/pre-push"
else
    echo "Warning: .git directory not found. Skipping git hooks setup."
fi

# Set up test environment
echo "Setting up test environment..."
chmod +x "$PROJECT_DIR/tests/unit/test_error_handler.sh"
chmod +x "$PROJECT_DIR/tests/integration/test_installation.sh"

# Create development configuration
echo "Creating development configuration..."
if [ ! -f "$PROJECT_DIR/config.env" ]; then
    cp "$PROJECT_DIR/sample_config.env" "$PROJECT_DIR/config.env"
    echo "Created config.env from sample. Please update with your development settings."
fi

# Set up VSCode settings
echo "Setting up VSCode configuration..."
mkdir -p "$PROJECT_DIR/.vscode"
cat > "$PROJECT_DIR/.vscode/settings.json" << 'EOF'
{
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "shellcheck.enable": true,
    "shellcheck.useWorkspaceRootAsCwd": true,
    "shellcheck.run": "onSave",
    "files.associations": {
        "*.timer": "systemd-unit",
        "*.service": "systemd-unit"
    }
}
EOF

echo "Development environment setup complete!"
echo
echo "Next steps:"
echo "1. Update config.env with your development settings"
echo "2. Run the test suite: cd tests && ./run_tests.sh"
echo "3. Start the development server: cd src/web_interface && npm run dev"
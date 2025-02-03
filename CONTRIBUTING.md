# Contributing to Monsterr Media Server

First off, thank you for considering contributing to Monsterr Media Server! It's people like you that make it such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the [issue list](../../issues) as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps to reproduce the problem
* Provide specific examples to demonstrate the steps
* Include the debug information from `collect_debug_info.sh`
* Describe the behavior you observed and what behavior you expected
* Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* A clear and descriptive title
* A detailed description of the proposed functionality
* Any possible implementation details you have in mind
* Why this enhancement would be useful to most users

### Pull Requests

* Fill in the required template
* Follow the style guides
* Include appropriate tests
* Update documentation as needed
* End all files with a newline

## Development Process

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/your-username/monsterr-media-server.git
cd monsterr-media-server

# Install dependencies
sudo ./scripts/install/install_dependencies.sh

# Set up web interface
cd src/web_interface
npm install
```

### Directory Structure

```
/
├── .github/                    # GitHub specific files
├── config/                    # Configuration files
├── docs/                      # Documentation
├── scripts/                   # Shell scripts
├── src/                      # Source code
├── tests/                    # Test files
└── tools/                    # Development tools
```

### Style Guides

#### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * 🐛 `:bug:` when fixing a bug
    * ✨ `:sparkles:` when adding a new feature
    * 📝 `:memo:` when writing docs
    * 🔧 `:wrench:` when updating configuration
    * ⚡️ `:zap:` when improving performance
    * 🔒 `:lock:` when dealing with security

#### JavaScript Style Guide

* Use ESLint with the provided configuration
* Follow the Prettier formatting rules
* Use ES6+ features when appropriate
* Add JSDoc comments for functions and complex code blocks

#### Shell Script Style Guide

* Follow [Google's Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
* Use ShellCheck to validate scripts
* Include usage documentation in script headers
* Add error handling and logging

#### Documentation Style Guide

* Use Markdown for documentation
* Keep line length to 80 characters
* Use atx-style headers with a space after the #
* Include code examples when relevant
* Update table of contents when adding sections

### Testing

* Write unit tests for new features
* Ensure all tests pass before submitting PR
* Include integration tests when appropriate
* Test on multiple platforms if possible

```bash
# Run unit tests
cd src/web_interface
npm test

# Run integration tests
cd tests/integration
./run_tests.sh
```

### Documentation

* Update README.md if needed
* Add/update API documentation
* Include inline code documentation
* Update guides as necessary

## Project Management

### Issue Labels

* `bug` - Something isn't working
* `enhancement` - New feature or request
* `documentation` - Documentation improvements
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention needed
* `security` - Security-related issues

### Development Workflow

1. **Pick an issue** to work on or create a new one
2. **Create a branch** from main
3. **Make changes** and commit them
4. **Run tests** and ensure they pass
5. **Submit PR** for review
6. **Address feedback** if any
7. **Merge** once approved

## Questions?

* Check the [Troubleshooting Guide](docs/guides/troubleshooting.md)
* Join our [Discord community](https://discord.gg/your-server)
* Create a [GitHub Discussion](../../discussions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

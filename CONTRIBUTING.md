# Contributing to Monsterr Media Server

Thank you for your interest in contributing to Monsterr Media Server! This document provides guidelines and instructions for contributing to the project.

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## 🔄 Development Workflow

1. **Fork the Repository**
   - Fork the repository to your GitHub account
   - Clone your fork locally
   ```bash
   git clone https://github.com/yourusername/monsterr-media-server.git
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

3. **Make Changes**
   - Write clean, maintainable code
   - Follow existing code style and conventions
   - Add comments where necessary
   - Update documentation as needed

4. **Test Your Changes**
   - Test the installation process
   - Verify all services work correctly
   - Check security implications
   - Test on different Linux distributions if possible

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```
   
   Commit message format:
   - feat: New feature
   - fix: Bug fix
   - docs: Documentation changes
   - style: Formatting, missing semicolons, etc.
   - refactor: Code restructuring
   - test: Adding tests
   - chore: Maintenance tasks

6. **Submit a Pull Request**
   - Push to your fork
   - Submit a PR to the main repository
   - Provide a clear description of the changes
   - Link any related issues

## 📝 Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Include tests if adding new functionality
- Update documentation as needed
- Ensure all tests pass
- Follow the existing code style
- Add screenshots for UI changes

## 🧪 Testing

- Test installation on a fresh system
- Verify all services start correctly
- Check resource usage
- Test backup and restore functionality
- Validate security measures

## 📚 Documentation

When updating documentation:
- Use clear, concise language
- Include code examples where appropriate
- Add screenshots for UI-related changes
- Update the README.md if needed
- Keep the wiki in sync with changes

## 🏗️ Project Structure

```
monsterr-media-server/
├── scripts/              # Installation and setup scripts
├── docs/                 # Detailed documentation
├── web_config_interface/ # Web-based configuration UI
└── authelia/            # Authentication configuration
```

## 🔍 Code Review Process

1. All PRs require review before merging
2. Address review comments promptly
3. Keep discussions focused and professional
4. Request re-review after making changes

## 🐛 Bug Reports

When submitting bug reports:
1. Use the issue template
2. Include system information
3. Provide clear reproduction steps
4. Add relevant logs
5. Describe expected vs actual behavior

## 💡 Feature Requests

When proposing new features:
1. Use the feature request template
2. Explain the use case
3. Describe expected behavior
4. Consider implementation details
5. Discuss potential impacts

## 🛠️ Development Setup

1. **Requirements**
   - Docker and Docker Compose
   - Node.js for web interface development
   - Git for version control

2. **Local Development**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/monsterr-media-server.git
   cd monsterr-media-server

   # Install dependencies
   ./scripts/install_dependencies.sh

   # Start services
   docker-compose up -d
   ```

## 📊 Performance Considerations

- Monitor resource usage
- Optimize Docker configurations
- Consider multi-architecture support
- Test with various hardware configurations

## 🔒 Security Guidelines

- Never commit sensitive information
- Use environment variables for secrets
- Follow security best practices
- Implement proper access controls
- Regular security audits

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤔 Questions?

- Create an issue for general questions
- Join our community discussions
- Check existing documentation first

Thank you for contributing to Monsterr Media Server! Your efforts help make this project better for everyone.

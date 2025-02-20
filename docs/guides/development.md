# Development Guide

## Overview

This guide provides instructions for setting up a development environment for the Monsterr Media Server project, focusing on the React-based setup wizard and web interface.

## Prerequisites

### System Requirements

*   Node.js 18.0.0 or higher
*   npm 9.0.0 or higher
*   Docker and Docker Compose
*   Git

### Development Tools

*   Visual Studio Code (recommended)
*   Chrome DevTools
*   React Developer Tools

## Project Structure

```
src/web_interface/
├── dashboard/          # Dashboard components
├── setup/             # Setup wizard
│   ├── components/    # React components
│   ├── hooks/        # Custom React hooks
│   └── utils/        # Utility functions
└── shared/           # Shared code
    └── server.js     # Express server
```

## Getting Started

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/tylerbcrawford/monsterr-media-server.git
    cd monsterr-media-server
    ```

2.  **Install Dependencies:**

    ```bash
    cd src/web_interface
    npm install
    ```

3.  **Set Up Environment:**

    ```bash
    # Copy sample configuration
    cp sample_config.env .env

    # Edit configuration
    nano .env
    ```

    Required environment variables:

    ```
    NODE_ENV=development
    PORT=3000
    API_PORT=8080
    ```

## Development Workflow

### Running the Development Server

1.  **Start the API Server (Terminal 1):**

    ```bash
    npm run setup
    ```

2.  **Start the React Development Server (Terminal 2):**

    ```bash
    npm run dev
    ```

The setup wizard will be available at:

*   Web Interface: `http://localhost:3000`
*   API Server: `http://localhost:8080`

### Development Scripts

*   `npm run dev`: Start Vite development server
*   `npm run setup`: Start setup API server
*   `npm run build`: Build production assets
*   `npm run test`: Run test suite
*   `npm run lint`: Run ESLint
*   `npm run format`: Format code with Prettier

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
└── __mocks__/        # Test mocks
```

### Writing Tests

1.  **Component Tests:**

    ```javascript
    import { render, screen } from '@testing-library/react';
    import { ServiceSelection } from './ServiceSelection';

    describe('ServiceSelection', () => {
      it('renders service options', () => {
        render(<ServiceSelection />);
        expect(screen.getByText('Core Services')).toBeInTheDocument();
      });
    });
    ```

2.  **API Tests:**

    ```javascript
    import request from 'supertest';
    import app from '../shared/server';

    describe('Setup API', () => {
      it('validates system requirements', async () => {
        const response = await request(app).post('/api/setup/system-check');
        expect(response.status).toBe(200);
      });
    });
    ```

## Code Style

### ESLint Configuration

The project uses ESLint with the following configuration:

*   React recommended rules
*   React Hooks rules
*   Prettier integration

### Prettier Configuration

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "tabWidth": 2,
  "semi": true
}
```

### Git Workflow

1.  **Branch Naming:**

    *   Features: `feature/description`
    *   Fixes: `fix/description`
    *   Documentation: `docs/description`

2.  **Commit Messages:**  Follow conventional commits:

    ```
    feat: Add new feature
    fix: Fix bug
    docs: Update documentation
    chore: Update dependencies
    ```

## Debugging

### Browser DevTools

1.  **React Developer Tools:**
    *   Component inspection
    *   Props/state monitoring
    *   Performance profiling

2.  **Network Tab:**
    *   API request monitoring
    *   Response inspection
    *   Network performance

### Server Debugging

1.  **Debug Logs:**

    ```bash
    # View API server logs
    tail -f logs/setup-api.log

    # View development server logs
    npm run dev -- --debug
    ```

2.  **Node.js Inspector:**

    ```bash
    # Start API server in debug mode
    node --inspect shared/setup_server.js
    ```

## Building for Production

1.  **Build Assets:**

    ```bash
    npm run build
    ```

2.  **Test Production Build:**

    ```bash
    # Serve production build
    npm run preview
    ```

3.  **Docker Build:**

    ```bash
    # Build container
    docker build -t monsterr-setup .

    # Run container
    docker run -p 3000:3000 monsterr-setup
    ```

## Troubleshooting

### Common Issues

1.  **Port Conflicts:**

    ```bash
    # Check ports in use
    lsof -i :3000
    lsof -i :8080

    # Kill process using port
    kill -9 <PID>
    ```

2.  **Node Version Mismatch:**

    ```bash
    # Install correct Node version
    nvm install 18
    nvm use 18
    ```

3.  **Build Errors:**

    ```bash
    # Clear cache and node_modules
    rm -rf node_modules
    rm -rf dist
    npm cache clean --force
    npm install
    ```

## Contributing

1.  Fork the repository.
2.  Create a feature branch.
3.  Make your changes.
4.  Run tests and linting.
5.  Submit a pull request.

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for detailed guidelines.

## Resources

*   [React Documentation](https://reactjs.org/)
*   [Material-UI Documentation](https://mui.com/)
*   [Vite Documentation](https://vitejs.dev/)
*   [Docker Documentation](https://docs.docker.com/)
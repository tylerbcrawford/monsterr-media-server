# Setup Wizard API and UI Documentation

## Overview

The Setup Wizard provides a streamlined interface for configuring and deploying the Monsterr Media Server. It consists of both a React-based UI and supporting API endpoints.

## UI Components

### Setup Wizard Navigation

The wizard uses a standardized navigation bar with six steps:

1. System
2. Services
3. Storage
4. Network
5. Security
6. Deploy

Each step is represented by a menu bubble with:

* Fixed width (120px)
* Center-aligned text
* State-based styling:
    * Active: Blue (#1976d2)
    * Completed: Green (#4caf50)
    * Inactive: Gray (#e0e0e0)

```jsx
// Example StepBubble component usage
<StepBubble
  completed={stepIndex < activeStep}
  active={stepIndex === activeStep}
>
  {stepLabel}
</StepBubble>
```

## API Endpoints

All API endpoints are prefixed with `/api/setup/`.

### System Check

Validates system requirements and dependencies.

```http
POST /api/setup/system-check
```

#### Response

```json
{
  "cpu": {
    "cores": 4,
    "model": "Intel(R) Core(TM) i7"
  },
  "memory": {
    "total": 16,
    "free": 8
  },
  "docker": {
    "installed": true,
    "version": "24.0.7"
  },
  "dockerCompose": {
    "installed": true,
    "version": "2.21.0"
  },
  "network": {
    "portsAvailable": true
  }
}
```

### Validate Path

Validates and creates storage paths if they don't exist.

```http
POST /api/setup/validate-path
```

#### Request Body

```json
{
  "path": "/opt/media-server/media"
}
```

#### Response

```json
{
  "valid": true,
  "space": 1099511627776,
  "isDirectory": true
}
```

### Validate Domain

Validates domain configuration and DNS resolution.

```http
POST /api/setup/validate-domain
```

#### Request Body

```json
{
  "domain": "media.example.com"
}
```

#### Response

```json
{
  "valid": true
}
```

### Check Port

Checks if a network port is available.

```http
POST /api/setup/check-port
```

#### Request Body

```json
{
  "port": 80
}
```

#### Response

```json
{
  "available": true
}
```

### Create Directories

Creates required system directories.

```http
POST /api/setup/create-directories
```

#### Response

```json
{
  "success": true
}
```

### Pull Docker Images

Pulls required Docker images.

```http
POST /api/setup/pull-images
```

#### Response

```json
{
  "success": true
}
```

### Deploy Services

Deploys configured services.

```http
POST /api/setup/deploy
```

#### Request Body

```json
{
  "config": {
    "domain": "media.example.com",
    "email": "admin@example.com",
    "services": {
      "core": true,
      "media": true,
      "downloads": true,
      "books": false,
      "monitoring": true
    },
    "storage": {
      "mediaPath": "/opt/media-server/media",
      "downloadPath": "/opt/media-server/downloads",
      "configPath": "/opt/media-server/config"
    },
    "security": {
      "twoFactor": true,
      "fail2ban": true,
      "vpn": true
    }
  }
}
```

#### Response

```json
{
  "success": true
}
```

## Error Handling

All endpoints return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

* 200: Success
* 400: Bad Request (invalid input)
* 500: Internal Server Error

## Rate Limiting

* Maximum 60 requests per minute per IP
* Rate limit headers included in responses:
    * `X-RateLimit-Limit`
    * `X-RateLimit-Remaining`
    * `X-RateLimit-Reset`

## Security

* All endpoints require a CSRF token.
* Required Headers:
    * `X-CSRF-Token`
    * `Content-Type: application/json`

## Example Usage

### React Component

```jsx
import React, { useState } from 'react';
import { StepBubble } from './components';

const steps = [
  { label: 'System', path: '' },
  { label: 'Services', path: 'services' },
  { label: 'Storage', path: 'storage' },
  { label: 'Network', path: 'network' },
  { label: 'Security', path: 'security' },
  { label: 'Deploy', path: 'review' }
];

const SetupWizard = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <StepBubble
          key={step.label}
          completed={index < activeStep}
          active={index === activeStep}
        >
          {step.label}
        </StepBubble>
      ))}
    </div>
  );
};
```

### API Integration

```javascript
import axios from 'axios';

// Check system requirements
const checkSystem = async () => {
  try {
    const response = await axios.post('/api/setup/system-check');
    return response.data;
  } catch (error) {
    console.error('System check failed:', error);
    throw error;
  }
};

// Validate storage path
const validatePath = async (path) => {
  try {
    const response = await axios.post('/api/setup/validate-path', { path });
    return response.data;
  } catch (error) {
    console.error('Path validation failed:', error);
    throw error;
  }
};

// Deploy services
const deploy = async (config) => {
  try {
    const response = await axios.post('/api/setup/deploy', { config });
    return response.data;
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
};
```

## WebSocket Events

The setup wizard provides real-time updates through WebSocket connections.

### Connection

```javascript
const socket = io('/setup');
```

### Events

* `system:update`: System status updates
* `deployment:progress`: Deployment progress updates
* `service:status`: Service status changes

### Example WebSocket Usage

```javascript
socket.on('deployment:progress', (data) => {
  console.log('Deployment progress:', data.progress);
  console.log('Current step:', data.step);
});

socket.on('service:status', (data) => {
  console.log('Service:', data.service);
  console.log('Status:', data.status);
});
```

## Version History

### v1.1.0 (2025-02-15)

* Added standardized menu bubble interface
* Updated step labels for better clarity
* Added UI component documentation
* Improved state management examples

### v1.0.0 (2025-01-01)

* Initial release of setup wizard
* Basic API endpoints
* WebSocket integration
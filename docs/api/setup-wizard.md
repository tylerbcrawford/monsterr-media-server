# Setup Wizard API Documentation

## Overview
The Setup Wizard API provides endpoints for system validation, configuration, and deployment of the Monsterr Media Server. This API is used by the React-based setup wizard interface.

## Base URL
All API endpoints are prefixed with `/api/setup/`

## Endpoints

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
- 200: Success
- 400: Bad Request (invalid input)
- 500: Internal Server Error

## Rate Limiting
- Maximum 60 requests per minute per IP
- Rate limit headers included in responses:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

## Security
- All endpoints require CSRF token
- Headers required:
  - X-CSRF-Token
  - Content-Type: application/json

## Example Usage

### JavaScript/Axios
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
The setup wizard also provides real-time updates through WebSocket connections:

### Connection
```javascript
const socket = io('/setup');
```

### Events
- `system:update`: System status updates
- `deployment:progress`: Deployment progress updates
- `service:status`: Service status changes

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
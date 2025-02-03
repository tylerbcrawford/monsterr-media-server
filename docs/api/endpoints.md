# API Documentation

## Overview
This document describes the REST API endpoints provided by the Monsterr Media Server web interface.

## Base URL
All endpoints are relative to: `http://localhost:3000/api/v1`

## Authentication
All endpoints require authentication via Authelia. Include the authentication token in the `Authorization` header:
```
Authorization: Bearer <token>
```

## Endpoints

### System Status

#### GET /status
Get current system status and resource usage.

**Response**
```json
{
  "status": "running",
  "uptime": "10d 4h 30m",
  "cpu_usage": 45.2,
  "memory_usage": 6.8,
  "disk_usage": 75.3
}
```

### Configuration

#### GET /config
Get current system configuration.

**Response**
```json
{
  "domain": "media.example.com",
  "media_dir": "/opt/media-server/media",
  "downloads_dir": "/opt/media-server/downloads",
  "services": ["plex", "sonarr", "radarr"]
}
```

#### PUT /config
Update system configuration.

**Request Body**
```json
{
  "domain": "media.example.com",
  "media_dir": "/opt/media-server/media",
  "downloads_dir": "/opt/media-server/downloads",
  "services": ["plex", "sonarr", "radarr"]
}
```

### Services

#### GET /services
List all services and their status.

**Response**
```json
{
  "services": [
    {
      "name": "plex",
      "status": "running",
      "port": 32400,
      "url": "https://plex.media.example.com"
    },
    {
      "name": "sonarr",
      "status": "running",
      "port": 8989,
      "url": "https://sonarr.media.example.com"
    }
  ]
}
```

#### POST /services/{name}/restart
Restart a specific service.

**Parameters**
- name: Service name (e.g., plex, sonarr)

### Monitoring

#### GET /metrics
Get system metrics and statistics.

**Response**
```json
{
  "cpu": {
    "usage": 45.2,
    "temperature": 55.0,
    "cores": [40.1, 42.3, 48.5, 50.1]
  },
  "memory": {
    "total": 16.0,
    "used": 6.8,
    "free": 9.2
  },
  "disk": {
    "total": 2000.0,
    "used": 1506.0,
    "free": 494.0
  },
  "network": {
    "download_speed": 15.6,
    "upload_speed": 2.3,
    "total_downloaded": 1024.5,
    "total_uploaded": 256.2
  }
}
```

### Logs

#### GET /logs
Get system logs.

**Query Parameters**
- level: Log level (info, warn, error)
- limit: Number of log entries (default: 100)
- since: Timestamp to fetch logs from

**Response**
```json
{
  "logs": [
    {
      "timestamp": "2025-02-03T18:15:23Z",
      "level": "info",
      "message": "Service plex started successfully"
    },
    {
      "timestamp": "2025-02-03T18:15:20Z",
      "level": "error",
      "message": "Failed to connect to database"
    }
  ]
}
```

### Error Handling

All endpoints follow standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include details:
```json
{
  "error": {
    "code": "SERVICE_NOT_FOUND",
    "message": "Service 'invalid' not found",
    "details": "Available services: plex, sonarr, radarr"
  }
}
```

## Rate Limiting
API requests are limited to 100 requests per minute per IP address.

## Versioning
The API follows semantic versioning. Breaking changes will result in a new major version number.
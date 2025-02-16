# API Documentation

## Overview
This document describes the REST API endpoints provided by the Monsterr Media Server web interface and its integrated services.

## Base URL
All web interface endpoints are relative to: `http://localhost:3000/api/v1`

## Authentication
All endpoints require authentication via Authelia. Include the authentication token in the `Authorization` header:
```
Authorization: Bearer <token>
```

## Web Interface Endpoints

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

#### WebSocket Connection
Connect to the monitoring WebSocket endpoint for real-time updates:
```
ws://localhost:3001/monitoring
```

**Events**
- `metrics`: Real-time system metrics
- `alert`: New system alerts
- `status`: Service status changes

Example WebSocket message:
```json
{
  "type": "metrics",
  "data": {
    "cpu": {
      "usage": 45.2,
      "status": "healthy",
      "temperature": 55.0,
      "cores": [40.1, 42.3, 48.5, 50.1]
    },
    "memory": {
      "usage": 68.5,
      "status": "warning",
      "total": 16.0,
      "used": 6.8,
      "free": 9.2
    },
    "disk": {
      "usage": 75.3,
      "status": "healthy",
      "total": 2000.0,
      "used": 1506.0,
      "free": 494.0
    },
    "network": {
      "status": "healthy",
      "latency": 25,
      "download_speed": 15.6,
      "upload_speed": 2.3,
      "total_downloaded": 1024.5,
      "total_uploaded": 256.2
    }
  }
}
```

#### GET /metrics/history
Get historical system metrics.

**Query Parameters**
- start: Start timestamp (ISO 8601)
- end: End timestamp (ISO 8601)
- resolution: Data point interval (e.g., "5m", "1h")

**Response**
```json
{
  "metrics": [
    {
      "timestamp": "2025-02-15T22:40:00Z",
      "cpu": {
        "usage": 45.2,
        "temperature": 55.0
      },
      "memory": {
        "usage": 68.5,
        "total": 16.0,
        "used": 6.8
      },
      "disk": {
        "usage": 75.3,
        "free": 494.0
      }
    }
  ],
  "resolution": "5m",
  "start": "2025-02-15T22:00:00Z",
  "end": "2025-02-15T23:00:00Z"
}
```

#### GET /metrics/current
Get current system metrics snapshot.

**Response**
```json
{
  "timestamp": "2025-02-15T22:45:00Z",
  "metrics": {
    "cpu": {
      "usage": 45.2,
      "status": "healthy",
      "temperature": 55.0,
      "cores": [40.1, 42.3, 48.5, 50.1]
    },
    "memory": {
      "usage": 68.5,
      "status": "warning",
      "total": 16.0,
      "used": 6.8,
      "free": 9.2
    },
    "disk": {
      "usage": 75.3,
      "status": "healthy",
      "total": 2000.0,
      "used": 1506.0,
      "free": 494.0
    }
  }
}
```

#### GET /alerts
Get system alerts.

**Query Parameters**
- level: Alert level (info, warning, error)
- limit: Number of alerts (default: 100)
- since: Timestamp to fetch alerts from

**Response**
```json
{
  "alerts": [
    {
      "id": "alert-123",
      "timestamp": "2025-02-15T22:35:00Z",
      "level": "error",
      "message": "Container stopped unexpectedly",
      "source": "docker",
      "details": {
        "container": "plex",
        "exitCode": 1
      }
    }
  ],
  "total": 1,
  "hasMore": false
}
```

#### GET /services/health
Get detailed service health status.

**Response**
```json
{
  "services": [
    {
      "name": "plex",
      "status": "running",
      "health": "healthy",
      "lastCheck": "2025-02-15T22:44:00Z",
      "metrics": {
        "uptime": "10d 4h 30m",
        "memory": 1.2,
        "cpu": 5.6
      }
    }
  ]
}
```

#### POST /alerts/settings
Update alert settings.

**Request Body**
```json
{
  "thresholds": {
    "cpu": {
      "warning": 80,
      "critical": 90
    },
    "memory": {
      "warning": 80,
      "critical": 90
    },
    "disk": {
      "warning": 85,
      "critical": 95
    }
  },
  "notifications": {
    "email": true,
    "desktop": true,
    "minLevel": "warning"
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

## Service-Specific APIs

### Plex Media Server
Base URL: `http://localhost:32400`

#### Authentication
Requires Plex token in headers:
```
X-Plex-Token: your_plex_token
```

#### Key Endpoints
- GET `/library/sections`: List all library sections
- GET `/library/sections/{id}/all`: Get all items in a section
- GET `/status/sessions`: Get current playback sessions
- POST `/library/sections/{id}/refresh`: Refresh a library section

### Sonarr
Base URL: `http://localhost:8989/api/v3`

#### Authentication
Requires API key in headers:
```
X-Api-Key: your_sonarr_api_key
```

#### Key Endpoints
- GET `/series`: List all series
- POST `/series`: Add a new series
- GET `/queue`: Get download queue
- POST `/command`: Send commands (e.g., refresh series)

### Radarr
Base URL: `http://localhost:7878/api/v3`

#### Authentication
Requires API key in headers:
```
X-Api-Key: your_radarr_api_key
```

#### Key Endpoints
- GET `/movie`: List all movies
- POST `/movie`: Add a new movie
- GET `/queue`: Get download queue
- POST `/command`: Send commands (e.g., refresh movies)

### Prowlarr
Base URL: `http://localhost:9696/api/v1`

#### Authentication
Requires API key in headers:
```
X-Api-Key: your_prowlarr_api_key
```

#### Key Endpoints
- GET `/indexer`: List all indexers
- POST `/indexer/test/{id}`: Test an indexer
- GET `/health`: Get system health

### Overseerr
Base URL: `http://localhost:5055/api/v1`

#### Authentication
Requires API key in headers:
```
X-Api-Key: your_overseerr_api_key
```

#### Key Endpoints
- GET `/request`: List all requests
- POST `/request`: Create new request
- GET `/user`: List all users
- GET `/status`: Get system status

### Tautulli
Base URL: `http://localhost:8181/api/v2`

#### Authentication
Requires API key as query parameter:
```
?apikey=your_tautulli_api_key
```

#### Key Endpoints
- GET `/get_activity`: Get current activity
- GET `/get_libraries`: Get all libraries
- GET `/get_history`: Get watch history
- GET `/get_users`: Get all users

## Error Handling

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

## Integration Examples

### Python Example
```python
import requests
import websockets
import asyncio
import json

# Previous examples remain unchanged

async def monitor_system_metrics():
    uri = "ws://localhost:3001/monitoring"
    async with websockets.connect(uri) as websocket:
        while True:
            try:
                message = await websocket.recv()
                data = json.loads(message)
                
                if data['type'] == 'metrics':
                    print(f"CPU Usage: {data['data']['cpu']['usage']}%")
                    print(f"Memory Usage: {data['data']['memory']['usage']}%")
                elif data['type'] == 'alert':
                    print(f"Alert: {data['data']['message']}")
            except websockets.exceptions.ConnectionClosed:
                print("Connection lost. Reconnecting...")
                break

def get_historical_metrics(start_time, end_time, resolution="5m"):
    response = requests.get(
        "http://localhost:3000/api/v1/metrics/history",
        params={
            "start": start_time,
            "end": end_time,
            "resolution": resolution
        }
    )
    return response.json()

def get_sonarr_series(api_key, base_url="http://localhost:8989"):
    headers = {"X-Api-Key": api_key}
    response = requests.get(f"{base_url}/api/v3/series", headers=headers)
    return response.json()

def add_movie_to_radarr(api_key, tmdb_id, base_url="http://localhost:7878"):
    headers = {"X-Api-Key": api_key}
    data = {
        "tmdbId": tmdb_id,
        "qualityProfileId": 1,
        "rootFolderPath": "/media/movies"
    }
    response = requests.post(f"{base_url}/api/v3/movie", headers=headers, json=data)
    return response.json()
```

### JavaScript Example
```javascript
// Monitoring WebSocket Client
class MonitoringClient {
  constructor(baseUrl = 'ws://localhost:3001') {
    this.baseUrl = baseUrl;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    this.socket = new WebSocket(`${this.baseUrl}/monitoring`);
    
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'metrics':
          this.handleMetrics(data.data);
          break;
        case 'alert':
          this.handleAlert(data.data);
          break;
        case 'status':
          this.handleStatus(data.data);
          break;
      }
    };

    this.socket.onclose = () => {
      console.log('Connection closed');
      this.reconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
    }
  }

  handleMetrics(metrics) {
    console.log('System Metrics:', metrics);
    // Implement your metrics handling logic
  }

  handleAlert(alert) {
    console.log('New Alert:', alert);
    // Implement your alert handling logic
  }

  handleStatus(status) {
    console.log('Service Status:', status);
    // Implement your status handling logic
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

// Historical metrics example
async function getHistoricalMetrics(startTime, endTime, resolution = '5m') {
  const response = await fetch(
    `/api/v1/metrics/history?start=${startTime}&end=${endTime}&resolution=${resolution}`
  );
  return response.json();
}

// Previous examples remain unchanged
async function getPlexSessions(plexToken, baseUrl = 'http://localhost:32400') {
  const headers = {
    'X-Plex-Token': plexToken,
    'Accept': 'application/json'
  };
  
  const response = await fetch(`${baseUrl}/status/sessions`, { headers });
  return response.json();
}

async function createOverseerrRequest(apiKey, mediaType, tmdbId, baseUrl = 'http://localhost:5055') {
  const headers = {
    'X-Api-Key': apiKey,
    'Content-Type': 'application/json'
  };
  
  const data = {
    mediaType,
    mediaId: tmdbId
  };
  
  const response = await fetch(`${baseUrl}/api/v1/request`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  
  return response.json();
}
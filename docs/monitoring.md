# Monitoring Guide

This guide covers the monitoring and alerting setup for the Monsterr Media Server, including Prometheus, Grafana, and service-specific monitoring.

## Table of Contents
- [Monitoring Architecture](#monitoring-architecture)
- [Prometheus Setup](#prometheus-setup)
- [Grafana Configuration](#grafana-configuration)
- [Service-Specific Monitoring](#service-specific-monitoring)
- [Alert Configuration](#alert-configuration)
- [Dashboard Templates](#dashboard-templates)

## Monitoring Architecture

### Overview
```
Services → Prometheus → Grafana → Alerts
                    ↓
              Node Exporter
                    ↓
             System Metrics
```

### Components
- Prometheus: Metrics collection
- Grafana: Visualization
- Node Exporter: System metrics
- Service Exporters: Application metrics
- Alert Manager: Notification system

## Prometheus Setup

### Basic Configuration

1. **prometheus.yml**
   ```yaml
   global:
     scrape_interval: 15s
     evaluation_interval: 15s

   alerting:
     alertmanagers:
       - static_configs:
           - targets: ['alertmanager:9093']

   rule_files:
     - "/etc/prometheus/rules/*.yml"

   scrape_configs:
     - job_name: 'prometheus'
       static_configs:
         - targets: ['localhost:9090']

     - job_name: 'node'
       static_configs:
         - targets: ['node-exporter:9100']

     - job_name: 'docker'
       static_configs:
         - targets: ['docker-exporter:9323']
   ```

2. **Alert Rules**
   ```yaml
   # /etc/prometheus/rules/alerts.yml
   groups:
     - name: basic_alerts
       rules:
         - alert: HighCPUUsage
           expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) > 80
           for: 5m
           labels:
             severity: warning
           annotations:
             summary: High CPU usage detected
   ```

### Node Exporter Setup

```yaml
node-exporter:
  image: prom/node-exporter:latest
  container_name: node-exporter
  restart: unless-stopped
  volumes:
    - /proc:/host/proc:ro
    - /sys:/host/sys:ro
    - /:/rootfs:ro
  command:
    - '--path.procfs=/host/proc'
    - '--path.sysfs=/host/sys'
    - '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc)($$|/)'
```

## Grafana Configuration

### Initial Setup

1. **Basic Configuration**
   ```yaml
   grafana:
     image: grafana/grafana:latest
     environment:
       - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}
       - GF_USERS_ALLOW_SIGN_UP=false
     volumes:
       - ./grafana/data:/var/lib/grafana
       - ./grafana/provisioning:/etc/grafana/provisioning
   ```

2. **Data Source Configuration**
   ```yaml
   # /etc/grafana/provisioning/datasources/prometheus.yml
   apiVersion: 1
   datasources:
     - name: Prometheus
       type: prometheus
       access: proxy
       url: http://prometheus:9090
       isDefault: true
   ```

### Dashboard Setup

1. **System Overview**
   - CPU Usage
   - Memory Usage
   - Disk I/O
   - Network Traffic

2. **Docker Metrics**
   - Container Status
   - Resource Usage
   - Network Stats

3. **Service Health**
   - Uptime
   - Response Time
   - Error Rates

## Service-Specific Monitoring

### Plex Monitoring (Tautulli)

1. **Configuration**
   ```yaml
   tautulli:
     image: lscr.io/linuxserver/tautulli:latest
     volumes:
       - ./tautulli/config:/config
       - ./plex/config/Library/Application Support/Plex Media Server/Logs:/logs:ro
   ```

2. **Metrics Collection**
   - Active Streams
   - Bandwidth Usage
   - User Statistics
   - Library Stats

### Download Clients

1. **qBittorrent Metrics**
   - Download Speed
   - Upload Speed
   - Active Torrents
   - Queue Status

2. **NZBGet Metrics**
   - Download Speed
   - Queue Size
   - Disk Usage
   - Article Health

## Alert Configuration

### Alert Manager Setup

1. **Basic Configuration**
   ```yaml
   # alertmanager.yml
   global:
     smtp_smarthost: 'smtp.gmail.com:587'
     smtp_from: 'alertmanager@example.com'
     smtp_auth_username: 'your-email@gmail.com'
     smtp_auth_password: 'your-password'

   route:
     group_by: ['alertname']
     group_wait: 30s
     group_interval: 5m
     repeat_interval: 4h
     receiver: 'email-notifications'

   receivers:
     - name: 'email-notifications'
       email_configs:
         - to: 'your-email@example.com'
   ```

2. **Notification Channels**
   - Email
   - Discord
   - Slack
   - Telegram

### Alert Rules

1. **System Alerts**
   ```yaml
   - alert: DiskSpaceLow
     expr: node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"} * 100 < 10
     for: 5m
     labels:
       severity: warning
     annotations:
       summary: Low disk space on root partition
   ```

2. **Service Alerts**
   ```yaml
   - alert: ServiceDown
     expr: up == 0
     for: 1m
     labels:
       severity: critical
     annotations:
       summary: Service {{ $labels.job }} is down
   ```

## Dashboard Templates

### System Dashboard

```json
{
  "dashboard": {
    "title": "System Overview",
    "panels": [
      {
        "title": "CPU Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "100 - (avg by (instance) (rate(node_cpu_seconds_total{mode=\"idle\"}[1m])) * 100)"
          }
        ]
      }
    ]
  }
}
```

### Media Server Dashboard

```json
{
  "dashboard": {
    "title": "Media Server Overview",
    "panels": [
      {
        "title": "Active Streams",
        "type": "stat",
        "targets": [
          {
            "expr": "tautulli_current_streams"
          }
        ]
      }
    ]
  }
}
```

## Best Practices

### Data Retention

1. **Prometheus**
   ```yaml
   prometheus:
     command:
       - '--storage.tsdb.retention.time=15d'
       - '--storage.tsdb.retention.size=5GB'
   ```

2. **Grafana**
   - Dashboard backup
   - Regular pruning
   - Data source cleanup

### Performance Optimization

1. **Scrape Intervals**
   - Balance frequency vs. resource usage
   - Adjust based on metrics importance
   - Consider storage implications

2. **Query Optimization**
   - Use efficient PromQL
   - Implement recording rules
   - Cache dashboard results

## Additional Resources
- [Installation Guide](installation.md)
- [Security Guide](security.md)
- [Services Guide](services.md)
- [Troubleshooting Guide](troubleshooting.md)

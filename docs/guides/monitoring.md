# System Monitoring Guide

## Overview

The Monsterr Media Server monitoring system provides comprehensive system monitoring through a real-time web dashboard and automated health checks. It tracks system resources, container health, and network connectivity, providing visual insights and notifications when attention is needed.

## Features

*   Real-time monitoring dashboard
*   System resource visualization
*   Service health tracking
*   Alert management interface
*   Network status monitoring
*   Performance metrics graphs
*   Container health status checks
*   Automated notifications
*   Daily health summaries
*   Log management system

## Installation

1.  Run the setup script as root:

    ```bash
    sudo ./scripts/setup_monitoring.sh
    ```

    This will:

    *   Create necessary log directories.
    *   Install required dependencies.
    *   Set up log rotation.
    *   Install and start the monitoring services.
    *   Configure the dashboard.
    *   Create default configuration.

2.  Verify the installation:

    ```bash
    # Check monitoring service
    systemctl status monsterr-monitor

    # Check dashboard service
    systemctl status monsterr-dashboard
    ```

## Dashboard Access

The monitoring dashboard is available at:

```
https://dashboard.yourdomain.com/monitoring
```

### Dashboard Features

1.  **System Metrics:**
    *   Real-time CPU, memory, and disk usage graphs
    *   Historical trend visualization
    *   Resource utilization patterns
    *   Performance indicators

2.  **Service Health:**
    *   Container status overview
    *   Health check results
    *   Service dependencies
    *   Real-time updates

3.  **Alert Management:**
    *   Active alerts display
    *   Alert history
    *   Severity indicators
    *   Response tracking

4.  **Network Monitoring:**
    *   Connectivity status
    *   Latency tracking
    *   Error reporting
    *   Health indicators

## Configuration

The monitoring system can be configured by editing `config.env`:

```bash
# System Monitoring
DISK_THRESHOLD=90    # Alert when disk usage exceeds 90%
MEMORY_THRESHOLD=90  # Alert when memory usage exceeds 90%
CPU_THRESHOLD=90     # Alert when CPU usage exceeds 90%
CHECK_INTERVAL=5     # Check every 5 minutes

# Dashboard Configuration
DASHBOARD_PORT=3000          # Dashboard web interface port
METRICS_RETENTION=30d        # How long to keep detailed metrics
ALERT_HISTORY=90d           # How long to keep alert history
GRAPH_RESOLUTION=5m         # Data point interval for graphs
```

After changing the configuration:

```bash
# Restart monitoring service
sudo systemctl restart monsterr-monitor

# Restart dashboard service
sudo systemctl restart monsterr-dashboard
```

## Monitoring Components

### System Health Checks

*   Real-time resource monitoring
*   Container health tracking
*   Network connectivity verification
*   Storage utilization checks
*   Service dependency validation
*   Performance metrics collection

### Dashboard Interface

*   Real-time updates via WebSocket
*   Interactive metric graphs
*   Service status indicators
*   Alert management interface
*   Network status display
*   Resource utilization trends

### Notifications

The system provides multiple notification channels:

*   Dashboard alerts
*   Desktop notifications
*   Email notifications (if configured)
*   Log entries
*   Daily summary reports

### Logging

Logs are stored in `/var/log/monsterr/`:

*   `monitor.log`: Real-time monitoring events
*   `daily_summary.log`: Daily system status summary
*   `monitor-service.log`: Service-related logs
*   `dashboard.log`: Dashboard application logs

Log rotation is configured to:

*   Rotate logs weekly
*   Keep 4 weeks of history
*   Automatically compress old logs

## Usage

### Dashboard Navigation

1.  **System Overview:**
    *   View current system status
    *   Check resource utilization
    *   Monitor service health
    *   Track active alerts

2.  **Detailed Metrics:**
    *   Access historical data
    *   Analyze trends
    *   Export statistics
    *   Configure thresholds

3.  **Alert Management:**
    *   View active alerts
    *   Check alert history
    *   Configure notifications
    *   Set alert rules

### Command Line Access

```bash
# View recent monitoring events
tail -f /var/log/monsterr/monitor.log

# View today's summary
cat /var/log/monsterr/daily_summary.log

# View service logs
journalctl -u monsterr-monitor

# View dashboard logs
journalctl -u monsterr-dashboard
```

### Service Management

```bash
# Monitoring Service
sudo systemctl start monsterr-monitor
sudo systemctl stop monsterr-monitor
sudo systemctl restart monsterr-monitor

# Dashboard Service
sudo systemctl start monsterr-dashboard
sudo systemctl stop monsterr-dashboard
sudo systemctl restart monsterr-dashboard
```

## Troubleshooting

### Common Issues

1.  **Dashboard Not Loading:**
    *   Check dashboard service status.
    *   Verify network connectivity.
    *   Check browser console for errors.
    *   Verify WebSocket connection.

2.  **Missing Metrics:**
    *   Check monitoring service status.
    *   Verify metric collection interval.
    *   Check database connectivity.
    *   Review service logs.

3.  **Alert Issues:**
    *   Verify notification settings.
    *   Check alert thresholds.
    *   Review alert rules.
    *   Check notification service.

4.  **Performance Issues:**
    *   Adjust metric collection interval.
    *   Review data retention settings.
    *   Check resource usage.
    *   Optimize database queries.

### Log Analysis

```bash
# Find dashboard errors
grep ERROR /var/log/monsterr/dashboard.log

# Find monitoring errors
grep ERROR /var/log/monsterr/monitor.log

# Check WebSocket connections
grep "WebSocket" /var/log/monsterr/dashboard.log

# View metric collection issues
grep "Collection" /var/log/monsterr/monitor.log
```

## Maintenance

### Regular Tasks

1.  Review dashboard metrics.
2.  Check alert history.
3.  Verify data collection.
4.  Update thresholds.
5.  Review performance.
6.  Check log rotation.

### Best Practices

1.  **Resource Management:**
    *   Monitor resource trends.
    *   Act on warnings promptly.
    *   Plan capacity upgrades.
    *   Optimize thresholds.

2.  **Alert Management:**
    *   Configure meaningful thresholds.
    *   Respond to alerts promptly.
    *   Document alert patterns.
    *   Review alert rules.

3.  **Dashboard Usage:**
    *   Check daily summaries.
    *   Review trend graphs.
    *   Monitor service health.
    *   Track performance metrics.

## Support

If you encounter issues:

1.  Check the troubleshooting section.
2.  Review dashboard errors.
3.  Check service logs.
4.  Verify configuration.
5.  Consult documentation.
6.  Contact community support.

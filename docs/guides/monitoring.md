# System Monitoring Guide

## Overview
The Monsterr Media Server monitoring system provides automated health checks and notifications for home users. It tracks system resources, container health, and network connectivity, alerting you when attention is needed.

## Features
- Disk space monitoring for media and system
- Memory and CPU utilization tracking
- Container health status checks
- Network connectivity verification
- Desktop notifications for issues
- Daily health summaries
- Automatic log rotation

## Installation

1. Run the setup script as root:
```bash
sudo ./scripts/setup_monitoring.sh
```

This will:
- Create necessary log directories
- Install required dependencies
- Set up log rotation
- Install and start the systemd service
- Create default configuration

2. Verify the installation:
```bash
systemctl status monsterr-monitor
```

## Configuration

The monitoring system can be configured by editing `config.env`:

```bash
# Monitoring Configuration
DISK_THRESHOLD=90    # Alert when disk usage exceeds 90%
MEMORY_THRESHOLD=90  # Alert when memory usage exceeds 90%
CPU_THRESHOLD=90     # Alert when CPU usage exceeds 90%
CHECK_INTERVAL=5     # Check every 5 minutes
```

After changing configuration:
```bash
sudo systemctl restart monsterr-monitor
```

## Monitoring Components

### System Health Checks
- Disk space usage for media and system directories
- Memory utilization
- CPU load
- Container status and health
- Network connectivity

### Notifications
The system uses desktop notifications (`notify-send`) to alert you about:
- High disk usage
- High memory usage
- High CPU usage
- Container health issues
- Network problems

### Logging
Logs are stored in `/var/log/monsterr/`:
- `monitor.log`: Real-time monitoring events
- `daily_summary.log`: Daily system status summary
- `monitor-service.log`: Service-related logs

Log rotation is configured to:
- Rotate logs weekly
- Keep 4 weeks of history
- Automatically compress old logs

## Usage

### Viewing Logs
```bash
# View recent monitoring events
tail -f /var/log/monsterr/monitor.log

# View today's summary
cat /var/log/monsterr/daily_summary.log

# View service logs
journalctl -u monsterr-monitor
```

### Managing the Service
```bash
# Stop monitoring
sudo systemctl stop monsterr-monitor

# Start monitoring
sudo systemctl start monsterr-monitor

# Restart monitoring
sudo systemctl restart monsterr-monitor

# Disable monitoring
sudo systemctl disable monsterr-monitor

# Enable monitoring
sudo systemctl enable monsterr-monitor
```

## Troubleshooting

### Common Issues

1. Missing Notifications
   - Ensure `libnotify-bin` is installed
   - Check desktop environment is running
   - Verify user permissions

2. Service Not Starting
   ```bash
   # Check service status
   systemctl status monsterr-monitor
   
   # View service logs
   journalctl -u monsterr-monitor -n 50
   ```

3. High Resource Usage
   - Adjust check interval in config.env
   - Modify threshold values
   - Check system resources

### Log Analysis
```bash
# Find error events
grep ERROR /var/log/monsterr/monitor.log

# Find warning events
grep WARNING /var/log/monsterr/monitor.log

# View recent container issues
grep "Container" /var/log/monsterr/monitor.log | tail -n 20
```

## Maintenance

### Regular Tasks
1. Review logs weekly
2. Check daily summaries
3. Verify notification settings
4. Update thresholds if needed

### Log Management
- Logs are automatically rotated weekly
- Old logs are compressed
- Maintain 4 weeks of history

### System Updates
When updating the Monsterr Media Server:
1. Stop the monitoring service
2. Perform system updates
3. Start the monitoring service
4. Verify monitoring is working

## Best Practices

1. Resource Management
   - Act on storage warnings promptly
   - Monitor trends in daily summaries
   - Plan upgrades based on usage patterns

2. Notification Management
   - Keep thresholds appropriate for your system
   - Review and act on warnings promptly
   - Maintain log history for troubleshooting

3. System Maintenance
   - Check logs regularly
   - Update configuration as needed
   - Monitor backup success

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review recent logs
3. Verify configuration
4. Check system resources
5. Consult the community forums

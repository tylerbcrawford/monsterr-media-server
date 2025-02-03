# Troubleshooting Guide

## Overview
This guide helps you diagnose and resolve common issues with Monsterr Media Server. Each section includes error descriptions, possible causes, and step-by-step solutions.

## Error Codes

### Error Code 1: General Configuration Error
**Symptoms:**
- Installation fails to complete
- Services fail to start
- Configuration appears corrupted

**Solutions:**
1. Check configuration file:
   ```bash
   cat config.env
   ```
2. Restore from backup:
   ```bash
   sudo ./scripts/error_handler.sh --restore-config
   ```
3. Re-run setup wizard:
   ```bash
   sudo ./setup_wizard.sh
   ```

### Error Code 2: Permission Error
**Symptoms:**
- Services can't access files
- "Permission denied" errors
- Unable to write to directories

**Solutions:**
1. Check current permissions:
   ```bash
   ls -l /opt/media-server
   ```
2. Fix permissions:
   ```bash
   sudo ./scripts/error_handler.sh --fix-permissions
   ```
3. Verify user/group IDs:
   ```bash
   id -u
   id -g
   ```

### Error Code 3: Network Error
**Symptoms:**
- Services unreachable
- DNS resolution fails
- VPN connection issues

**Solutions:**
1. Check Docker network:
   ```bash
   docker network ls
   docker network inspect proxy
   ```
2. Verify ports:
   ```bash
   sudo netstat -tulpn
   ```
3. Restart network stack:
   ```bash
   sudo ./scripts/error_handler.sh --fix-network
   ```

### Error Code 4: Service Error
**Symptoms:**
- Services crash or fail to start
- Container errors
- Resource allocation issues

**Solutions:**
1. Check service status:
   ```bash
   docker-compose ps
   ```
2. View service logs:
   ```bash
   docker-compose logs [service_name]
   ```
3. Restart services:
   ```bash
   sudo ./scripts/error_handler.sh --restart-services
   ```

## Common Issues

### Installation Issues

#### Setup Wizard Fails
**Problem:** Setup wizard crashes or fails to complete
**Solution:**
1. Check logs:
   ```bash
   tail -f /var/log/monsterr/error.log
   ```
2. Resume installation:
   ```bash
   sudo ./install_media_server.sh --resume
   ```

#### Docker Issues
**Problem:** Docker-related errors during installation
**Solution:**
1. Verify Docker installation:
   ```bash
   docker --version
   docker-compose --version
   ```
2. Reinstall Docker:
   ```bash
   sudo ./scripts/install_docker.sh --force
   ```

### Runtime Issues

#### High CPU/Memory Usage
**Problem:** System resources are heavily utilized
**Solution:**
1. Check resource usage:
   ```bash
   docker stats
   ```
2. Adjust container limits in docker-compose.yml
3. Monitor system:
   ```bash
   sudo ./scripts/post_install_check.sh --resources
   ```

#### Storage Issues
**Problem:** Running out of disk space
**Solution:**
1. Check space usage:
   ```bash
   df -h
   du -sh /opt/media-server/*
   ```
2. Clean up:
   ```bash
   docker system prune
   ```
3. Consider expanding storage

## Recovery Procedures

### 1. Basic Recovery
For minor issues:
```bash
# Check system status
sudo ./scripts/post_install_check.sh --all

# Attempt automatic recovery
sudo ./scripts/error_handler.sh --auto-recover
```

### 2. Configuration Recovery
If configuration is corrupted:
```bash
# Backup current config
cp config.env config.env.bak

# Restore from last known good state
sudo ./scripts/error_handler.sh --restore-config

# Verify configuration
sudo ./scripts/post_install_check.sh --config
```

### 3. Service Recovery
For service-related issues:
```bash
# Stop all services
docker-compose down

# Remove problematic containers
docker-compose rm [service_name]

# Start services
docker-compose up -d
```

### 4. Full System Recovery
For major issues:
```bash
# Full system backup
sudo ./scripts/backup_system.sh

# Reset to clean state
sudo ./scripts/error_handler.sh --reset-system

# Restore configuration
sudo ./scripts/error_handler.sh --restore-config

# Restart all services
docker-compose up -d
```

## Preventive Measures

### 1. Regular Maintenance
- Run health checks weekly:
  ```bash
  sudo ./scripts/post_install_check.sh --all
  ```
- Monitor disk space:
  ```bash
  sudo ./scripts/post_install_check.sh --storage
  ```
- Review logs regularly:
  ```bash
  tail -f /var/log/monsterr/error.log
  ```

### 2. Backup Strategy
- Regular backups:
  ```bash
  sudo ./scripts/backup_system.sh
  ```
- Verify backups:
  ```bash
  sudo ./scripts/backup_system.sh --verify
  ```
- Keep multiple backup copies

### 3. Monitoring
- Check system dashboard regularly
- Set up notifications
- Monitor resource usage

## Getting Help
If you can't resolve an issue:

1. Collect system information:
   ```bash
   sudo ./scripts/post_install_check.sh --report
   ```

2. Check logs:
   ```bash
   sudo ./scripts/error_handler.sh --collect-logs
   ```

3. Create an issue on GitHub with:
   - Error logs
   - System report
   - Steps to reproduce
   - Recent changes made
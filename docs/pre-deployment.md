# Pre-Deployment Checklist

Before deploying your Monsterr Media Server, use this checklist to ensure everything is properly configured and ready for testing.

## System Requirements

- [ ] Ubuntu 20.04+ or Debian-based system
- [ ] Minimum 2 CPU cores
- [ ] Minimum 4GB RAM
- [ ] Minimum 20GB free disk space
- [ ] Active internet connection
- [ ] Required ports (80, 443, 81) available

## Network Configuration

- [ ] Static IP configured (if not using DDNS)
- [ ] DDNS configured (if using dynamic IP)
- [ ] Router port forwarding set up:
  - [ ] Port 80 (HTTP)
  - [ ] Port 443 (HTTPS)
  - [ ] Port 81 (NPM Admin)
  - [ ] Custom SSH port (if configured)
- [ ] DNS records configured:
  - [ ] A record for main domain
  - [ ] CNAME/A records for subdomains
  - [ ] DNS propagation verified

## Directory Structure

- [ ] Media directory exists and is writable
  - [ ] Correct ownership (PUID:PGID)
  - [ ] Proper permissions (755)
  - [ ] Sufficient disk space
- [ ] Downloads directory exists and is writable
  - [ ] Correct ownership (PUID:PGID)
  - [ ] Proper permissions (755)
  - [ ] Sufficient disk space
- [ ] External drives mounted (if used)
  - [ ] Mount points exist
  - [ ] fstab entries added
  - [ ] Mounts verified

## Security Configuration

- [ ] UFW firewall enabled (if selected)
  - [ ] Required ports open
  - [ ] Default deny policy active
- [ ] Fail2Ban configured (if selected)
  - [ ] SSH jail active
  - [ ] NPM jail active
- [ ] Custom SSH port configured (if used)
  - [ ] Port forwarding updated
  - [ ] UFW rules updated
- [ ] SSL certificates ready
  - [ ] Domain validation possible
  - [ ] Email for Let's Encrypt notifications

## Docker Configuration

- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Docker service active
- [ ] User added to docker group
- [ ] Docker networks created:
  - [ ] proxy network
  - [ ] downloads network

## Service Configuration

- [ ] config.env file exists
  - [ ] All required variables set
  - [ ] Paths correctly configured
  - [ ] Credentials set
- [ ] Service selection completed
  - [ ] Dependencies resolved
  - [ ] Ports verified
- [ ] Docker Compose files generated
  - [ ] Volume mounts correct
  - [ ] Network configuration correct

## Web Interface

- [ ] Web interface accessible
- [ ] Forms working correctly
- [ ] Configuration saving properly
- [ ] Responsive design working

## Backup Preparation

- [ ] Backup directory configured
- [ ] Backup schedule set
- [ ] Test backup possible
- [ ] Restore procedure documented

## Documentation

- [ ] Installation guide reviewed
- [ ] Configuration steps documented
- [ ] Custom paths noted
- [ ] Recovery procedures documented
- [ ] User instructions clear

## Testing Environment

- [ ] Clean test environment available
- [ ] Required tools installed:
  - [ ] Git
  - [ ] curl
  - [ ] wget
  - [ ] netstat
  - [ ] Python 3
- [ ] Test user accounts ready
- [ ] Test data available

## Post-Deployment Verification

- [ ] post_install_check.sh ready
- [ ] Container health checks configured
- [ ] Monitoring setup prepared
- [ ] Logging configured
- [ ] Backup verification planned

## Recovery Plan

- [ ] Backup strategy documented
- [ ] Restore procedures tested
- [ ] Rollback plan prepared
- [ ] Configuration backups ready
- [ ] Emergency contacts listed

## Notes

- Document any custom configurations or special requirements
- Note any deviations from default settings
- List any environment-specific considerations
- Record any known issues or limitations

## Final Checks

1. Run system requirements check:
   ```bash
   sudo ./install_media_server.sh --check-only
   ```

2. Verify network configuration:
   ```bash
   sudo ./scripts/post_install_check.sh --network
   ```

3. Test security settings:
   ```bash
   sudo ./scripts/post_install_check.sh --security
   ```

4. Validate directory permissions:
   ```bash
   sudo ./scripts/post_install_check.sh --permissions
   ```

5. Check service configuration:
   ```bash
   sudo ./scripts/post_install_check.sh --services
   ```

Once all items are checked and verified, you can proceed with the deployment by running:
```bash
sudo ./install_media_server.sh
```

Remember to monitor the installation process and check the logs for any warnings or errors.

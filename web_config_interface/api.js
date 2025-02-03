const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Base monitoring data path
const MONITOR_LOG = '/var/log/monsterr/monitor.log';
const BACKUP_LOG = '/var/log/monsterr/backup.log';

// Get system monitoring data
router.get('/api/monitoring/status', async (req, res) => {
    try {
        const data = await collectSystemData();
        res.json(data);
    } catch (error) {
        console.error('Error fetching monitoring data:', error);
        res.status(500).json({ error: 'Failed to fetch monitoring data' });
    }
});

// Collect all system data
async function collectSystemData() {
    const [cpu, memory, storage, network, services, events, backup, security, updates] = await Promise.all([
        getCpuUsage(),
        getMemoryUsage(),
        getStorageUsage(),
        getNetworkStatus(),
        getServicesStatus(),
        getRecentEvents(),
        getBackupStatus(),
        getSecurityStatus(),
        getUpdatesStatus()
    ]);

    return {
        status: 'online',
        cpu,
        memory,
        storage,
        network,
        services,
        events,
        backup,
        security,
        updates,
        timestamp: new Date().toISOString()
    };
}

// Get CPU usage
async function getCpuUsage() {
    const { stdout } = await execAsync("top -bn1 | grep 'Cpu(s)' | awk '{print $2}'");
    return {
        usage: parseFloat(stdout.trim())
    };
}

// Get memory usage
async function getMemoryUsage() {
    const { stdout } = await execAsync('free -b');
    const lines = stdout.trim().split('\n');
    const memory = lines[1].split(/\s+/);
    return {
        total: parseInt(memory[1]),
        used: parseInt(memory[2]),
        free: parseInt(memory[3])
    };
}

// Get storage usage
async function getStorageUsage() {
    const { stdout } = await execAsync('df -B1 /opt/media-server');
    const lines = stdout.trim().split('\n');
    const storage = lines[1].split(/\s+/);
    return {
        total: parseInt(storage[1]),
        used: parseInt(storage[2]),
        free: parseInt(storage[3])
    };
}

// Get network status
async function getNetworkStatus() {
    try {
        await execAsync('ping -c 1 8.8.8.8');
        return {
            status: 'Connected',
            latency: 'Good'
        };
    } catch {
        return {
            status: 'Disconnected',
            latency: 'N/A'
        };
    }
}

// Get services status
async function getServicesStatus() {
    const { stdout } = await execAsync('docker ps --format "{{.Names}},{{.Status}}"');
    const services = stdout.trim().split('\n').map(line => {
        const [name, status] = line.split(',');
        return {
            name,
            status: status.includes('Up') ? 'running' : 'stopped',
            icon: getServiceIcon(name)
        };
    });
    return services;
}

// Get service icon
function getServiceIcon(serviceName) {
    const icons = {
        plex: 'play-circle',
        sonarr: 'tv',
        radarr: 'film',
        lidarr: 'music',
        readarr: 'book',
        prowlarr: 'search',
        qbittorrent: 'download',
        nginx: 'server',
        default: 'cube'
    };
    return icons[serviceName.toLowerCase()] || icons.default;
}

// Get recent events
async function getRecentEvents() {
    const logContent = await fs.readFile(MONITOR_LOG, 'utf8');
    const events = logContent.trim().split('\n')
        .slice(-10) // Get last 10 events
        .map(line => {
            const match = line.match(/\[(.*?)\] \[(.*?)\] (.*)/);
            if (match) {
                return {
                    timestamp: match[1],
                    type: match[2].toLowerCase(),
                    title: match[3]
                };
            }
            return null;
        })
        .filter(event => event !== null)
        .reverse();
    return events;
}

// Get backup status
async function getBackupStatus() {
    try {
        const logContent = await fs.readFile(BACKUP_LOG, 'utf8');
        const lastBackup = logContent.trim().split('\n')
            .reverse()
            .find(line => line.includes('Backup completed successfully'));
        
        const match = lastBackup ? lastBackup.match(/\[(.*?)\]/) : null;
        return {
            lastBackup: match ? match[1] : 'Never',
            status: match ? 'Success' : 'Unknown'
        };
    } catch {
        return {
            lastBackup: 'Never',
            status: 'Unknown'
        };
    }
}

// Get security status
async function getSecurityStatus() {
    try {
        const [fail2ban, ufw] = await Promise.all([
            execAsync('systemctl is-active fail2ban'),
            execAsync('systemctl is-active ufw')
        ]);
        return {
            status: fail2ban.stdout.trim() === 'active' && ufw.stdout.trim() === 'active'
                ? 'Protected'
                : 'Warning'
        };
    } catch {
        return {
            status: 'Unknown'
        };
    }
}

// Get updates status
async function getUpdatesStatus() {
    try {
        const { stdout } = await execAsync('docker ps -q | wc -l');
        const containers = parseInt(stdout.trim());
        return {
            available: containers,
            lastChecked: new Date().toISOString()
        };
    } catch {
        return {
            available: 0,
            lastChecked: 'Unknown'
        };
    }
}

module.exports = router;
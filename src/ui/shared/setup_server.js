import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import winston from 'winston';
import Docker from 'dockerode';

const execAsync = promisify(exec);
const docker = new Docker();

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'setup.log' }),
    new winston.transports.Console(),
  ],
});

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Error handler
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error',
  });
};

// System check endpoint
app.post('/api/setup/system-check', async (req, res) => {
  try {
    const cpus = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

    // Check Docker installation
    const dockerInstalled = await docker.ping().then(
      () => true,
      () => false
    );

    // Check Docker Compose
    const dockerComposeVersion = await execAsync('docker-compose --version')
      .then((result) => result.stdout.trim())
      .catch(() => null);

    // Check available ports
    const checkPort = async (port) => {
      try {
        await execAsync(`nc -z localhost ${port}`);
        return false; // Port is in use
      } catch {
        return true; // Port is available
      }
    };

    const ports = await Promise.all([
      checkPort(80),
      checkPort(443),
      checkPort(81),
    ]);

    res.json({
      cpu: {
        cores: cpus.length,
        model: cpus[0].model,
      },
      memory: {
        total: Math.floor(totalMemory / (1024 * 1024 * 1024)), // GB
        free: Math.floor(freeMemory / (1024 * 1024 * 1024)), // GB
      },
      docker: {
        installed: dockerInstalled,
        version: dockerInstalled
          ? (await docker.version()).Version
          : null,
      },
      dockerCompose: {
        installed: !!dockerComposeVersion,
        version: dockerComposeVersion,
      },
      network: {
        portsAvailable: ports.every(Boolean),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Validate path endpoint
app.post('/api/setup/validate-path', async (req, res) => {
  try {
    const { path: dirPath } = req.body;

    // Check if path exists
    let stats;
    try {
      stats = await fs.stat(dirPath);
    } catch {
      // Create directory if it doesn't exist
      await fs.mkdir(dirPath, { recursive: true });
      stats = await fs.stat(dirPath);
    }

    // Check permissions
    const testFile = path.join(dirPath, '.test');
    try {
      await fs.writeFile(testFile, '');
      await fs.unlink(testFile);
    } catch (error) {
      throw new Error('Insufficient permissions');
    }

    // Get available space
    const { available } = await fs.statfs(dirPath);

    res.json({
      valid: true,
      space: available,
      isDirectory: stats.isDirectory(),
    });
  } catch (error) {
    res.json({
      valid: false,
      error: error.message,
    });
  }
});

// Import axios for API requests
import axios from 'axios';

// Validate domain endpoint
app.post('/api/setup/validate-domain', async (req, res) => {
  try {
    const { domain } = req.body;

    // Basic domain validation
    const domainRegex = /^([a-zA-Z0-9]-?)*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      throw new Error('Invalid domain format');
    }

    // Check DNS resolution
    await execAsync(`dig +short ${domain}`);

    res.json({
      valid: true,
    });
  } catch (error) {
    res.json({
      valid: false,
      error: error.message,
    });
  }
});

// Validate DDNS credentials endpoint
app.post('/api/setup/validate-ddns', async (req, res) => {
  try {
    const { provider, username, password } = req.body;

    if (provider !== 'dynu') {
      throw new Error('Only Dynu DDNS is supported');
    }

    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    // Test credentials with Dynu API
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    try {
      const response = await axios.get('https://api.dynu.com/v2/dns', {
        headers: {
          'Authorization': `Basic ${auth}`,
          'User-Agent': 'monsterr-media-server/1.0'
        }
      });

      if (response.status === 200) {
        res.json({
          valid: true,
          message: 'DDNS credentials validated successfully'
        });
      } else {
        throw new Error('Invalid response from DDNS provider');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        res.json({
          valid: false,
          error: 'Invalid DDNS credentials'
        });
      } else {
        throw new Error('Failed to connect to DDNS provider');
      }
    }
  } catch (error) {
    res.json({
      valid: false,
      error: error.message
    });
  }
});

// Check port endpoint
app.post('/api/setup/check-port', async (req, res) => {
  try {
    const { port } = req.body;

    if (port < 1 || port > 65535) {
      throw new Error('Invalid port number');
    }

    try {
      await execAsync(`nc -z localhost ${port}`);
      res.json({
        available: false,
        error: 'Port is already in use',
      });
    } catch {
      res.json({
        available: true,
      });
    }
  } catch (error) {
    res.json({
      available: false,
      error: error.message,
    });
  }
});

// Create directories endpoint
app.post('/api/setup/create-directories', async (req, res) => {
  try {
    const dirs = [
      '/opt/media-server/media',
      '/opt/media-server/downloads',
      '/opt/media-server/config',
      '/opt/media-server/backups',
    ];

    await Promise.all(
      dirs.map((dir) => fs.mkdir(dir, { recursive: true }))
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Pull Docker images endpoint
app.post('/api/setup/pull-images', async (req, res) => {
  try {
    const images = [
      'jc21/nginx-proxy-manager:latest',
      'authelia/authelia:latest',
      'redis:latest',
      'lscr.io/linuxserver/plex:latest',
      'ghcr.io/hotio/qbittorrent:latest',
      'lscr.io/linuxserver/sonarr:latest',
      'lscr.io/linuxserver/radarr:latest',
    ];

    for (const image of images) {
      await docker.pull(image);
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Deploy services endpoint
app.post('/api/setup/deploy', async (req, res) => {
  try {
    const { config } = req.body;

    // Create config directory if it doesn't exist
    await fs.mkdir('/opt/media-server/config', { recursive: true });

    // Save DDNS configuration if enabled
    if (config.useDDNS) {
      const ddnsConfig = {
        enabled: true,
        provider: 'dynu',
        domain: config.domain.value,
        username: config.ddnsUsername.value,
        password: config.ddnsPassword.value,
        updateInterval: config.ddnsUpdateInterval.value,
        ipType: config.ddnsIpType.value
      };

      // Save DDNS configuration to file
      await fs.writeFile(
        '/opt/media-server/config/ddns.json',
        JSON.stringify(ddnsConfig, null, 2)
      );

      // Set proper permissions
      await execAsync('chmod 600 /opt/media-server/config/ddns.json');

      logger.info('DDNS configuration saved successfully');
    }

    // Generate docker-compose.yml with DDNS service if enabled
    const composeConfig = {
      version: '3',
      services: {
        // ... other services ...
      }
    };

    if (config.useDDNS) {
      composeConfig.services.ddns = {
        image: 'ghcr.io/hotio/ddns-updater:latest',
        container_name: 'ddns-updater',
        environment: [
          'PUID=1000',
          'PGID=1000',
          'TZ=Etc/UTC',
          'DDNS_PROVIDER=dynu',
          `DDNS_DOMAIN=${config.domain.value}`,
          `DDNS_USERNAME=${config.ddnsUsername.value}`,
          `DDNS_PASSWORD=${config.ddnsPassword.value}`,
          `UPDATE_INTERVAL=${config.ddnsUpdateInterval.value}`
        ],
        restart: 'unless-stopped',
        volumes: [
          '/opt/media-server/config/ddns.json:/config/ddns.json:ro'
        ]
      };
    }

    // Generate environment variables
    // Start services
    // Configure security
    // Verify deployment

    res.json({ success: true });
  } catch (error) {
    logger.error('Deployment error:', error);
    next(error);
  }
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Setup server running on port ${PORT}`);
});
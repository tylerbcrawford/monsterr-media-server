import Docker from 'dockerode';
import { ConfigService } from '../../core/config/ConfigService';
import { PlexConfig, SonarrConfig, RadarrConfig } from '../../types/services';

// Initialize Docker client
export const docker = new Docker();

// Test configuration service
export const configService = new ConfigService();

// Docker container configurations
export const containerConfigs = {
  plex: {
    Image: 'plexinc/pms-docker:latest',
    name: 'test-plex',
    Env: [
      'PLEX_CLAIM=test-claim-token',
      'ADVERTISE_IP=http://localhost:32400'
    ],
    HostConfig: {
      PortBindings: {
        '32400/tcp': [{ HostPort: '32400' }]
      },
      Binds: [
        '/tmp/test-media/movies:/data/movies',
        '/tmp/test-media/tv:/data/tv'
      ]
    }
  },
  sonarr: {
    Image: 'linuxserver/sonarr:latest',
    name: 'test-sonarr',
    Env: [
      'PUID=1000',
      'PGID=1000'
    ],
    HostConfig: {
      PortBindings: {
        '8989/tcp': [{ HostPort: '8989' }]
      },
      Binds: [
        '/tmp/test-media/tv:/tv',
        '/tmp/test-downloads:/downloads'
      ]
    }
  },
  radarr: {
    Image: 'linuxserver/radarr:latest',
    name: 'test-radarr',
    Env: [
      'PUID=1000',
      'PGID=1000'
    ],
    HostConfig: {
      PortBindings: {
        '7878/tcp': [{ HostPort: '7878' }]
      },
      Binds: [
        '/tmp/test-media/movies:/movies',
        '/tmp/test-downloads:/downloads'
      ]
    }
  }
};

// Service configurations for testing
export const serviceConfigs = {
  plex: {
    enabled: true,
    port: 32400,
    host: 'localhost',
    basePath: '/media',
    apiKey: 'test-plex-token',
    claimToken: 'test-claim-token',
    libraries: {
      movies: '/data/movies',
      tvShows: '/data/tv',
      music: '/data/music'
    },
    transcoding: {
      enabled: true,
      hardwareAcceleration: false,
      maxSessions: 2
    }
  } as PlexConfig,
  sonarr: {
    enabled: true,
    port: 8989,
    host: 'localhost',
    basePath: '/api',
    apiKey: 'test-sonarr-key',
    mediaRoot: '/tv',
    qualityProfile: 'HD-1080p',
    languageProfile: 'English',
    downloadClient: 'qBittorrent'
  } as SonarrConfig,
  radarr: {
    enabled: true,
    port: 7878,
    host: 'localhost',
    basePath: '/api',
    apiKey: 'test-radarr-key',
    mediaRoot: '/movies',
    qualityProfile: 'HD-1080p',
    minimumAvailability: 'released',
    downloadClient: 'qBittorrent'
  } as RadarrConfig
};

// Helper function to create test directories
export const createTestDirectories = async () => {
  const directories = [
    '/tmp/test-media/movies',
    '/tmp/test-media/tv',
    '/tmp/test-media/music',
    '/tmp/test-downloads'
  ];

  for (const dir of directories) {
    await new Promise<void>((resolve, reject) => {
      const mkdirProcess = require('child_process').spawn('mkdir', ['-p', dir]);
      mkdirProcess.on('close', (code: number) => {
        if (code === 0) resolve();
        else reject(new Error(`Failed to create directory: ${dir}`));
      });
    });
  }
};

// Helper function to clean up test directories
export const cleanupTestDirectories = async () => {
  await new Promise<void>((resolve, reject) => {
    const rmProcess = require('child_process').spawn('rm', ['-rf', '/tmp/test-media', '/tmp/test-downloads']);
    rmProcess.on('close', (code: number) => {
      if (code === 0) resolve();
      else reject(new Error('Failed to cleanup test directories'));
    });
  });
};

// Helper function to wait for container health
export const waitForContainer = async (container: Docker.Container, timeout = 30000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const info = await container.inspect();
    if (info.State.Health?.Status === 'healthy') {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
};

// Set up before all tests
beforeAll(async () => {
  // Create test directories
  await createTestDirectories();
});

// Clean up after all tests
afterAll(async () => {
  // Clean up test directories
  await cleanupTestDirectories();

  // Remove test containers
  const containers = await docker.listContainers({ all: true });
  for (const container of containers) {
    if (container.Names.some((name: string) => name.includes('test-'))) {
      const containerInstance = docker.getContainer(container.Id);
      if (container.State === 'running') {
        await containerInstance.stop();
      }
      await containerInstance.remove();
    }
  }
});
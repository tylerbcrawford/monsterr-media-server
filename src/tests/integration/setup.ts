import { ConfigService } from '../../core/config/ConfigService';
import { PlexService } from '../../services/media/PlexService';
import { SonarrService } from '../../services/media/SonarrService';
import { RadarrService } from '../../services/media/RadarrService';
import { initializeCoreServices } from '../../core';
import { createMediaService } from '../../services/media';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';

// Test configuration service
export const configService = new ConfigService();

// Initialize core services before tests
beforeAll(async () => {
  const initialized = await initializeCoreServices();
  if (!initialized) {
    throw new Error('Failed to initialize core services');
  }
});

// Helper function to create test services
export const createTestServices = async () => {
  // Create and initialize media services
  const plexService = createMediaService('plex', {
    enabled: true,
    port: 32400,
    host: 'localhost',
    basePath: '/media',
    apiKey: 'test-plex-token',
    claimToken: 'test-claim-token',
    libraries: {
      movies: '/media/movies',
      tvShows: '/media/tv',
      music: '/media/music'
    },
    transcoding: {
      enabled: true,
      hardwareAcceleration: true,
      maxSessions: 3
    }
  });

  const sonarrService = createMediaService('sonarr', {
    enabled: true,
    port: 8989,
    host: 'localhost',
    basePath: '/api',
    apiKey: 'test-sonarr-key',
    mediaRoot: '/media/tv',
    qualityProfile: 'HD-1080p',
    languageProfile: 'English',
    downloadClient: 'qBittorrent'
  });

  const radarrService = createMediaService('radarr', {
    enabled: true,
    port: 7878,
    host: 'localhost',
    basePath: '/api',
    apiKey: 'test-radarr-key',
    mediaRoot: '/media/movies',
    qualityProfile: 'HD-1080p',
    minimumAvailability: 'released',
    downloadClient: 'qBittorrent'
  });

  if (!plexService || !sonarrService || !radarrService) {
    throw new Error('Failed to create media services');
  }

  // Initialize all services
  await Promise.all([
    plexService.initialize(),
    sonarrService.initialize(),
    radarrService.initialize()
  ]);

  return {
    plexService: plexService as PlexService,
    sonarrService: sonarrService as SonarrService,
    radarrService: radarrService as RadarrService
  };
};

// Clean up after each test
afterEach(async () => {
  // Reset any test state
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(async () => {
  // Clean up any resources
  jest.resetModules();
});
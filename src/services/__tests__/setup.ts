import { ConfigService } from '../../core/config/ConfigService';
import { PlexConfig, SonarrConfig, RadarrConfig } from '../../types/services';

// Mock configurations for testing
export const mockPlexConfig: PlexConfig = {
  enabled: true,
  port: 32400,
  host: 'localhost',
  basePath: '/media',
  apiKey: 'mock-plex-token',
  claimToken: 'mock-claim-token',
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
};

export const mockSonarrConfig: SonarrConfig = {
  enabled: true,
  port: 8989,
  host: 'localhost',
  basePath: '/api',
  apiKey: 'mock-sonarr-key',
  mediaRoot: '/media/tv',
  qualityProfile: 'HD-1080p',
  languageProfile: 'English',
  downloadClient: 'qBittorrent'
};

export const mockRadarrConfig: RadarrConfig = {
  enabled: true,
  port: 7878,
  host: 'localhost',
  basePath: '/api',
  apiKey: 'mock-radarr-key',
  mediaRoot: '/media/movies',
  qualityProfile: 'HD-1080p',
  minimumAvailability: 'released',
  downloadClient: 'qBittorrent'
};

// Mock ConfigService for testing
export class MockConfigService extends ConfigService {
  constructor() {
    super();
  }

  // Override methods to return mock data
  async initialize(): Promise<boolean> {
    return true;
  }

  validate() {
    return {
      isValid: true,
      warnings: []
    };
  }
}

// Mock axios for testing
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  create: jest.fn()
}));

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Clean up after each test
  jest.resetAllMocks();
});
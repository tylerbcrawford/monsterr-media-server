import axios from 'axios';
import { PlexService } from '../media/PlexService';
import { mockPlexConfig } from './setup';
import { MockAxiosResponse, createMockResponse } from './types';

// Mock axios
const mockAxios = axios as jest.Mocked<typeof axios>;

// Test subclass to access protected methods
class TestPlexService extends PlexService {
  public async testCheckHealth(): Promise<boolean> {
    return this.checkHealth();
  }
}

describe('PlexService', () => {
  let plexService: TestPlexService;

  beforeEach(() => {
    plexService = new TestPlexService(mockPlexConfig);
  });

  describe('initialization', () => {
    it('should initialize successfully with valid config', async () => {
      mockAxios.get.mockResolvedValueOnce(
        createMockResponse(
          { MediaContainer: { size: 1 } },
          { url: '/identity', method: 'GET' }
        )
      );
      const result = await plexService.initialize();
      expect(result).toBe(true);
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/identity'),
        expect.any(Object)
      );
    });

    it('should fail initialization with invalid config', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Connection failed'));
      const result = await plexService.initialize();
      expect(result).toBe(false);
    });
  });

  describe('health checks', () => {
    it('should report healthy when server is accessible', async () => {
      mockAxios.get.mockResolvedValueOnce(
        createMockResponse(
          { MediaContainer: { size: 1 } },
          { url: '/identity', method: 'GET' }
        )
      );
      const result = await plexService.testCheckHealth();
      expect(result).toBe(true);
    });

    it('should report unhealthy when server is inaccessible', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Connection failed'));
      const result = await plexService.testCheckHealth();
      expect(result).toBe(false);
    });
  });

  describe('library operations', () => {
    it('should scan library successfully', async () => {
      mockAxios.get.mockResolvedValueOnce(
        createMockResponse(
          { MediaContainer: { size: 1 } },
          { url: '/library/sections/all/refresh', method: 'GET' }
        )
      );
      await expect(plexService.scanLibrary()).resolves.not.toThrow();
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/library/sections/all/refresh'),
        expect.any(Object)
      );
    });

    it('should get library stats successfully', async () => {
      mockAxios.get
        .mockResolvedValueOnce(
          createMockResponse(
            { MediaContainer: { size: 1 } },
            { url: '/identity', method: 'GET' }
          )
        )
        .mockResolvedValueOnce(
          createMockResponse(
            {
              MediaContainer: {
                size: 3,
                Directory: [
                  { type: 'movie', title: 'Movies', size: 100 },
                  { type: 'show', title: 'TV Shows', size: 50 },
                  { type: 'artist', title: 'Music', size: 25 }
                ]
              }
            },
            { url: '/library/sections', method: 'GET' }
          )
        );

      const stats = await plexService.getLibraryStats();
      
      expect(stats).toEqual({
        totalItems: 175, // 100 + 50 + 25
        categories: {
          movies: 100,
          tvShows: 50,
          music: 25
        },
        totalSize: expect.any(Number),
        lastScan: expect.any(Date)
      });
    });

    it('should refresh metadata successfully', async () => {
      mockAxios.get.mockResolvedValueOnce(
        createMockResponse(
          { MediaContainer: { size: 1 } },
          { url: '/library/sections/all/refresh', method: 'GET', params: { force: 1 } }
        )
      );
      await expect(plexService.refreshMetadata()).resolves.not.toThrow();
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/library/sections/all/refresh?force=1'),
        expect.any(Object)
      );
    });

    it('should handle library scan errors', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Scan failed'));
      await expect(plexService.scanLibrary()).rejects.toThrow('Failed to scan libraries');
    });

    it('should handle metadata refresh errors', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Refresh failed'));
      await expect(plexService.refreshMetadata()).rejects.toThrow('Failed to refresh metadata');
    });
  });

  describe('service lifecycle', () => {
    it('should start service successfully', async () => {
      mockAxios.get.mockResolvedValueOnce(
        createMockResponse(
          { MediaContainer: { size: 1 } },
          { url: '/identity', method: 'GET' }
        )
      );
      const result = await plexService.start();
      expect(result).toBe(true);
    });

    it('should stop service successfully', async () => {
      mockAxios.get.mockResolvedValueOnce(
        createMockResponse(
          { MediaContainer: { size: 1 } },
          { url: '/identity', method: 'GET' }
        )
      );
      const result = await plexService.stop();
      expect(result).toBe(true);
    });

    it('should handle start failures', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Start failed'));
      const result = await plexService.start();
      expect(result).toBe(false);
    });

    it('should handle stop failures gracefully', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Stop failed'));
      const result = await plexService.stop();
      expect(result).toBe(false);
    });
  });
});
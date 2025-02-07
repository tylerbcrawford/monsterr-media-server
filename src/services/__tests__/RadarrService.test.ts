import axios from 'axios';
import { RadarrService } from '../media/RadarrService';
import { mockRadarrConfig } from './setup';
import { createMockResponse } from './types';

// Mock axios
const mockAxios = axios as jest.Mocked<typeof axios>;

// Test subclass to access protected methods
class TestRadarrService extends RadarrService {
  public async testCheckHealth(): Promise<boolean> {
    return this.checkHealth();
  }
}

describe('RadarrService', () => {
  let radarrService: TestRadarrService;

  beforeEach(() => {
    radarrService = new TestRadarrService(mockRadarrConfig);
  });

  describe('initialization', () => {
    it('should initialize successfully with valid config', async () => {
      mockAxios.get.mockResolvedValueOnce(
        createMockResponse(
          { version: '4.0.0' },
          { url: '/system/status', method: 'GET' }
        )
      );
      const result = await radarrService.initialize();
      expect(result).toBe(true);
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/system/status'),
        expect.any(Object)
      );
    });

    it('should fail initialization with invalid config', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Connection failed'));
      const result = await radarrService.initialize();
      expect(result).toBe(false);
    });
  });

  describe('health checks', () => {
    it('should report healthy when server is accessible', async () => {
      mockAxios.get.mockResolvedValueOnce(
        createMockResponse(
          { version: '4.0.0' },
          { url: '/system/status', method: 'GET' }
        )
      );
      const result = await radarrService.testCheckHealth();
      expect(result).toBe(true);
    });

    it('should report unhealthy when server is inaccessible', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Connection failed'));
      const result = await radarrService.testCheckHealth();
      expect(result).toBe(false);
    });
  });

  describe('library operations', () => {
    it('should scan library successfully', async () => {
      mockAxios.post.mockResolvedValueOnce(
        createMockResponse(
          { id: 1, name: 'RefreshMovie' },
          { url: '/command', method: 'POST' }
        )
      );
      await expect(radarrService.scanLibrary()).resolves.not.toThrow();
      expect(mockAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/command'),
        { name: 'RefreshMovie' },
        expect.any(Object)
      );
    });

    it('should get library stats successfully', async () => {
      mockAxios.get
        .mockResolvedValueOnce(
          createMockResponse(
            [
              { id: 1, hasFile: true, monitored: true },
              { id: 2, hasFile: true, monitored: false },
              { id: 3, hasFile: false, monitored: true }
            ],
            { url: '/movie', method: 'GET' }
          )
        )
        .mockResolvedValueOnce(
          createMockResponse(
            [
              { path: '/movies', freeSpace: 100000, totalSpace: 1000000 }
            ],
            { url: '/diskspace', method: 'GET' }
          )
        );

      const stats = await radarrService.getLibraryStats();
      
      expect(stats).toEqual({
        totalItems: 3,
        categories: {
          movies: 3,
          downloaded: 2,
          monitored: 2
        },
        totalSize: 1000000,
        lastScan: expect.any(Date)
      });
    });

    it('should refresh metadata successfully', async () => {
      mockAxios.post.mockResolvedValueOnce(
        createMockResponse(
          { id: 1, name: 'RefreshMovie', updateImages: true },
          { url: '/command', method: 'POST' }
        )
      );
      await expect(radarrService.refreshMetadata()).resolves.not.toThrow();
      expect(mockAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/command'),
        { name: 'RefreshMovie', updateImages: true },
        expect.any(Object)
      );
    });

    it('should handle library scan errors', async () => {
      mockAxios.post.mockRejectedValueOnce(new Error('Scan failed'));
      await expect(radarrService.scanLibrary()).rejects.toThrow('Failed to scan library');
    });

    it('should handle metadata refresh errors', async () => {
      mockAxios.post.mockRejectedValueOnce(new Error('Refresh failed'));
      await expect(radarrService.refreshMetadata()).rejects.toThrow('Failed to refresh metadata');
    });
  });

  describe('configuration verification', () => {
    it('should verify configuration successfully', async () => {
      // Mock responses for all configuration checks
      mockAxios.get
        .mockResolvedValueOnce(
          createMockResponse(
            [{ path: '/movies', accessible: true }],
            { url: '/rootfolder', method: 'GET' }
          )
        )
        .mockResolvedValueOnce(
          createMockResponse(
            [{ name: 'HD-1080p', id: 1 }],
            { url: '/qualityprofile', method: 'GET' }
          )
        )
        .mockResolvedValueOnce(
          createMockResponse(
            [{ name: 'qBittorrent', id: 1 }],
            { url: '/downloadclient', method: 'GET' }
          )
        );

      const result = await radarrService.start();
      expect(result).toBe(true);
    });

    it('should fail verification with invalid media root', async () => {
      mockAxios.get
        .mockResolvedValueOnce(
          createMockResponse(
            [{ path: '/wrong/path', accessible: true }],
            { url: '/rootfolder', method: 'GET' }
          )
        );

      const result = await radarrService.start();
      expect(result).toBe(false);
    });

    it('should fail verification with invalid quality profile', async () => {
      mockAxios.get
        .mockResolvedValueOnce(
          createMockResponse(
            [{ path: '/movies', accessible: true }],
            { url: '/rootfolder', method: 'GET' }
          )
        )
        .mockResolvedValueOnce(
          createMockResponse(
            [{ name: 'Wrong-Profile', id: 1 }],
            { url: '/qualityprofile', method: 'GET' }
          )
        );

      const result = await radarrService.start();
      expect(result).toBe(false);
    });

    it('should fail verification with invalid download client', async () => {
      mockAxios.get
        .mockResolvedValueOnce(
          createMockResponse(
            [{ path: '/movies', accessible: true }],
            { url: '/rootfolder', method: 'GET' }
          )
        )
        .mockResolvedValueOnce(
          createMockResponse(
            [{ name: 'HD-1080p', id: 1 }],
            { url: '/qualityprofile', method: 'GET' }
          )
        )
        .mockResolvedValueOnce(
          createMockResponse(
            [{ name: 'WrongClient', id: 1 }],
            { url: '/downloadclient', method: 'GET' }
          )
        );

      const result = await radarrService.start();
      expect(result).toBe(false);
    });

    it('should fail verification with invalid minimum availability', async () => {
      const invalidConfig = {
        ...mockRadarrConfig,
        minimumAvailability: 'announced' as const // Use a valid type but it will still fail validation
      };
      const service = new TestRadarrService(invalidConfig);
      const result = await service.start();
      expect(result).toBe(false);
    });
  });
});
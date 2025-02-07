import { createTestServices } from './setup';
import { PlexService } from '../../services/media/PlexService';
import { SonarrService } from '../../services/media/SonarrService';
import { RadarrService } from '../../services/media/RadarrService';
import { PlexConfig, SonarrConfig, RadarrConfig } from '../../types/services';

describe('Media Services Integration', () => {
  let plexService: PlexService;
  let sonarrService: SonarrService;
  let radarrService: RadarrService;

  beforeAll(async () => {
    const services = await createTestServices();
    plexService = services.plexService;
    sonarrService = services.sonarrService;
    radarrService = services.radarrService;
  });

  describe('Service Initialization', () => {
    it('should initialize all services successfully', async () => {
      expect(plexService).toBeDefined();
      expect(sonarrService).toBeDefined();
      expect(radarrService).toBeDefined();

      // Verify services are in running state
      expect(plexService.status).toBe('running');
      expect(sonarrService.status).toBe('running');
      expect(radarrService.status).toBe('running');
    });

    it('should have valid configurations', () => {
      // Verify Plex configuration
      const plexConfig = plexService.config as PlexConfig;
      expect(plexConfig.enabled).toBe(true);
      expect(plexConfig.libraries).toBeDefined();
      expect(plexConfig.libraries.movies).toBeDefined();
      expect(plexConfig.libraries.tvShows).toBeDefined();

      // Verify Sonarr configuration
      const sonarrConfig = sonarrService.config as SonarrConfig;
      expect(sonarrConfig.enabled).toBe(true);
      expect(sonarrConfig.mediaRoot).toBeDefined();
      expect(sonarrConfig.qualityProfile).toBeDefined();

      // Verify Radarr configuration
      const radarrConfig = radarrService.config as RadarrConfig;
      expect(radarrConfig.enabled).toBe(true);
      expect(radarrConfig.mediaRoot).toBeDefined();
      expect(radarrConfig.qualityProfile).toBeDefined();
    });
  });

  describe('Service Health Checks', () => {
    it('should report healthy status for all services', async () => {
      const [plexHealth, sonarrHealth, radarrHealth] = await Promise.all([
        plexService.getHealth(),
        sonarrService.getHealth(),
        radarrService.getHealth()
      ]);

      expect(plexHealth.status).toBe('healthy');
      expect(sonarrHealth.status).toBe('healthy');
      expect(radarrHealth.status).toBe('healthy');
    });
  });

  describe('Service Coordination', () => {
    it('should coordinate library scans across services', async () => {
      // Trigger library scans
      await Promise.all([
        plexService.scanLibrary(),
        sonarrService.scanLibrary(),
        radarrService.scanLibrary()
      ]);

      // Get library stats from all services
      const [plexStats, sonarrStats, radarrStats] = await Promise.all([
        plexService.getLibraryStats(),
        sonarrService.getLibraryStats(),
        radarrService.getLibraryStats()
      ]);

      // Verify library statistics
      expect(plexStats.totalItems).toBeGreaterThanOrEqual(0);
      expect(sonarrStats.totalItems).toBeGreaterThanOrEqual(0);
      expect(radarrStats.totalItems).toBeGreaterThanOrEqual(0);

      // Verify categories exist
      expect(plexStats.categories).toBeDefined();
      expect(sonarrStats.categories).toBeDefined();
      expect(radarrStats.categories).toBeDefined();
    });

    it('should handle service dependencies correctly', async () => {
      // Stop Plex service
      await plexService.stop();
      expect(plexService.status).toBe('stopped');

      // Other services should still be running
      expect(sonarrService.status).toBe('running');
      expect(radarrService.status).toBe('running');

      // Restart Plex service
      await plexService.start();
      expect(plexService.status).toBe('running');
    });

    it('should coordinate metadata refresh across services', async () => {
      await Promise.all([
        plexService.refreshMetadata(),
        sonarrService.refreshMetadata(),
        radarrService.refreshMetadata()
      ]);

      // Verify all services are still healthy
      const [plexHealth, sonarrHealth, radarrHealth] = await Promise.all([
        plexService.getHealth(),
        sonarrService.getHealth(),
        radarrService.getHealth()
      ]);

      expect(plexHealth.status).toBe('healthy');
      expect(sonarrHealth.status).toBe('healthy');
      expect(radarrHealth.status).toBe('healthy');
    });
  });

  describe('Error Handling', () => {
    it('should handle service failures gracefully', async () => {
      // Simulate service failures
      await Promise.all([
        plexService.stop(),
        sonarrService.stop(),
        radarrService.stop()
      ]);

      // Verify all services are stopped
      expect(plexService.status).toBe('stopped');
      expect(sonarrService.status).toBe('stopped');
      expect(radarrService.status).toBe('stopped');

      // Attempt to restart services
      await Promise.all([
        plexService.start(),
        sonarrService.start(),
        radarrService.start()
      ]);

      // Verify services recovered
      expect(plexService.status).toBe('running');
      expect(sonarrService.status).toBe('running');
      expect(radarrService.status).toBe('running');
    });
  });
});
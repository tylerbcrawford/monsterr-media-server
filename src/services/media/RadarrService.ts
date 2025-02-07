import { MediaService, RadarrConfig, LibraryStats } from '../../types/services';
import {
  RadarrMovie,
  RadarrDiskSpace,
  RadarrRootFolder,
  RadarrQualityProfile,
  RadarrDownloadClient
} from '../../types/services/radarr';
import axios from 'axios';
import { BaseService } from '../BaseService';

export class RadarrService extends BaseService implements MediaService {
  private readonly apiBaseUrl: string;
  private readonly apiHeaders: { 'X-Api-Key': string };

  constructor(config: RadarrConfig) {
    super('radarr', '1.0.0', config);
    if (!config.apiKey) {
      throw new Error('Radarr API key is required');
    }
    this.apiBaseUrl = `http://${config.host}:${config.port}/api/v3`;
    this.apiHeaders = {
      'X-Api-Key': config.apiKey
    };
  }

  /**
   * Initialize Radarr service
   */
  protected async initializeService(): Promise<void> {
    // Verify Radarr server is accessible
    await this.checkServerAccess();

    // Verify media root exists
    const radarrConfig = this.config as RadarrConfig;
    if (!radarrConfig.mediaRoot) {
      throw new Error('Radarr media root not configured');
    }
  }

  /**
   * Start Radarr service
   */
  protected async startService(): Promise<void> {
    try {
      // TODO: Implement Docker container start logic
      await this.verifyConfiguration();
    } catch (error) {
      throw new Error(`Failed to start Radarr service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Stop Radarr service
   */
  protected async stopService(): Promise<void> {
    // TODO: Implement Docker container stop logic
    try {
      await this.checkServerAccess();
    } catch {
      // Server already stopped, ignore error
    }
  }

  /**
   * Check Radarr service health
   */
  protected async checkHealth(): Promise<boolean> {
    try {
      await this.checkServerAccess();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Scan media library
   */
  async scanLibrary(): Promise<void> {
    try {
      await axios.post(
        `${this.apiBaseUrl}/command`,
        { name: 'RefreshMovie' },
        { headers: this.apiHeaders }
      );
    } catch (error) {
      throw new Error(`Failed to scan library: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get library statistics
   */
  async getLibraryStats(): Promise<LibraryStats> {
    try {
      const [moviesResponse, diskResponse] = await Promise.all([
        axios.get<RadarrMovie[]>(`${this.apiBaseUrl}/movie`, { headers: this.apiHeaders }),
        axios.get<RadarrDiskSpace[]>(`${this.apiBaseUrl}/diskspace`, { headers: this.apiHeaders })
      ]);

      const movies = moviesResponse.data;
      const diskSpace = diskResponse.data;

      // Calculate total size from disk space info
      const totalSize = diskSpace.reduce(
        (total: number, disk: RadarrDiskSpace) => total + disk.totalSpace,
        0
      );

      return {
        totalItems: movies.length,
        categories: {
          movies: movies.length,
          downloaded: movies.filter(m => m.hasFile).length,
          monitored: movies.filter(m => m.monitored).length
        },
        totalSize,
        lastScan: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to get library stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Refresh metadata for all items
   */
  async refreshMetadata(): Promise<void> {
    try {
      await axios.post(
        `${this.apiBaseUrl}/command`,
        { name: 'RefreshMovie', updateImages: true },
        { headers: this.apiHeaders }
      );
    } catch (error) {
      throw new Error(`Failed to refresh metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify Radarr server is accessible
   */
  private async checkServerAccess(): Promise<void> {
    try {
      await axios.get(`${this.apiBaseUrl}/system/status`, { headers: this.apiHeaders });
    } catch (error) {
      throw new Error('Radarr server not accessible');
    }
  }

  /**
   * Verify service configuration
   */
  private async verifyConfiguration(): Promise<void> {
    try {
      const radarrConfig = this.config as RadarrConfig;

      // Check root folders
      const rootFoldersResponse = await axios.get<RadarrRootFolder[]>(
        `${this.apiBaseUrl}/rootfolder`,
        { headers: this.apiHeaders }
      );

      const configuredRoot = rootFoldersResponse.data.find(
        folder => folder.path === radarrConfig.mediaRoot
      );

      if (!configuredRoot) {
        throw new Error('Configured media root not found in Radarr');
      }

      // Check quality profile
      const profilesResponse = await axios.get<RadarrQualityProfile[]>(
        `${this.apiBaseUrl}/qualityprofile`,
        { headers: this.apiHeaders }
      );

      const configuredProfile = profilesResponse.data.find(
        profile => profile.name === radarrConfig.qualityProfile
      );

      if (!configuredProfile) {
        throw new Error('Configured quality profile not found in Radarr');
      }

      // Check download client
      const downloadClientsResponse = await axios.get<RadarrDownloadClient[]>(
        `${this.apiBaseUrl}/downloadclient`,
        { headers: this.apiHeaders }
      );

      const configuredClient = downloadClientsResponse.data.find(
        client => client.name === radarrConfig.downloadClient
      );

      if (!configuredClient) {
        throw new Error('Configured download client not found in Radarr');
      }

      // Verify minimum availability setting
      if (!['announced', 'inCinemas', 'released', 'preDB'].includes(radarrConfig.minimumAvailability)) {
        throw new Error('Invalid minimum availability setting');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to verify Radarr configuration');
    }
  }
}
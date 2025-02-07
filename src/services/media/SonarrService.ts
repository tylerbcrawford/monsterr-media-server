import { MediaService, SonarrConfig, LibraryStats } from '../../types/services';
import {
  SonarrDiskSpace,
  SonarrSeries,
  SonarrRootFolder,
  SonarrQualityProfile,
  SonarrDownloadClient
} from '../../types/services/sonarr';
import axios from 'axios';
import { BaseService } from '../BaseService';

export class SonarrService extends BaseService implements MediaService {
  private readonly apiBaseUrl: string;
  private readonly apiHeaders: { 'X-Api-Key': string };

  constructor(config: SonarrConfig) {
    super('sonarr', '1.0.0', config);
    if (!config.apiKey) {
      throw new Error('Sonarr API key is required');
    }
    this.apiBaseUrl = `http://${config.host}:${config.port}/api/v3`;
    this.apiHeaders = {
      'X-Api-Key': config.apiKey
    };
  }

  /**
   * Initialize Sonarr service
   */
  protected async initializeService(): Promise<void> {
    // Verify Sonarr server is accessible
    await this.checkServerAccess();

    // Verify media root exists
    const sonarrConfig = this.config as SonarrConfig;
    if (!sonarrConfig.mediaRoot) {
      throw new Error('Sonarr media root not configured');
    }
  }

  /**
   * Start Sonarr service
   */
  protected async startService(): Promise<void> {
    try {
      // TODO: Implement Docker container start logic
      await this.verifyConfiguration();
    } catch (error) {
      throw new Error(`Failed to start Sonarr service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Stop Sonarr service
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
   * Check Sonarr service health
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
        { name: 'RefreshSeries' },
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
      const [seriesResponse, diskResponse] = await Promise.all([
        axios.get<SonarrSeries[]>(`${this.apiBaseUrl}/series`, { headers: this.apiHeaders }),
        axios.get<SonarrDiskSpace[]>(`${this.apiBaseUrl}/diskspace`, { headers: this.apiHeaders })
      ]);

      const series = seriesResponse.data;
      const diskSpace = diskResponse.data;

      // Calculate total size from disk space info
      const totalSize = diskSpace.reduce(
        (total: number, disk: SonarrDiskSpace) => total + disk.totalSpace,
        0
      );

      return {
        totalItems: series.length,
        categories: {
          series: series.length,
          continuing: series.filter(s => s.status === 'continuing').length,
          ended: series.filter(s => s.status === 'ended').length
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
        { name: 'RefreshSeries', updateImages: true },
        { headers: this.apiHeaders }
      );
    } catch (error) {
      throw new Error(`Failed to refresh metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify Sonarr server is accessible
   */
  private async checkServerAccess(): Promise<void> {
    try {
      await axios.get(`${this.apiBaseUrl}/system/status`, { headers: this.apiHeaders });
    } catch (error) {
      throw new Error('Sonarr server not accessible');
    }
  }

  /**
   * Verify service configuration
   */
  private async verifyConfiguration(): Promise<void> {
    try {
      const sonarrConfig = this.config as SonarrConfig;

      // Check root folders
      const rootFoldersResponse = await axios.get<SonarrRootFolder[]>(
        `${this.apiBaseUrl}/rootfolder`,
        { headers: this.apiHeaders }
      );

      const configuredRoot = rootFoldersResponse.data.find(
        folder => folder.path === sonarrConfig.mediaRoot
      );

      if (!configuredRoot) {
        throw new Error('Configured media root not found in Sonarr');
      }

      // Check quality profile
      const profilesResponse = await axios.get<SonarrQualityProfile[]>(
        `${this.apiBaseUrl}/qualityprofile`,
        { headers: this.apiHeaders }
      );

      const configuredProfile = profilesResponse.data.find(
        profile => profile.name === sonarrConfig.qualityProfile
      );

      if (!configuredProfile) {
        throw new Error('Configured quality profile not found in Sonarr');
      }

      // Check download client
      const downloadClientsResponse = await axios.get<SonarrDownloadClient[]>(
        `${this.apiBaseUrl}/downloadclient`,
        { headers: this.apiHeaders }
      );

      const configuredClient = downloadClientsResponse.data.find(
        client => client.name === sonarrConfig.downloadClient
      );

      if (!configuredClient) {
        throw new Error('Configured download client not found in Sonarr');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to verify Sonarr configuration');
    }
  }
}
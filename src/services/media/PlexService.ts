import { BaseService } from '../BaseService';
import { MediaService, PlexConfig, LibraryStats } from '../../types/services';
import axios from 'axios';

export class PlexService extends BaseService implements MediaService {
  private readonly apiBaseUrl: string;

  constructor(config: PlexConfig) {
    super('plex', '1.0.0', config);
    this.apiBaseUrl = `http://${config.host}:${config.port}`;
  }

  /**
   * Initialize Plex service
   */
  protected async initializeService(): Promise<void> {
    // Verify Plex server is accessible
    await this.checkServerAccess();

    // Initialize libraries
    const plexConfig = this.config as PlexConfig;
    if (!plexConfig.libraries) {
      throw new Error('Plex libraries not configured');
    }
  }

  /**
   * Start Plex service
   */
  protected async startService(): Promise<void> {
    try {
      // TODO: Implement Docker container start logic
      await this.verifyLibraries();
    } catch (error) {
      throw new Error(`Failed to start Plex service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Stop Plex service
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
   * Check Plex service health
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
   * Scan media libraries
   */
  async scanLibrary(): Promise<void> {
    try {
      const plexConfig = this.config as PlexConfig;
      
      // Trigger scan for each library section
      for (const libraryPath of Object.values(plexConfig.libraries)) {
        await axios.get(`${this.apiBaseUrl}/library/sections/all/refresh`, {
          headers: {
            'X-Plex-Token': plexConfig.apiKey
          }
        });
      }
    } catch (error) {
      throw new Error(`Failed to scan libraries: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get library statistics
   */
  async getLibraryStats(): Promise<LibraryStats> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/library/sections`, {
        headers: {
          'X-Plex-Token': (this.config as PlexConfig).apiKey
        }
      });

      // TODO: Parse actual Plex API response
      // This is a mock implementation
      return {
        totalItems: 1000,
        categories: {
          movies: 500,
          tvShows: 300,
          music: 200
        },
        totalSize: 1024 * 1024 * 1024 * 500, // 500GB
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
      await axios.get(`${this.apiBaseUrl}/library/sections/all/refresh?force=1`, {
        headers: {
          'X-Plex-Token': (this.config as PlexConfig).apiKey
        }
      });
    } catch (error) {
      throw new Error(`Failed to refresh metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify Plex server is accessible
   */
  private async checkServerAccess(): Promise<void> {
    try {
      await axios.get(`${this.apiBaseUrl}/identity`, {
        headers: {
          'X-Plex-Token': (this.config as PlexConfig).apiKey
        }
      });
    } catch (error) {
      throw new Error('Plex server not accessible');
    }
  }

  /**
   * Verify configured libraries exist
   */
  private async verifyLibraries(): Promise<void> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/library/sections`, {
        headers: {
          'X-Plex-Token': (this.config as PlexConfig).apiKey
        }
      });

      // TODO: Verify each configured library exists in Plex
      // This requires parsing the actual Plex API response
    } catch (error) {
      throw new Error(`Failed to verify libraries: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
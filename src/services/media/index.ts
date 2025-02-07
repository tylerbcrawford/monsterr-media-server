import { PlexService } from './PlexService';
import { SonarrService } from './SonarrService';
import { MediaService, PlexConfig, SonarrConfig } from '../../types/services';

// Factory function to create media services
export const createMediaService = (type: string, config: any): MediaService | null => {
  switch (type.toLowerCase()) {
    case 'plex':
      return new PlexService(config as PlexConfig);
    case 'sonarr':
      return new SonarrService(config as SonarrConfig);
    // Add other media services here as they are implemented
    // case 'radarr':
    //   return new RadarrService(config as RadarrConfig);
    default:
      return null;
  }
};

export {
  PlexService,
  SonarrService
};

// Re-export types
export type {
  MediaService,
  PlexConfig,
  SonarrConfig
};
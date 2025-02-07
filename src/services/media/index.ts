import { PlexService } from './PlexService';
import { MediaService, PlexConfig } from '../../types/services';

// Factory function to create media services
export const createMediaService = (type: string, config: any): MediaService | null => {
  switch (type.toLowerCase()) {
    case 'plex':
      return new PlexService(config as PlexConfig);
    // Add other media services here as they are implemented
    // case 'sonarr':
    //   return new SonarrService(config as SonarrConfig);
    // case 'radarr':
    //   return new RadarrService(config as RadarrConfig);
    default:
      return null;
  }
};

export {
  PlexService
};

// Re-export types
export type {
  MediaService,
  PlexConfig
};
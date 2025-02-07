import { PlexService } from './PlexService';
import { SonarrService } from './SonarrService';
import { RadarrService } from './RadarrService';
import { MediaService, PlexConfig, SonarrConfig, RadarrConfig } from '../../types/services';

// Factory function to create media services
export const createMediaService = (type: string, config: any): MediaService | null => {
  switch (type.toLowerCase()) {
    case 'plex':
      return new PlexService(config as PlexConfig);
    case 'sonarr':
      return new SonarrService(config as SonarrConfig);
    case 'radarr':
      return new RadarrService(config as RadarrConfig);
    default:
      return null;
  }
};

export {
  PlexService,
  SonarrService,
  RadarrService
};

// Re-export types
export type {
  MediaService,
  PlexConfig,
  SonarrConfig,
  RadarrConfig
};
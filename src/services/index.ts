import { BaseService } from './BaseService';
import { createMediaService, PlexService } from './media';
import type { MediaService, PlexConfig } from './media';

// Export base service
export { BaseService };

// Export media services
export {
  createMediaService,
  PlexService
};

// Export service types
export type {
  MediaService,
  PlexConfig
};

// Service management functions
export const initializeServices = async (services: BaseService[]): Promise<boolean> => {
  try {
    for (const service of services) {
      const initialized = await service.initialize();
      if (!initialized) {
        throw new Error(`Failed to initialize service: ${service.name}`);
      }
    }
    return true;
  } catch (error) {
    console.error('Service initialization failed:', error);
    return false;
  }
};

export const startServices = async (services: BaseService[]): Promise<boolean> => {
  try {
    for (const service of services) {
      const started = await service.start();
      if (!started) {
        throw new Error(`Failed to start service: ${service.name}`);
      }
    }
    return true;
  } catch (error) {
    console.error('Service startup failed:', error);
    return false;
  }
};

export const stopServices = async (services: BaseService[]): Promise<boolean> => {
  try {
    for (const service of services) {
      const stopped = await service.stop();
      if (!stopped) {
        console.error(`Failed to stop service: ${service.name}`);
        // Continue stopping other services even if one fails
      }
    }
    return true;
  } catch (error) {
    console.error('Service shutdown failed:', error);
    return false;
  }
};

export const getServicesHealth = (services: BaseService[]): Record<string, boolean> => {
  return services.reduce((health, service) => ({
    ...health,
    [service.name]: service.health.status === 'healthy'
  }), {});
};
import { AuthService } from './auth/AuthService';
import { ConfigService } from './config/ConfigService';
import { SystemService } from './system/SystemService';

export {
  AuthService,
  ConfigService,
  SystemService
};

// Create and export a singleton instance of ConfigService
export const configService = new ConfigService();

// Create AuthService with default config
export const authService = new AuthService({
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  jwtExpiresIn: '1h',
  twoFactorRequired: process.env.NODE_ENV === 'production',
  sessionTimeout: 3600
});

// Create and export a singleton instance of SystemService
export const systemService = new SystemService();

// Initialize core services
export const initializeCoreServices = async () => {
  try {
    // Initialize config service first
    const configInitialized = await configService.initialize();
    if (!configInitialized) {
      throw new Error('Failed to initialize configuration service');
    }

    // Validate configuration
    const configValidation = configService.validate();
    if (!configValidation.isValid) {
      throw new Error(`Configuration validation failed: ${configValidation.errors?.join(', ')}`);
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize core services:', error);
    return false;
  }
};
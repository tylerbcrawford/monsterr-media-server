import Docker from 'dockerode';
import {
  docker,
  containerConfigs,
  serviceConfigs,
  waitForContainer,
  createTestDirectories,
  cleanupTestDirectories
} from './setup';

describe('Container Lifecycle Tests', () => {
  let plexContainer: Docker.Container;
  let sonarrContainer: Docker.Container;
  let radarrContainer: Docker.Container;

  beforeAll(async () => {
    await createTestDirectories();
  });

  afterAll(async () => {
    await cleanupTestDirectories();
  });

  describe('Container Creation', () => {
    it('should create all service containers', async () => {
      // Create Plex container
      plexContainer = await docker.createContainer(containerConfigs.plex);
      expect(plexContainer).toBeDefined();
      expect(plexContainer.id).toBeDefined();

      // Create Sonarr container
      sonarrContainer = await docker.createContainer(containerConfigs.sonarr);
      expect(sonarrContainer).toBeDefined();
      expect(sonarrContainer.id).toBeDefined();

      // Create Radarr container
      radarrContainer = await docker.createContainer(containerConfigs.radarr);
      expect(radarrContainer).toBeDefined();
      expect(radarrContainer.id).toBeDefined();
    });

    it('should have correct configurations', async () => {
      // Verify Plex configuration
      const plexInfo = await plexContainer.inspect();
      expect(plexInfo.Config.Env).toContain('PLEX_CLAIM=test-claim-token');
      expect(plexInfo.HostConfig.PortBindings['32400/tcp']).toBeDefined();

      // Verify Sonarr configuration
      const sonarrInfo = await sonarrContainer.inspect();
      expect(sonarrInfo.Config.Env).toContain('PUID=1000');
      expect(sonarrInfo.HostConfig.PortBindings['8989/tcp']).toBeDefined();

      // Verify Radarr configuration
      const radarrInfo = await radarrContainer.inspect();
      expect(radarrInfo.Config.Env).toContain('PUID=1000');
      expect(radarrInfo.HostConfig.PortBindings['7878/tcp']).toBeDefined();
    });
  });

  describe('Container Operations', () => {
    it('should start all containers', async () => {
      // Start containers in order
      await plexContainer.start();
      await sonarrContainer.start();
      await radarrContainer.start();

      // Verify containers are running
      const [plexInfo, sonarrInfo, radarrInfo] = await Promise.all([
        plexContainer.inspect(),
        sonarrContainer.inspect(),
        radarrContainer.inspect()
      ]);

      expect(plexInfo.State.Running).toBe(true);
      expect(sonarrInfo.State.Running).toBe(true);
      expect(radarrInfo.State.Running).toBe(true);
    });

    it('should wait for containers to be healthy', async () => {
      // Wait for all containers to be healthy
      const [plexHealthy, sonarrHealthy, radarrHealthy] = await Promise.all([
        waitForContainer(plexContainer),
        waitForContainer(sonarrContainer),
        waitForContainer(radarrContainer)
      ]);

      expect(plexHealthy).toBe(true);
      expect(sonarrHealthy).toBe(true);
      expect(radarrHealthy).toBe(true);
    });

    it('should stop and restart containers', async () => {
      // Stop containers
      await Promise.all([
        plexContainer.stop(),
        sonarrContainer.stop(),
        radarrContainer.stop()
      ]);

      // Verify containers are stopped
      const [plexInfo, sonarrInfo, radarrInfo] = await Promise.all([
        plexContainer.inspect(),
        sonarrContainer.inspect(),
        radarrContainer.inspect()
      ]);

      expect(plexInfo.State.Running).toBe(false);
      expect(sonarrInfo.State.Running).toBe(false);
      expect(radarrInfo.State.Running).toBe(false);

      // Restart containers
      await Promise.all([
        plexContainer.start(),
        sonarrContainer.start(),
        radarrContainer.start()
      ]);

      // Wait for containers to be healthy again
      const [plexHealthy, sonarrHealthy, radarrHealthy] = await Promise.all([
        waitForContainer(plexContainer),
        waitForContainer(sonarrContainer),
        waitForContainer(radarrContainer)
      ]);

      expect(plexHealthy).toBe(true);
      expect(sonarrHealthy).toBe(true);
      expect(radarrHealthy).toBe(true);
    });
  });

  describe('Container Cleanup', () => {
    it('should stop and remove all containers', async () => {
      // Stop all containers
      await Promise.all([
        plexContainer.stop(),
        sonarrContainer.stop(),
        radarrContainer.stop()
      ]);

      // Remove all containers
      await Promise.all([
        plexContainer.remove(),
        sonarrContainer.remove(),
        radarrContainer.remove()
      ]);

      // Verify containers are removed
      const containers = await docker.listContainers({ all: true });
      const testContainers = containers.filter((container: Docker.ContainerInfo) =>
        container.Names.some((name: string) => name.includes('test-'))
      );

      expect(testContainers.length).toBe(0);
    });
  });
});
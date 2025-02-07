import request from 'supertest';
import express from 'express';
import Docker from 'dockerode';
import fs from 'fs/promises';
import { exec } from 'child_process';
import util from 'util';

// Mock dependencies
jest.mock('dockerode');
jest.mock('fs/promises');
jest.mock('child_process');

// Import server after mocks
const app = require('../setup_server').default;

describe('Setup Server API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/setup/system-check', () => {
    it('returns system information', async () => {
      // Mock Docker ping
      Docker.prototype.ping.mockResolvedValue(true);
      Docker.prototype.version.mockResolvedValue({ Version: '24.0.7' });

      // Mock exec for docker-compose version
      exec.mockImplementation((cmd, callback) => {
        if (cmd === 'docker-compose --version') {
          callback(null, { stdout: 'Docker Compose version v2.21.0' });
        }
      });

      const response = await request(app)
        .post('/api/setup/system-check');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('cpu');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('docker');
      expect(response.body).toHaveProperty('dockerCompose');
      expect(response.body).toHaveProperty('network');
    });

    it('handles docker check failure', async () => {
      Docker.prototype.ping.mockRejectedValue(new Error('Docker not running'));

      const response = await request(app)
        .post('/api/setup/system-check');

      expect(response.status).toBe(200);
      expect(response.body.docker.installed).toBe(false);
    });
  });

  describe('POST /api/setup/validate-path', () => {
    it('validates and creates directory if not exists', async () => {
      // Mock fs.stat to simulate directory doesn't exist
      fs.stat.mockRejectedValueOnce(new Error('ENOENT'));
      
      // Mock fs.mkdir and subsequent stat
      fs.mkdir.mockResolvedValueOnce();
      fs.stat.mockResolvedValueOnce({
        isDirectory: () => true
      });

      // Mock fs operations for write test
      fs.writeFile.mockResolvedValueOnce();
      fs.unlink.mockResolvedValueOnce();
      fs.statfs.mockResolvedValueOnce({ available: 1000000000 });

      const response = await request(app)
        .post('/api/setup/validate-path')
        .send({ path: '/test/path' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        valid: true,
        space: 1000000000,
        isDirectory: true
      });
    });

    it('handles permission errors', async () => {
      fs.stat.mockResolvedValueOnce({
        isDirectory: () => true
      });
      fs.writeFile.mockRejectedValueOnce(new Error('EACCES'));

      const response = await request(app)
        .post('/api/setup/validate-path')
        .send({ path: '/test/path' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        valid: false,
        error: 'Insufficient permissions'
      });
    });
  });

  describe('POST /api/setup/validate-domain', () => {
    it('validates domain format and DNS resolution', async () => {
      exec.mockImplementation((cmd, callback) => {
        if (cmd.startsWith('dig')) {
          callback(null, { stdout: '93.184.216.34' });
        }
      });

      const response = await request(app)
        .post('/api/setup/validate-domain')
        .send({ domain: 'example.com' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ valid: true });
    });

    it('rejects invalid domain format', async () => {
      const response = await request(app)
        .post('/api/setup/validate-domain')
        .send({ domain: 'invalid..domain' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        valid: false,
        error: 'Invalid domain format'
      });
    });
  });

  describe('POST /api/setup/check-port', () => {
    it('checks if port is available', async () => {
      exec.mockImplementation((cmd, callback) => {
        if (cmd.startsWith('nc')) {
          // Simulate port is free by returning error
          callback(new Error('Connection refused'));
        }
      });

      const response = await request(app)
        .post('/api/setup/check-port')
        .send({ port: 80 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ available: true });
    });

    it('detects port in use', async () => {
      exec.mockImplementation((cmd, callback) => {
        if (cmd.startsWith('nc')) {
          // Simulate port is in use by returning success
          callback(null);
        }
      });

      const response = await request(app)
        .post('/api/setup/check-port')
        .send({ port: 80 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        available: false,
        error: 'Port is already in use'
      });
    });
  });

  describe('POST /api/setup/create-directories', () => {
    it('creates required directories', async () => {
      fs.mkdir.mockResolvedValue();

      const response = await request(app)
        .post('/api/setup/create-directories');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
      expect(fs.mkdir).toHaveBeenCalledTimes(4);
    });

    it('handles directory creation errors', async () => {
      fs.mkdir.mockRejectedValue(new Error('Permission denied'));

      const response = await request(app)
        .post('/api/setup/create-directories');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/setup/pull-images', () => {
    it('pulls required Docker images', async () => {
      Docker.prototype.pull.mockResolvedValue();

      const response = await request(app)
        .post('/api/setup/pull-images');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
      expect(Docker.prototype.pull).toHaveBeenCalled();
    });

    it('handles image pull errors', async () => {
      Docker.prototype.pull.mockRejectedValue(new Error('Network error'));

      const response = await request(app)
        .post('/api/setup/pull-images');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});
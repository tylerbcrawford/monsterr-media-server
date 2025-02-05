import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: './setup',
  build: {
    outDir: '../dist/setup',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './setup'),
      '@shared': path.resolve(__dirname, './shared'),
      '@components': path.resolve(__dirname, './setup/components'),
      '@hooks': path.resolve(__dirname, './setup/hooks'),
      '@utils': path.resolve(__dirname, './setup/utils'),
    },
  },
});
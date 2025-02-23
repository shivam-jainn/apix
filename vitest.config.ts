import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    watch: false,
    isolate: false,
  },
  resolve: {
    alias: {
      '@apix/types': '/packages/types/src/index.ts',
      '@apix/http': '/packages/plugins/http/src'
    }
  }
});
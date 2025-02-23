import { defineConfig } from 'vitest/config';
import * as path from 'path';

const configPath = path.resolve(__dirname, '../../vitest.config.ts');

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
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => ({
  plugins: [tsconfigPaths()],
  test: {
    // load .env.test in test environment
    env: loadEnv(mode, process.cwd(), ''),
  }
}));
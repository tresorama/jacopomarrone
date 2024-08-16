import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';


export default defineConfig({
  plugins: [tsconfigPaths({
    root: '../', // point to the root of the project where tsconfig.json is
  })],
});
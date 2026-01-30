import { defineConfig } from 'vitest/config';
import { join } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    //setupFiles: join(__dirname, 'src/setupTests.js'),
  },
});

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Environnement Node.js pour backend
    environment: 'node',
    
    // Dossier des tests
    include: ['tests/**/*.test.ts'],
    
    // Setup global (connexion DB, etc.)
    setupFiles: ['./tests/setup.ts'],
    
    // Timeout pour les tests async (MongoDB peut être lent)
    testTimeout: 30000,
    
    // Exécuter les tests en séquence (important pour DB)
    sequence: {
      shuffle: false,
    },
    
    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/server.ts', 'src/types/**'],
    },
    
    // Globals (describe, it, expect sans import)
    globals: true,
  },
  
  // Résolution des alias (comme tsconfig)
  resolve: {
    alias: {
      '@controllers': path.resolve(__dirname, './src/controllers'),
      '@models': path.resolve(__dirname, './src/models'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@middlewares': path.resolve(__dirname, './src/middlewares'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@config': path.resolve(__dirname, './src/config'),
    },
  },
});

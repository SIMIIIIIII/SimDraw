// tests/setup.ts
import { beforeAll, afterAll, afterEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

// Avant tous les tests : démarrer MongoDB en mémoire
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  console.log('✅ MongoDB Memory Server connecté');
});

// Après chaque test : nettoyer les collections
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Après tous les tests : fermer les connexions
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('✅ MongoDB Memory Server arrêté');
});

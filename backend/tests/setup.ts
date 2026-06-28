import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

const redisStore = new Map<string, string>();

vi.mock('../src/config/redis', () => {
  const redisMock = {
    on: vi.fn(),
    connect: vi.fn(),
    quit: vi.fn(),
    get: vi.fn(async (key: string) => redisStore.get(key) ?? null),
    set: vi.fn(async (key: string, value: string) => {
      redisStore.set(key, value);
      return 'OK';
    }),
    setex: vi.fn(async (key: string, _ttl: number, value: string) => {
      redisStore.set(key, value);
      return 'OK';
    }),
    del: vi.fn(async (key: string) => {
      return redisStore.delete(key) ? 1 : 0;
    }),
    expire: vi.fn(async () => 1),
    flushall: vi.fn(async () => {
      redisStore.clear();
      return 'OK';
    }),
  };

  return { default: redisMock };
});

let mongoServer: MongoMemoryServer;

// démarrer MongoDB en mémoire
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  console.log('✅ MongoDB Memory Server connecté');
});

// nettoyer les collections
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  redisStore.clear();
});

// fermer les connexions
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('✅ MongoDB Memory Server arrêté');
});

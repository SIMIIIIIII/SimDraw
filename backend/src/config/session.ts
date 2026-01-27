import MongoStore from 'connect-mongo';
import { SESSION_SECRET, NOV_ENV, MONGODB_URI } from './env';

export const sessionConfig = {
    secret: SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: NOV_ENV === 'test' 
        ? undefined // Utilise MemoryStore pour les tests
        : MongoStore.create({
            mongoUrl: MONGODB_URI!,
            ttl: 24 * 60 * 60 // 1 jour
        }),
    cookie: {
        secure: NOV_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 1 jour
    }
};
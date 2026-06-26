
import { SessionOptions } from 'express-session';
import { NODE_ENV, SESSION_SECRET } from './env';

const isProduction = NODE_ENV === 'production';

export const sessionConfig: SessionOptions = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        path: '/', 
        httpOnly: true, 
        secure: isProduction,
        sameSite: isProduction ? ('none' as const) : ('lax' as const),
        maxAge: 3600000
    }
}

/*
{
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
};*/
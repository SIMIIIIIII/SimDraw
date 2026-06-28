
import { SessionOptions } from 'express-session';
import { NODE_ENV, SESSION_SECRET } from './env';
import { RedisStore } from 'connect-redis';
import redis from './redis';

const isProduction = NODE_ENV === 'production';
export const SESSION_COOKIE_NAME = 'simdraw.sid';

export const sessionConfig: SessionOptions = {
    store: new RedisStore({
        client: redis as any,
        prefix: 'session:', // préfixe des clés Redis
        ttl: 1800, // 30 minutes en secondes
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        path: '/', 
        httpOnly: true, 
        secure: isProduction,
        sameSite: isProduction ? ('none' as const) : ('lax' as const),
        maxAge: 1800 * 1000
    },
    name: SESSION_COOKIE_NAME
}
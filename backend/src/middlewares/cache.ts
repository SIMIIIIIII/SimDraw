import { Request, Response, NextFunction } from 'express';
import redis from '../config/redis';

export const cacheMiddleware = (ttlSeconds: number) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const key = `cache:${req.method}:${req.originalUrl}`;
        try {
            const cached = await redis.get(key);
            if (cached) {
                console.log(`Cache HIT: ${key}`);
                res.status(200).json(JSON.parse(cached));
                return;
            }
        } catch (err) {
            console.warn('Redis indisponible');
        }

        // Intercepter res.json pour sauvegarder la réponse
        const originalJson = res.json.bind(res);
        res.json = (body: any) => {
            if (res.statusCode === 200) {
                redis.setex(key, ttlSeconds, JSON.stringify(body))
                    .catch(err => console.warn('Cache write failed:', err));
            }
            return originalJson(body);
        };
        next();
    };
}
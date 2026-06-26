import rateLimit from 'express-rate-limit'; 
 
// Limiter strict pour authentification
export const authLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, // 15 minutes 
    max: 5, // 5 tentatives max 
    skipSuccessfulRequests: true, // Ne compte que les échecs 
    message: { 
        error: 'Trop de tentatives de connexion, réessayez dans 15 minutes.', 
    }, 
});
 
// Limiter pour création de compte
export const createAccountLimiter = rateLimit({ 
    windowMs: 24 * 60 * 60 * 1000, // 24 heures 
    max: 2, // 2 comptes max par IP 
    message: { 
        error: 'Trop de comptes créés, réessayez demain.', 
    }, 
});
 
// Limiter pour API publique
export const apiLimiter = rateLimit({ 
    windowMs: 60 * 1000, // 1 minute 
    max: 60, // 60 requêtes/min 
    message: { 
        error: 'Limite de requêtes atteinte, ralentissez.', 
    }, 
}); 
 
// Limiter souple pour GET
export const readLimiter = rateLimit({ 
  windowMs: 1 * 60 * 1000, // 1 minute 
  max: 120, // 120 requêtes/min 
}); 
 
// Limiter strict pour POST/PUT/DELETE
export const writeLimiter = rateLimit({ 
  windowMs: 1 * 60 * 1000, // 1 minute 
  max: 20, // 20 requêtes/min 
}); 
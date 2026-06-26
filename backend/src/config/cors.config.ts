import { CorsOptions } from 'cors'; 

const allowedOrigins = [ 
    'http://localhost:8080',
    'https://simdraw.be',
    'https://www.simdraw.be',
]; 

/** 

// CORS pour routes publiques
export const publicCors = cors({ 
    origin: '*', 
    methods: ['GET'], 
});

// CORS pour routes authentifiées
export const authenticatedCors = cors({ 
    origin: ['http://localhost:8080', 'http://simdraw.be'],
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
});

*/
 
export const corsOptions: CorsOptions = { 
    origin: (origin, callback) => { 
        // Autoriser les requêtes sans origine (Supertest, Postman, mobile apps).
        if (!origin) {
            callback(null, true);
            return;
        }
        
        if (allowedOrigins.includes(origin)) { 
            callback(null, true); 
        } else { 
            callback(new Error('Not allowed by CORS')); 
        } 
    }, 
 
    // Méthodes HTTP autorisées 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    
    // Headers autorisés 
    allowedHeaders: [ 
        'Content-Type', 
        'Authorization',  
    ], 
 
    // Headers exposés au client 
    //exposedHeaders: ['X-Total-Count', 'X-Page-Count'], 
 
    // Autoriser les cookies 
    credentials: true, 
 
    // Cache preflight pendant 24h 
    maxAge: 86400, 
 
    // Status pour OPTIONS 
    //optionsSuccessStatus: 204, 
};
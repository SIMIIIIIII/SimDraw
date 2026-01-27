require('dotenv').config();

export const PORT: number = parseInt(process.env.PORT ?? '8090', 10);
export const SESSION_SECRET: string = process.env.SESSION_SECRET ?? 'Simdraw26simDraw26';
export const MONGODB_URI : string = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/simdraw';
export const NOV_ENV : string = process.env.NODE_ENV ?? 'development'
export const EMAIL : string = process.env.EMAIL ?? 'thesim@sim.dev'
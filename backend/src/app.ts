// src/app.ts
import express, { Application, Request, Response, /*NextFunction*/ } from 'express'; 
//import { errorHandler } from './middlewares/errorHandler'; 
 
const app: Application = express(); 
 
// Middlewares globaux 
 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
 
// CORS (Cross-Origin Resource Sharing)
/* 
app.use((req: Request, res: Response, next: NextFunction) => { 
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH'); 
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
  next(); 
}); */
 
// Route de santé 
/*app.get('/health', (req: Request, res: Response) => { 
  res.status(200).json({ 
    success: true, 
    message: 'API is running', 
    timestamp: new Date().toISOString() 
  }); 
}); */
 
// Routes API
// app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes); 
 
// Route 404 
app.use((req: Request, res: Response) => { 
  res.status(404).json({ 
    success: false, 
    message: 'Route non trouvée', 
    path: req.originalUrl 
  }); 
}); 
 
// Gestionnaire d'erreurs (toujours en dernier) 
//app.use(errorHandler); 
 
export default app;
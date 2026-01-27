import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import { sessionConfig } from '@config/session';
import HomeRoutes from './routes/homeRoutes';
import SubscriptionRoute from './routes/subscriptionRoutes'
import Account from './routes/accountRoutes'
 
const app: Application = express(); 
 
// Middlewares globaux 
 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(session(sessionConfig));

// Routes
app.use('/', HomeRoutes);
app.use('/subscription', SubscriptionRoute);
app.use('/account', Account), 

// Route 404 (doit être APRÈS les routes)
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
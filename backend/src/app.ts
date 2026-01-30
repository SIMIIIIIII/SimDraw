import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import { sessionConfig } from './config/session';

import HomeRoutes from './routes/homeRoutes';
import SubscriptionRoute from './routes/subscriptionRoutes'
import Account from './routes/accountRoutes'
import Comment from './routes/commentRoutes'
import Drawing from './routes/drawingRoutes';
import Draw from './routes/drawRoutes'
import cors from 'cors'
 
const app: Application = express(); 
 
// Middlewares globaux 
app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true,
  })
);

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(session(sessionConfig));

// Routes
app.use('/', HomeRoutes);
app.use('/subscription', SubscriptionRoute);
app.use('/account', Account);
app.use('/comment', Comment);
app.use('/drawing', Drawing);
app.use('/draw', Draw);

app.use((req: Request, res: Response) => { 
  res.status(404).json({ 
    success: false, 
    message: 'Route non trouvée', 
    path: req.originalUrl 
  }); 
});

 
export default app;
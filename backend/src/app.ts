import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import { sessionConfig } from './config/session';
import { configureHelmet } from './config/secutity';
import { corsOptions } from './config/cors.config';

import HomeRoutes from './routes/homeRoutes';
import SubscriptionRoute from './routes/subscriptionRoutes'
import Account from './routes/accountRoutes'
import Comment from './routes/commentRoutes'
import Drawing from './routes/drawingRoutes';
import Draw from './routes/drawRoutes'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
 
const app: Application = express();

configureHelmet(app)
 
// Middlewares globaux 
app.use(cors(corsOptions));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(session(sessionConfig));

// le fichier YAML
const swaggerDocument = YAML.load(
  path.join(__dirname, '../openapi.yaml')
);

// Monte l'UI sur /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'SimDraw API Docs',
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

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
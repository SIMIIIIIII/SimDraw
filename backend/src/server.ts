import app from './app'; 
import { PORT } from './config/env'
import { db } from '@config/db';

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to Database'));

 
app.listen(PORT, () => { 
  console.log(`🚀 Serveur démarré sur le port ${PORT}`); 
  console.log(`📍 Environnement: ${process.env.NODE_ENV || 
'development'}`); 
  console.log(`🔗 URL: http://localhost:${PORT}`); 
});
import dotenv from 'dotenv'; 
import app from './app'; 
 
// Charger les variables d'environnement 
dotenv.config(); 
 
const PORT = process.env.PORT || 3000; 
 
app.listen(PORT, () => { 
  console.log(`🚀 Serveur démarré sur le port ${PORT}`); 
  console.log(`📍 Environnement: ${process.env.NODE_ENV || 
'development'}`); 
  console.log(`🔗 URL: http://localhost:${PORT}`); 
});
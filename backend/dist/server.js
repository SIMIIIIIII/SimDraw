"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
db_1.db.on('error', (error) => console.error(error));
db_1.db.once('open', () => console.log('connected to Database'));
app_1.default.listen(env_1.PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${env_1.PORT}`);
    console.log(`📍 Environnement: ${process.env.NODE_ENV ||
        'development'}`);
    console.log(`🔗 URL: http://localhost:${env_1.PORT}`);
});
//# sourceMappingURL=server.js.map
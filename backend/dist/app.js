"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const session_1 = require("./config/session");
const secutity_1 = require("./config/secutity");
const cors_config_1 = require("./config/cors.config");
const homeRoutes_1 = __importDefault(require("./routes/homeRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./routes/subscriptionRoutes"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const drawingRoutes_1 = __importDefault(require("./routes/drawingRoutes"));
const drawRoutes_1 = __importDefault(require("./routes/drawRoutes"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
(0, secutity_1.configureHelmet)(app);
app.use((0, cors_1.default)(cors_config_1.corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)(session_1.sessionConfig));
const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, '../openapi.yaml'));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument, {
    customSiteTitle: 'SimDraw API Docs',
    swaggerOptions: {
        persistAuthorization: true,
    },
}));
app.use('/', homeRoutes_1.default);
app.use('/subscription', subscriptionRoutes_1.default);
app.use('/account', accountRoutes_1.default);
app.use('/comment', commentRoutes_1.default);
app.use('/drawing', drawingRoutes_1.default);
app.use('/draw', drawRoutes_1.default);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
        path: req.originalUrl
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map
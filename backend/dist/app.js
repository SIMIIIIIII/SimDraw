"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const session_1 = require("./config/session");
const homeRoutes_1 = __importDefault(require("./routes/homeRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./routes/subscriptionRoutes"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const drawingRoutes_1 = __importDefault(require("./routes/drawingRoutes"));
const drawRoutes_1 = __importDefault(require("./routes/drawRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:8080',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)(session_1.sessionConfig));
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
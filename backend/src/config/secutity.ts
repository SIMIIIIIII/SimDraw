import helmet from "helmet";
import { Application } from "express";

export function configureHelmet(app: Application) {
    app.use(
        helmet({
            contentSecurityPolicy: false,
        })
    );
}
import { sendError } from "@middlewares/apiResponse";
import { NextFunction, Request, Response } from "express"
import User from "@models/User";


export const validateUniqueUsername = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const username: string = req.body.username;
        try {
            const existingUser = await User.findOne({ username : username });
            if (existingUser) {
                sendError(res, 'Username already exists', 409);
                return;
            }
            next();
        } catch (error) {
            sendError(res, 'Internal server error', 500);
            return;
        }
    };
};

export const validateUniqueEmail = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const email: string = req.body.email;
        
        try {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                sendError(res, 'Email already exists', 409);
                return;
            }
            next();
        } catch (error) {
            sendError(res, 'Internal server error', 500);
            return;
        }
    };
};
import { NextFunction, Request, Response } from 'express'
import { sendError } from '../middlewares/apiResponse';
import User from '../models/User';
import bcrypt from 'bcryptjs'

export const DoesUserExist = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const username: string = req.body.username;
        try {
            const existingUser = await User.findOne({ username : username });
            if (!existingUser) {
                sendError(res, 'Username doesn\'t exist', 400);
                return;
            }

            const password : string = req.body.password
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);

            if (!isPasswordValid) {
                sendError(res, 'Password is incorrect', 400);
                return;
            }

            next();
        } catch (error) {
            sendError(res, 'Internal server error', 500);
            return;
        }
    };
};

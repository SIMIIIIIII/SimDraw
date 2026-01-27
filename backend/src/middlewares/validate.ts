import { sendError } from "@utils/apiResponse";
import { checkEmail, checkPassword, checkUsername } from "@utils/validator";
import { NextFunction, Request, Response } from "express"
import { Types } from "mongoose";

export const validateObjectId = (paramName: string) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        const id = req.params[paramName];
    
        if (!id || typeof id !== 'string' || !Types.ObjectId.isValid(id)) {
            sendError(
                res,
                `Invalid ${paramName} format`,
                400
            )
            return;
        }
        next();
    };
};

export const validateSearchPost = () => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) : void => {
        const searchTerm : string = req.body.searchTerm || null;

        if (!searchTerm || searchTerm.trim().length === 0){
            sendError(res, 'Search term is required', 400);
            return;
        }
        next();
    }
}

export const validateSubscriptionPost = () => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) : void => {

        const email : string = req.body.email || null;
        const username : string = req.body.username || null;
        const password : string = req.body.password || null;
        const name : string = req.body.name || null;

        if (!email || email.trim().length === 0 || !checkEmail(email)) {
            sendError(res, 'Invalid email format', 400);
            return
        }
        if (!username || username.trim().length === 0 || !checkUsername(username)) {
            sendError(res, 'Invalid username format', 400);
            return
        }
        if (!password || password.trim().length === 0 || !checkPassword(password)) {
            sendError(res, 'Invalid password format', 400);
            return
        }
        if (!name || name.trim().length === 0) {
            sendError(res, 'Name is required', 400);
            return
        }
        next();
    }
}

export const validateConnexionPost = () => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) : void => {
        
        const username : string = req.body.username || null;
        const password : string = req.body.password || null;
        
        if (!username || username.trim().length === 0 || !checkUsername(username)) {
            sendError(res, 'Invalid username format', 400);
            return
        }
        if (!password || password.trim().length === 0 || !checkPassword(password)) {
            sendError(res, 'Invalid password format', 400);
            return
        }

        next();
    }
}
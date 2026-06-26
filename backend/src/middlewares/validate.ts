import { sendError } from "../middlewares/apiResponse";
import Drawing from "../models/Drawing";
import { NextFunction, Request, Response } from "express"
import { Types } from "mongoose";
import { Req } from "../types/sessionTypes";
import { z } from 'zod'
import { getFirstZodError } from "../utils/validator";


export const validateCreateUser = z.object({
    email: z.string().trim().email('Format email invalide'),
    username: z.string()
        .trim()
        .min(6, 'Username trop court, min 6 caractère')
        .max(20, 'Username trop long')
        .refine((value) => !value.includes(' '), 'Username ne doit pas contenir d\'espace'),
    password: z.string()
        .trim()
        .min(8, 'Mot de passe trop court, min 8 caractères')
        .max(32, 'Mot de passe trop long, max 32 caractères')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins 1 majuscule')
        .regex(/[a-z]/, 'Le mot de passe doit contenir au moins 1 minuscule')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins 1 chiffre')
        .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins 1 caractère spécial'),
    name: z.string().trim().min(1, 'Name is required')
})


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

        const parsed = validateCreateUser.safeParse(req.body);

        if (!parsed.success) {
            sendError(res, getFirstZodError(parsed.error), 400);
            return
        }

        req.body = parsed.data;
        next();
    }
}

export const validateAdminPost = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<void> => {
        const drawingId : string = typeof req.params.id === 'string' ? req.params.id : ' ';

        if (!Types.ObjectId.isValid(drawingId)){
            sendError(res, `${drawingId} is not an ObjectId`, 400);
            return
        }

        if (! await Drawing.findById(drawingId)){
            sendError(res, 'Drawing not found', 404);
            return;
        }

        (req as Req).drawingId = new Types.ObjectId(drawingId);
        next();
    }
}
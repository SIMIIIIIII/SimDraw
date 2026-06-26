import { NextFunction, Request, Response } from 'express'
import { sendError } from '../middlewares/apiResponse';
import User from '../models/User';
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getFirstZodError } from '../utils/validator';


export const validateConnexionForm = z.object({
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
        .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins 1 caractère spécial')

})

export const validateConnexion = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const parsed = validateConnexionForm.safeParse(req.body);
        if (!parsed.success) {
            sendError(res, getFirstZodError(parsed.error), 400);
            return;
        }
        
        req.body = parsed.data;

        const username: string = req.body.username;
        try {
            const existingUser = await User.findOne({ username : username });
            if (!existingUser) {
                sendError(res, 'Username doesn\'t exist', 400);
                return;
            }

            const password = req.body.password
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

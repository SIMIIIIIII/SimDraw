import { Request, Response } from "express";
import { IUser } from "types/user";
import { hashPassword } from "@utils/helpers";
import User from "@models/User";
import { sendSuccessWithData, sendError } from "@utils/apiResponse";
import { EMAIL } from "@config/env";

export const subscription = async (
    req: Request,
    res: Response
) : Promise<void> => {
    try {

        const user : IUser = {
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            password: await hashPassword(req.body.password),
            admin: req.body.email === EMAIL
        }

        const newUser = await User.create(user);

        req.session.user = {
            id: newUser._id,
            username: newUser.username,
            emoji: newUser.emoji!,
            admin: newUser.admin!,
        };

        sendSuccessWithData(res, 'User succesfully created', 201, req.session.user)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}
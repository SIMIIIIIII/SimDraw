import { Response, Request} from "express";
import User from "../models/User";
import { sendSuccessWithData, sendError, sendSuccess } from "../middlewares/apiResponse";
import { SessionData } from "../types/sessionTypes";

export const connexion = async (
    req: Request,
    res: Response,
)  : Promise<void> => {

    try {
        const username = req.body.username;
        const user = await User.findOne({ username: username });

        (req.session as SessionData).user = {
            id: user?._id!,
            username: user?.username!,
            emoji: user?.emoji!,
            admin: user?.admin!,
        };
        
        sendSuccessWithData(res, 'User successfull connected', 200, (req.session as SessionData).user);
        
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}

export const getUserInfos = async (
    req: Request,
    res: Response,
) : Promise<void> => {
    try {
        const user = await User.findById((req.session as SessionData).user?.id);
        
        const userInfo = {
            username: user?.username,
            name: user?.name,
            admin: user?.admin,
            email: user?.email,
            emoji:user?.emoji,
        }
        sendSuccessWithData(res, 'Users informations', 200, userInfo)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}

export const logout = async (
    req: Request,
    res: Response,
) : Promise<void> => {
    req.session.destroy((err) => {
        if (err) {
            sendError(res, 'Erreur server', 500);
            return;
        }
        res.clearCookie('connect.sid');
        sendSuccess(res, 'User deconnecté', 204);
    });
}
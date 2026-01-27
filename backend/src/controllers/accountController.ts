import { Response, Request} from "express";
import User from "@models/User";
import { sendSuccessWithData, sendError } from "@utils/apiResponse";

export const connexion = async (
    req: Request,
    res: Response,
)  : Promise<void> => {

    try {
        const username = req.body.username;
        const user = await User.findOne({ username: username });

        req.session.user = {
            id: user?._id!,
            username: user?.username!,
            emoji: user?.emoji!,
            admin: user?.admin!,
        };
        
        sendSuccessWithData(res, 'User successfull connected', 200, req.session.user);
        
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}
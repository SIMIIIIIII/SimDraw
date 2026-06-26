import { Response, Request } from "express";
import Drawing from "../models/Drawing";
import { setCanModify, sortByUpdatedAt } from "../utils/drawingHelpers";
import { sendSuccessWithData, sendError } from "../middlewares/apiResponse";
import { SessionData, Req } from '../types/sessionTypes'
import { Types } from "mongoose";

export const home = async (
    req: Request,
    res: Response
) : Promise<void> => {
    try {
        const drawings = await Drawing.findPublicCompleted();
        sortByUpdatedAt(drawings);
        
        if ((req as Req).isAuthenticated) setCanModify(drawings, (req.session as SessionData).user?.id);
        sendSuccessWithData(res, 'Succes !!!', 200, drawings);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
  }
}

export const byAuthor = async (
    req: Request,
    res: Response
) : Promise<void> => {
    try {
        const id = (req.params.id as string);

        if (!Types.ObjectId.isValid(id)) {
            sendError(res, 'Auteur invalide', 400);
            return;
        }

        const authorId = new Types.ObjectId(id);

        const drawings = await Drawing.findPublicCompleted({ author: authorId })
        sortByUpdatedAt(drawings);

        if ((req as Req).isAuthenticated) setCanModify(drawings, (req.session as SessionData).user?.id);
        sendSuccessWithData(res, 'Succes !!!', 200, drawings);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }

}

export const byTheme = async (
    req: Request,
    res: Response
) : Promise<void> => {
    try {
        const drawings = await Drawing.findPublicCompleted({ theme: req.params.theme as string })
        sortByUpdatedAt(drawings);

        if ((req as Req).isAuthenticated) setCanModify(drawings, (req.session as SessionData).user?.id);
        sendSuccessWithData(res, 'Succes !!!', 200, drawings);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}

export const my_drawings = async (
    req: Request,
    res: Response
) : Promise<void> => {
    try {
        const userId = (req.session as SessionData).user?.id;

        if (!userId) {
            sendError(res, 'Utilisateur non authentifie', 401);
            return;
        }

        const drawings = await Drawing.where('author.authorId').equals(userId);

        drawings.sort((x, y) => {
            if (!x.isDone) return -1;
            if (!y.isDone) return 1;
            if (!x.isPublic) return -1;
            if (!y.isPublic) return 1;
            return 0;
        });

        sendSuccessWithData(res, 'Mes dessins', 200, drawings);

  } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
  }
}
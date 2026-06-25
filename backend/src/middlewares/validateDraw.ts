import { NextFunction, Request, Response } from "express"
import { sendError } from "./apiResponse";
import Drawing from "../models/Drawing";
import { hasParticipated } from "../utils/helpers";
import { Req, SessionData } from "../types/sessionTypes";
import { isValidPath } from "../types/drawing";

export const isPartyOn = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<void> => {
        try {
            const userId = (req.session as SessionData).user?.id;
             if (!userId) {
                sendError(res, 'Not authenticated', 401);
                return;
            }

            const drawings = await Drawing.find(
                {
                    isDone: false,
                    isPublic: false,
                    currentTurn: null
                }
            ) ?? [];

            const availableDrawings = drawings.filter(drawing =>
                drawing.participants.length < drawing.maxParticipants! &&
                !hasParticipated(drawing.participants || [], userId)
            );

            availableDrawings.sort((a, b) : number => {
                return a.maxParticipants! - a.participants.length - (b.maxParticipants! - b.participants.length);
            });

            if (availableDrawings.length === 0){
                sendError(res, 'No party On', 404);
                return
            }

            (req as Req).drawingId = availableDrawings[0]?._id!;
            next();

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            sendError(res, message, 500);
        }
    }
}

export const validateDrawPost = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<void> => {

        const newPaths = req.body.paths;
        const start = req.body.start;
        const end = req.body.end;
            
        if (typeof start !== 'number' || start < 0){
            sendError(res, 'start index invalid', 400);
            return;
        }
        
        if (typeof end !== 'number' || end < 0){
            sendError(res, 'end index invalid', 400);
            return;
        }
        
        if (!isValidPath(newPaths)){
            sendError(res, 'Path invalid', 400);
            return;
        }
        next();
    }
}
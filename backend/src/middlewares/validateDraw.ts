import { NextFunction, Request, Response } from "express"
import { sendError } from "./apiResponse";
import { Types } from "mongoose";
import Drawing from "../models/Drawing";
import { setTimer } from "./timer";
import { hasParticipated } from "../utils/helpers";
import { isValidPath } from "../types/drawing";
import { SessionData } from "../types/sessionTypes";

export const isPartyOn = () => {
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

        try {
            const drawing = await Drawing.findById(drawingId);
            if (!drawing){
                sendError(res, 'drawing do not exist', 404);
                return
            }
                    
            if (drawing.isDone || drawing.isPublic){
                sendError(res, 'Drawing is done', 403);
                return;
            }
            
            next();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            sendError(res, message, 500);
        }
    }
}

export const isCurrentTurn = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<void> => {
        const drawingId : string = (typeof req.params.id === 'string' ? req.params.id : ' ')
        const drawing = await Drawing.findById(drawingId);

        if (drawing?.currentTurn && drawing?.currentTurn !== (req.session as SessionData).user?.id) {
            setTimer(drawingId);
            sendError(res, 'Someone else is drawing', 403);
            return;
        }
        
        if (hasParticipated(drawing?.participants!, new Types.ObjectId(drawingId))) {
            setTimer(drawingId);
            sendError(res, 'Not your turn', 403);
            return
        }

        if (drawing?.participants?.length! >= drawing?.maxParticipants!){
            await Drawing.findByIdAndUpdate(drawingId, {isDone: true, currentTurn: null});
            sendError(res, 'Drawing is done', 403);
            return
        }
        next()
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
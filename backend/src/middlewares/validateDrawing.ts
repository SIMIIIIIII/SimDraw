import { NextFunction, Request, Response } from "express"
import { sendError } from "./apiResponse";
import { Types } from "mongoose";
import Drawing from "../models/Drawing";
import { SessionData } from "../types/sessionTypes";

export const validateDrawingPost = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<void> => {
        const title : string = req.body.title;
        const description : string = req.body.description;

        if (!title || title.trim().length === 0){
            sendError(res, 'Empty title', 400);
            return;
        }

        if (!description || description.trim().length === 0){
            sendError(res, 'Empty description', 400);
            return;
        }

        next();
    }
}

export const validateDrawingId = () => {
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

            if (!drawing.isDone || !drawing.isPublic){
                sendError(res, 'Drawing not public', 403);
                return;
            }

            next();
        
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            sendError(res, message, 500);
        }
    }
}

export const drawingBelongTo = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<void> => {

        try {
            const drawing = await Drawing.findById(req.params.id);
            if (!drawing){
                sendError(res, 'drawing do not exist', 404);
                return
            }
            
            if (!drawing?.author.authorId.equals((req.session as SessionData).user?.id) && !(req.session as SessionData).user!.admin){
                sendError(res, 'Not allowed', 403);
                return;
            }
            
            next();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            sendError(res, message, 500);
        }
    }
}
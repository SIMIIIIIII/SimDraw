import { NextFunction, Request, Response } from "express"
import { sendError } from "./apiResponse";
import Drawing from "../models/Drawing";
import { Types } from "mongoose";
import Comment from "../models/Comment";
import { SessionData } from "../types/sessionTypes";

export const validateCommentPost = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<void> => {
        const drawingId = req.body.drawingId;
        const comment = req.body.comment;

        if (!comment || comment.trim().length === 0){
            sendError(res, 'Empty comment', 400);
            return;
        }

        if (!drawingId){
            sendError(res, 'drawingId missing', 400);
            return;
        }

        if (!Types.ObjectId.isValid(drawingId)){
            sendError(res, `${drawingId} is not an ObjectId`, 400);
            return;
        }

        try {
            const drawing = await Drawing.findById(drawingId)

            if (!drawing){
                sendError(res, 'Drawing doesn\'t exist', 404);
                return;
            }
            if (!drawing.isPublic){
                sendError(res, 'Drawins is not public', 403);
                return;
            }
            next();
            
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            sendError(res, message, 500);
        }
    }
}


export const validateCommentId = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<void> => {
        const commentId : string = typeof req.params.id === 'string' ? req.params.id : ' ';
        

        if (!Types.ObjectId.isValid(commentId)){
            sendError(res, `${commentId} is not an ObjectId`, 400);
            return
        }

        try {
            const comment = await Comment.findById(commentId);
            if (!comment){
                sendError(res, 'Comment do not exist', 404);
                return
            }

            if (!comment.author.authorId.equals((req.session as SessionData).user?.id)){
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

export const validateCommentPut = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<void> => {
        const comment = req.body.comment;

        if (!comment || comment.trim().length === 0){
            sendError(res, 'Empty comment', 400);
            return;
        }

        next();
    }
}
import { NextFunction, Request, Response } from "express"
import { sendError } from "./apiResponse";
import { Types } from "mongoose";
import Drawing from "../models/Drawing";
import { Req, SessionData } from "../types/sessionTypes";
import { z } from 'zod'
import { getFirstZodError } from "../utils/validator";
import redis from '../config/redis';
import { searchInCache } from "../utils/drawingHelpers";

const isDrawingAccessible = (drawing: {
    participants?: unknown[];
    maxParticipants?: number;
    isDone?: boolean;
    isPublic?: boolean;
}): boolean => {
    const participantCount = drawing.participants?.length || 0;
    const maxParticipants = drawing.maxParticipants || 1;
    const isDrawingCompleted = participantCount >= maxParticipants;

    return Boolean(drawing.isPublic) && (Boolean(drawing.isDone) || isDrawingCompleted);
};


export const createDrawingSchema = z.object({
        title: z.string().trim().min(1, "Titre vide").max(120, "Titre trop long"),
        theme: z.string().trim().min(1, "Theme vide").max(60, "Theme trop long"),
        description: z.string().trim().min(1, "Description Vide").max(2000, "Description trop long"),
        maxParticipants: z.coerce.number().int().min(2, "min 2 participant").max(8, "max 8 participants").default(2),
    }
)

export const updateDrawingSchema = z.object({
    title: z.string().trim().min(1, "Titre vide").max(120, "Titre trop long"),
    description: z.string().trim().min(1, "Description Vide").max(2000, "Description trop long"),
});


export const validateCreateDrawingPost = () => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        const parsed = createDrawingSchema.safeParse(req.body);
        if (!parsed.success) {
            sendError(res, getFirstZodError(parsed.error), 400);
            return;
        }
    
        req.body = parsed.data;
        next();
    }
}

export const validateModifyDrawingPost = () => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) : void => {
        const parsed = updateDrawingSchema.safeParse(req.body)
        if (!parsed.success) {
            sendError(res, getFirstZodError(parsed.error), 400)
            return
        }

        req.body = parsed.data;
        next();
    }
}

export const validateDrawingId = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const drawingId: string = typeof req.params.id === "string" ? req.params.id : " ";
        if (!Types.ObjectId.isValid(drawingId)) {
            sendError(res, drawingId + " n'est pas un ObjectId", 400);
            return;
        }

        try {
            const cacheKey = `drawing:${drawingId}`
            const cached = await searchInCache(cacheKey)
            if (cached) {
                try {
                    const cachedDrawing = JSON.parse(cached);
                    if (!isDrawingAccessible(cachedDrawing)) {
                        await redis.del(cacheKey);
                        sendError(res, "Drawing not public", 403);
                        return;
                    }

                    (req as Req).drawing = cachedDrawing;
                    next()
                    return
                } catch {
                    await redis.del(cacheKey);
                }
            }

            const drawing = await Drawing.findById(drawingId).lean();
            if (!drawing) {
                sendError(res, "drawing do not exist", 404);
                return;
            }

            if (!isDrawingAccessible(drawing)) {
                sendError(res, "Drawing not public", 403);
                return;
            }

            try {
                await redis.setex(cacheKey, 600, JSON.stringify(drawing));
            } catch {
                
            }

            (req as Req).drawing = drawing;
            next();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur inconnue";
            sendError(res, message, 500);
        }
    };
}

export const drawingBelongTo = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const cacheKey = `drawing:${req.params.id}`
            const cached = await searchInCache(cacheKey)

            let drawing = null;

            if (cached){
                drawing = JSON.parse(cached);
            }
            else {
                drawing = await Drawing.findById(req.params.id);
            }
            
            if (!drawing) {
                sendError(res, "Le dessin n'existe pas", 404);
                return;
            }

            if (
                !drawing.author.authorId.equals((req.session as SessionData).user?.id) &&
                !(req.session as SessionData).user!.admin
            ) {
                sendError(res, "Not allowed", 403);
                return;
            }

            try {
                await redis.setex(cacheKey, 600, JSON.stringify(drawing));
            } catch {
                
            }

            next();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur inconnue";
            sendError(res, message, 500);
        }
    };
}
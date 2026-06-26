import { NextFunction, Request, Response } from "express"
import { sendError } from "./apiResponse";
import Drawing from "../models/Drawing";
import { hasParticipated } from "../utils/helpers";
import { Req, SessionData } from "../types/sessionTypes";
import { isValidPath } from "../types/drawing";
import { z } from 'zod'
import { getFirstZodError } from "../utils/validator";


const validateModifyDraw = z.object({
    start: z.number().min(0, "Start doit être >= 0"),
    end: z.number().min(0, "End doit être >= 0"),
    paths: z.unknown()
}).refine((data) => data.end > data.start, {
    message: "End doit être superieur à start",
    path: ["end"]
}).superRefine((data, ctx) => {
    if (!isValidPath(data.paths)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Path invalid",
            path: ["paths"]
        });
    }
})

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
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) : void => {
        const parsed = validateModifyDraw.safeParse(req.body);

        if (!parsed.success) {
            sendError(res, getFirstZodError(parsed.error), 400);
            return;
        }

        req.body = parsed.data;
        next();
    }
}
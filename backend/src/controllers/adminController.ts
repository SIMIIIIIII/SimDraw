import { Response, Request } from 'express'
import Drawing from '../models/Drawing';
import { sendSuccessWithData, sendError, sendSuccess } from '../middlewares/apiResponse';
import { Req } from '../types/sessionTypes';

export const admin = async (
    _req: Request,
    res: Response,
) : Promise<void> => {
    try {
        const drawings = await Drawing.find({
            isPublic: false,
            $or: [
                { isDone: true },
                {
                    $expr: {
                        $gte: [
                            { $size: { $ifNull: ['$participants', []] } },
                            { $ifNull: ['$maxParticipants', 1] }
                        ]
                    }
                }
            ]
        });
        
        sendSuccessWithData(res, 'Dessins finis', 201, drawings);

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}

export const accepteDrawing = async (
    req: Request,
    res: Response,
) : Promise<void> => {
    try {
        const drawingId = (req as Req).drawingId

        await Drawing.findByIdAndUpdate(drawingId, {
            isPublic: true,
            isDone: true,
            currentTurn: null,
        })
        sendSuccess(res, 'Dessin rendu publique', 200);
        
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}

export const refuseDrawing = async (
    req: Request,
    res: Response,
) : Promise<void> => {
    try {
        const drawingId = (req as Req).drawingId

        await Drawing.findByIdAndDelete(drawingId);
        sendSuccess(res, 'Dessin Supprimé', 200);
        
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}
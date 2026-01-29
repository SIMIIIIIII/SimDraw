import { Response, Request } from 'express'
import Drawing from '@models/Drawing';
import { sendSuccessWithData, sendError, sendSuccess } from '@middlewares/apiResponse';

export const admin = async (
    _req: Request,
    res: Response,
) : Promise<void> => {
    try {
        const drawings = await Drawing.find({
            isDone: true,
            isPublic: false,
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
        const choice = req.body.choice;
        const drawingId = req.body.drawingId;

        await Drawing.findByIdAndUpdate(drawingId, {isPublic: true})
        sendSuccess(res, 'Dessin rendu publique', 204);
        
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
        const choice = req.body.choice;
        const drawingId = req.body.drawingId;

        await Drawing.findByIdAndDelete(drawingId);
        sendSuccess(res, 'Dessin Supprimé', 204);
        
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}
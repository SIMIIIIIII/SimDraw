import { Response, Request } from 'express';
import { sendSuccess, sendError, sendSuccessWithData } from '../middlewares/apiResponse';
import Drawing from '../models/Drawing';
import { setTimer } from '../middlewares/timer';
import User from '../models/User';
import { Req, SessionData } from '../types/sessionTypes';


export const getToDraw = async (
    req : Request,
    res : Response
) : Promise<void> => {
    try {
        const drawing = await Drawing.findByIdAndUpdate((req as Req).drawingId, {currentTurn: (req.session as SessionData).user?.id});
        setTimer(drawing?._id!.toString()!);

        sendSuccessWithData(res, 'Your turn', 200, drawing);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}

export const saveDraw = async (
    req : Request,
    res : Response
) : Promise<void> => {
    try {
        const newPaths = req.body.paths;
        const start = req.body.start;
        const end = req.body.end;
        const userId = (req.session as SessionData).user?.id;
        const drawingId = req.params.id;

        if (!userId) {
            sendError(res, 'Not authenticated', 401);
            return;
        }

        const normalizedPaths = Array.isArray(newPaths)
            ? newPaths.map((path: { points: unknown[]; color?: string; size?: number; timestamp?: number }) => ({
                ...path,
                userId,
            }))
            : [];

        const drawing = await Drawing.findByIdAndUpdate(
            drawingId,
            {
                $push: {
                    participants: {
                        userId: userId,
                        start: start,
                        end: end
                    },
                    path: { $each: normalizedPaths }
                },
                currentTurn: null
            },
            { new: true }
        )

        if (!drawing) {
            sendError(res, 'Drawing not found', 404);
            return;
        }

        if (drawing.participants.length >= drawing.maxParticipants!){
            drawing.isDone = true;
            await drawing.save();
        }

        await User.findByIdAndUpdate(userId, {
            $push: {
                drawings: {drawingId: drawingId},
            },
        });

        sendSuccess(res, 'Modifications ajoutées au dessin', 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}

export const giveUp = async (
    req : Request,
    res : Response
) : Promise<void> => {
    try {
        await Drawing.findByIdAndUpdate(req.params.id, {currentTurn: null})
        sendSuccess(res, 'Paties abandonnée', 200)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}
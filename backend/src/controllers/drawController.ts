import { Response, Request } from 'express';
import { sendSuccess, sendError, sendSuccessWithData } from '../middlewares/apiResponse';
import Drawing from '../models/Drawing';
import { setTimer } from '../middlewares/timer';
import User from '../models/User';
import { SessionData } from '../types/sessionTypes';


export const getToDraw = async (
    req : Request,
    res : Response
) : Promise<void> => {
    try {
        const drawing = await Drawing.findByIdAndUpdate(req.params.id, {currentTurn: (req.session as SessionData).user?.id});
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

        const drawing = await Drawing.findByIdAndUpdate(
            drawingId,
            {
                $push: {
                    participants: {
                        userId: userId,
                        start: start,
                        end: end
                    },
                    path: newPaths
                },
                currentTurn: null
            }
        )

        if (drawing?.participants?.length! >= drawing?.maxParticipants!){;
            await Drawing.findByIdAndUpdate(drawingId, {isDone: true, currentTurn: null});
        }

        await User.findByIdAndUpdate({
            $push: {
                drawings: {drawingId: drawingId},
            },
        });

        sendSuccess(res, 'Drawing saved', 204);
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
        sendSuccess(res, 'Party given up', 204)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}
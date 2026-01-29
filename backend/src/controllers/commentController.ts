import { Response, Request } from 'express';
import Comment from '@models/Comment';
import { Types } from 'mongoose';
import { sendSuccess, sendError } from '@middlewares/apiResponse';

export const createComment = async (
    req : Request,
    res : Response
) : Promise<void> => {
    try {
        const drawingId = req.body.drawingId.trim();
        const comment = req.body.comment.trim();

        await Comment.create({
            comment: comment,
            author: {
                authorId: req.session.user?.id! as Types.ObjectId,
                username: req.session.user?.username!,
                emoji: req.session.user?.emoji!,
            },
            postId: drawingId,
        });

        sendSuccess(res, 'Comment created', 201);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}

export const deleteComment = async (
    req : Request,
    res : Response
) : Promise<void> => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        sendSuccess(res, 'Comment deleted successfully', 204);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}

export const modifyComment = async (
    req : Request,
    res : Response
) : Promise<void> => {
    try {
        await Comment.findByIdAndUpdate(req.params.id, {comment: req.body.comment})
        sendSuccess(res, 'Comment modify', 204);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
} 
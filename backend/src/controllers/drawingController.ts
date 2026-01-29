import { Response, Request } from 'express';
import { sendSuccess, sendError, sendSuccessWithData } from '@middlewares/apiResponse';
import Drawing from '@models/Drawing';
import { formattedParticipants, hasCommented } from '@utils/helpers';
import Comment from '@models/Comment';


export const createDrawing = async (
    req : Request,
    res : Response
) : Promise<void> => {
    try {
        await Drawing.create({
            title: req.body.title,
            theme: req.body.theme,
            author: {
                username: req.session.user?.username!,
                authorId: req.session.user?.id!,
                emoji: req.session.user?.emoji!,
            },
            description: req.body.description,
            maxParticipants: req.body.maxParticipants || 1,
        });
        sendSuccess(res, 'Drawing created successfull', 201);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}

export const getDrawing = async (
    req : Request,
    res : Response
) : Promise<void> => {
    try {
        const drawing = await Drawing.findById(req.params.id);
        await formattedParticipants(drawing!);

        const comments = await Comment.find({postId : drawing?._id!});
        if (req.isAuthenticated) hasCommented(comments, req.session.user?.id!);

        comments.sort((a, b) => {
            if (a.hasPosted) return -1;
            if (b.hasPosted) return 1;
            return b.createdAt.getMilliseconds() - a.createdAt.getMilliseconds();
        });

        sendSuccessWithData(res, drawing?.title!, 200, {drawing: drawing, comments: comments});
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}

export const likeDrawing = async ( 
    req : Request,
    res : Response
) : Promise<void> => {
    try {
        const drawing = await Drawing.findById(req.params.id);
        let message : string;
        

        const hasLiked = drawing?.whoLiked.filter((id) => id.toString().includes(req.session.user?.id.toString()!))

        if (hasLiked?.length === 0) {
            await Drawing.findByIdAndUpdate(
                req.params.id,
                {
                    likes: drawing?.likes! + 1,
                    $push: {
                        whoLiked: req.session.user?.id!
                    }
                }
            );
            message = 'Drawing liked'
            sendSuccess(res, message, 205);
        }

        else {
            await Drawing.findByIdAndUpdate(
                req.params.id,
                {
                    whoLiked: drawing?.whoLiked.filter((x) => x !== req.session.user?.id!),
                    likes: drawing?.likes! - 1
                }
            );
            
            message = 'Like removed'
            sendSuccess(res, message, 204);
        }
        
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}

export const deleteDrawing = async ( 
    req : Request,
    res : Response
) : Promise<void> => {
    try {
        await Drawing.findByIdAndDelete(req.params.id);
        sendSuccess(res, 'Drawing deleted', 204);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}

export const modifyDrawing = async ( 
    req : Request,
    res : Response
) : Promise<void> => {
    try {
        const drawing = await Drawing.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description
            }
        )
        sendSuccessWithData(res, 'Drawings Info modified', 200, drawing);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}
import { Response, Request } from "express";
import Drawing from "@models/Drawing";
import { setCanModify, sortByUpdatedAt } from "@utils/drawingHelpers";
import { sendSuccessWithData, sendError } from "@utils/apiResponse";

export const home = async (
    req: Request,
    res: Response
) : Promise<void> => {
    try {
        const drawings = await Drawing.find({ isDone: true, isPublic: true });
        sortByUpdatedAt(drawings);

        if (req.isAuthenticated) setCanModify(drawings, req.session.user?.id);
        sendSuccessWithData(res, 'Succes !!!', 200, drawings);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
  }
}

export const byAuthor = async (
    req: Request,
    res: Response
) : Promise<void> => {
    try {
        const id = req.params.id;
        const drawings = await Drawing.find({
            author: {
                authorId: id
            },
            isDone: true,
            isPublic: true,
        }) 
        sortByUpdatedAt(drawings);

        if (req.isAuthenticated) setCanModify(drawings, req.session.user?.id);
        sendSuccessWithData(res, 'Succes !!!', 200, drawings);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }

}

export const byTheme = async (
    req: Request,
    res: Response
) : Promise<void> => {
    try {
        const theme = req.params.theme;
        const drawings = await Drawing.find({
            isDone: true,
            isPublic: true,
            theme: (typeof theme ==='string' ? theme : null)
        }) 
        sortByUpdatedAt(drawings);

        if (req.isAuthenticated) setCanModify(drawings, req.session.user?.id);
        sendSuccessWithData(res, 'Succes !!!', 200, drawings);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}

export const my_drawings = async (
    req: Request,
    res: Response
) : Promise<void> => {
    try {
        const drawings = await Drawing.find({
            author: {
                authorId: req.session.user?.id
            }
        });

        drawings.sort((x, y) => {
            if (!x.isDone) return -1;
            if (!y.isDone) return 1;
            if (!x.isPublic) return -1;
            if (!y.isPublic) return 1;
            return 0;
        });

        sendSuccessWithData(res, 'Mes dessins', 200, drawings);

  } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
  }
}
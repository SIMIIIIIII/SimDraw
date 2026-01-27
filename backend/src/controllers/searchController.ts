import { Response, Request } from "express";
import { search_helpers } from "@utils/searchHelpers";
import { ITFforIDF } from "types/search";
import Drawing from "@models/Drawing";
import { setCanModify } from "@utils/drawingHelpers";
import { sendError, sendSuccessWithData } from "@middlewares/apiResponse";
import { Types } from "mongoose";

export const search = async (
    req: Request,
    res: Response
) : Promise<void> => {
    try {
        const searchTerm : string = req.body.searchTerm.trim();

        const TFIDF : ITFforIDF[] = await search_helpers.research();
        const listWords : string[] = search_helpers.filter(searchTerm);

        const filteredWords : ITFforIDF[] = search_helpers.getTFWithWords(TFIDF, listWords);
        
        const drawingsIdList : Types.ObjectId[] = filteredWords.map((doc) => doc.drawingId);

        const drawings = await Drawing.find({
            id: { $in: drawingsIdList },
            isDone: true,
            isPublic: true,
        });

        if (req.isAuthenticated) setCanModify(drawings, req.session.user?.id);

        const message : string = search_helpers.getSearchMessage(drawings.length, searchTerm);

        sendSuccessWithData(res, message, 200, drawings);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        sendError(res, message, 500);
    }
}
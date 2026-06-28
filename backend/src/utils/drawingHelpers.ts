import { IDrawing } from "types/drawing";
import { Types } from "mongoose";
import { IDrawingDocument } from "../models/Drawing";
import redis from '../config/redis';

export const setCanModify = (
    drawings: IDrawing[],
    userId: Types.ObjectId | undefined
): void => {
    drawings.forEach((drawing) => {
      if (drawing.author.authorId === userId) drawing.canModify = true;
    });
}

export const sortByUpdatedAt = (
    drawings : IDrawing[]
) : void => {
    drawings.sort((a, b) : number => {
        if (b.likes === a.likes) {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        return b.likes - a.likes;
    });
    
}

export const isDrawingAccessible = (drawing: IDrawingDocument): boolean => {
    const participantCount = drawing.participants?.length || 0;
    const maxParticipants = drawing.maxParticipants || 1;
    const isDrawingCompleted = participantCount >= maxParticipants;

    return (drawing.isPublic && Boolean(drawing.isDone)) || isDrawingCompleted;
};

export const searchInCache = async (cacheKey : string) => {
    let cached: string | null = null;
    try {
        cached = await redis.get(cacheKey);
    } catch {
        cached = null;
    }
    return cached
}
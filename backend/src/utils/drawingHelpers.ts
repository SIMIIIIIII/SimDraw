import { IDrawing } from "types/drawing";
import { Types } from "mongoose";

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
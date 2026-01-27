import { Types } from "mongoose"
import { IDrawing } from "../../src/types/drawing"
import { createMockAuthor } from "./authorFactory"

export const createMockDrawing = (overrides = {}) : IDrawing => {
    return {
        _id: new Types.ObjectId,
        title: 'titre 1',
        theme: 'theme 1',
        description: "",
        participants: [],
        maxParticipants: 2,
        path: [],
        currentTurn: new Types.ObjectId,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: createMockAuthor(),
        likes: 5,
        whoLiked: [],
        isDone: true,
        isPublic: false,
        //canModify?: boolean
        ... overrides
    }
}
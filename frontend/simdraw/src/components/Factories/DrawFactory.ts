import type { IDrawing } from "../../types/drawing"

export const createDrawing = (overrides = {}) : IDrawing => {
    return {
        _id: "1234",
        title: "Drawing 1",
        theme: 'Theme1',
        description: "Ici je suis",
        participants: [],
        path: [],
        createdAt: new Date,
        updatedAt: new Date,
        isDone: true,
        isPublic: true,
        likes: 6,
        whoLiked: [""],
        author: {
            authorId: "1234",
            username: 'simiii'
        },
        ...overrides
    }
}
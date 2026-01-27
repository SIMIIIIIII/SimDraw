import { IAuthor } from "../../src/types/author";
import { Types } from "mongoose";

export const createMockAuthor = (overrides = {}) : IAuthor => {
    return {
        authorId: new Types.ObjectId,
        username: 'Simiii',
        ...overrides,
    }
}
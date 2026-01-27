import { IComment } from '../../src/types/comment'
import { Types } from 'mongoose'
import { createMockAuthor } from './authorFactory'

export const createMockComment = (overrides = {}) : IComment => {
    return {
        postId: new Types.ObjectId,
        comment: '',
        author: createMockAuthor(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    }
}
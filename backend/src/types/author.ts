import { Types } from 'mongoose'

export interface IAuthor {
    authorId: Types.ObjectId,
    username: string,
    emoji?: string
}
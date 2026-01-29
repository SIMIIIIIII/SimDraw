import { IAuthor } from './author'
import { Types } from 'mongoose'


export interface IComment {
    comment: string,
    postId: Types.ObjectId,
    author: IAuthor,
    createdAt: Date,
    updatedAt: Date,
    hasPosted?: Boolean
}
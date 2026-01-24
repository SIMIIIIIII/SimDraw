import { IAuthor } from './author'

export interface IComment {
    comment: string,
    postId: string,
    author: IAuthor,
    createdAt: Date,
    updatedAt: Date
}
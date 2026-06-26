import type { IAuthor } from './author'


export interface IComment {
    _id?: string,
    comment: string,
    postId: string,
    author: IAuthor,
    createdAt: Date,
    updatedAt: Date,
    hasPosted?: boolean
}
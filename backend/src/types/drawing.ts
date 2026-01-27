import { IAuthor } from './author'
import { Types } from 'mongoose';
import { ApiResponseWithData } from './api';

interface IParticipant {
    userId: Types.ObjectId;
    joinedAt?: Date;     
    isActive?: boolean;  
    start: number;       
    end: number;
}

interface IPoints {
    x: number,
    y: number,
}

interface IPath {
    points: IPoints[],
    userId: Types.ObjectId,
    color: string,
    size: number,
    timestamp: number
}

export interface IDrawing {
    _id: Types.ObjectId,
    title: string,
    theme: string,
    description?: string,
    participants: IParticipant[],
    maxParticipants?: number,
    path: IPath[],
    currentTurn?: Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
    author: IAuthor,
    likes: number,
    whoLiked: Types.ObjectId[],
    isDone: boolean,
    isPublic: boolean
    canModify?: boolean
}

export type DrawingResponse = ApiResponseWithData<IDrawing>;
export type DrawingsListResponse = ApiResponseWithData<IDrawing[]>
import { IAuthor } from './author'
import { Schema } from 'mongoose';

interface IParticipant {
    userId: string;
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
    userId: string,
    color: string,
    size: number,
    timestamp: number
}

export interface IDrawing {
    title: string,
    theme: string,
    description?: string,
    participants: IParticipant[],
    maxParticipants?: number,
    path: IPath[],
    currentTurn?: string,
    createdAt: Date,
    updatedAt: Date,
    author: IAuthor,
    likes?: number,
    whoLiked: string[],
    isDone: boolean,
    isPublic: boolean
}
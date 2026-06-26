import type { IAuthor } from './author'
import type { ApiResponseWithData } from './api';

export interface IParticipant {
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

const isValidPoints = (obj : any) : obj is IPoints => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'x' in obj && typeof obj.x === 'number' &&
        'y' in obj && typeof obj.y === 'number'
    )
}

export interface IPath {
    points: IPoints[],
    userId: string,
    color?: string,
    size?: number,
    timestamp?: number
}

export const isValidPath = (obj: any): obj is IPath => {
    // Valide d'abord les propriétés simples
    const baseValid = (
        typeof obj === 'object' &&
        obj !== null &&
        'color' in obj && typeof obj.color === 'string' &&
        'size' in obj && typeof obj.size === 'number' && obj.size > 0 &&
        'points' in obj && Array.isArray(obj.points) && obj.points.length > 0
    );

    if (!baseValid) {
        return false;
    }
    
    const allPointsValid = obj.points.every((point: any) => isValidPoints(point));

    return allPointsValid;
};

interface formattedParticipants {
    userId: string,
    username: string
}

export interface IDrawing {
    _id: string,
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
    likes: number,
    whoLiked: string[],
    isDone: boolean,
    isPublic: boolean
    canModify?: boolean
    formattedParticipants?: formattedParticipants[]
}

export type DrawingResponse = ApiResponseWithData<IDrawing>;
export type DrawingsListResponse = ApiResponseWithData<IDrawing[]>

export interface IRedrawCanvasProps {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement;
  paths: IPath[];
}
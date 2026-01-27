import { Types } from 'mongoose'


interface IDrawing {
    drawingId: Types.ObjectId;
    date: Date;
}

export interface IUser {
    username: string;
    name: string;
    email: string;
    password: string;
    emoji?: string;
    admin?: boolean;
    drawings?: IDrawing[];
    createdAt?: Date;
    updatedAt?: Date;
}

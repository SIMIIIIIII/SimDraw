import { Types } from 'mongoose'


interface IDrawing {
    drawingId: Types.ObjectId;
    date: Date;
}

export interface IUser {
    _id?: Types.ObjectId
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

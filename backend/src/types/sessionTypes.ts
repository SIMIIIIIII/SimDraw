import { IDrawingDocument } from "@models/Drawing";
import { Types } from "mongoose";
import { IDrawing } from "./drawing";

export interface SessionData {
    user?: {
        id: Types.ObjectId;
        username: string;
        emoji: string;
        admin: boolean;
    };
}
  
export interface Req {
    isAuthenticated?: boolean;
    drawingId?: Types.ObjectId;
    drawing?: IDrawingDocument | IDrawing;
}
import { Types } from "mongoose";

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
}
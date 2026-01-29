import bcrypt from 'bcryptjs'
import { Document, Types } from 'mongoose';
import { IDrawing, IParticipant } from 'types/drawing';
import User from '@models/User';
import { IComment } from 'types/comment';

const saltRounds = 10;

export const hashPassword = async (password : string) : Promise<string> => {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (err) {
        console.error('Error hashing password:', err);
        throw err;
    }
}

export const formattedParticipants = async (drawing: (IDrawing & Document)) : Promise<void> => {
    const used : Types.ObjectId[] = [];
    drawing.formattedParticipants = [];

    for (let i = 0; i < drawing.participants.length; i++) {
        const userId = drawing.participants[i]?.userId;
        
        if (!used.includes(userId!)) {
            const user = await User.findById(userId);
            drawing.formattedParticipants.push({
                userId: userId!,
                username: user?.username || 'Inconnu.e',
            });
            used.push(userId!);
        }
    }
}

export const hasCommented = (comments : (IComment & Document)[], userId : Types.ObjectId) : void => {
    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        if (comment?.author.authorId === userId) {
            comment.hasPosted = true;
        }
    }
}


export const hasParticipated = (participants: IParticipant[], userId: Types.ObjectId) : boolean => {
    for (let index = 0; index < participants.length; index++) {
        if (participants[index]?.userId === userId) return true;
    }

    return false;
}
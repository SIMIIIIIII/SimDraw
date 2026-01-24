import mongoose, { Schema, Document } from 'mongoose';
import { IDrawing } from 'types/drawing';

const CommentSchema : Schema = new Schema({
    comment: {
        type: String,
        require: true,
        trim:true
    },

    postId: {
        type: String,
        require: true,
        trim: true
    },

    author: {
        type: {
            authorId: {
                type: String,
                require: true,
            },

            username: {
                type: String,
                require: true,
            },

            emoji: {
                type: String,
                default: '1f600',
            },
        },

        require: true,
    },

    createdAtd: {
        type: Date,
        default: Date.now(),
        require: true,
    },

    updatedAtd: {
        type: Date,
        default: Date.now(),
        require: true,
    },
})

interface ICommentDocument extends IDrawing, Document {}

export default mongoose.model<ICommentDocument>("Comment", CommentSchema);
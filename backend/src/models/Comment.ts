import mongoose, { Schema, Document, Types } from 'mongoose';
import { IComment } from '../types/comment';

const CommentSchema : Schema = new Schema({
    comment: {
        type: String,
        required: true,
        trim:true
    },

    postId: {
        type: Types.ObjectId,
        required: true,
    },

    author: {
        type: {
            authorId: {
                type: Types.ObjectId,
                required: true,
            },

            username: {
                type: String,
                required: true,
                minlength: 6,
                trim: true
            },

            emoji: {
                type: String,
                default: '1f600',
                trim: true
            },
        },

        required: true,
    },
}, {
    timestamps: true
}
)

interface ICommentDocument extends IComment, Document {}

export default mongoose.model<ICommentDocument>("Comment", CommentSchema);
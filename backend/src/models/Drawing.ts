import mongoose, { Schema, Document, Types } from 'mongoose'
import { IDrawing } from '../types/drawing'


const DrawingSchema : Schema = new Schema ({
    title: {
        type: String,
        required: true,
        trim: true
    },

    theme: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: false,
        trim: true,
        default: ""
    },

    participants: {
        type: [{
            userId: {
                type: Types.ObjectId,
                required: true
            },
            joinedAt: {
                type: Date,
                default: Date.now(),
                required: true
            },    
            isActive: {
                type: Boolean,
                required: false,
                default: false,
            },  
            start: {
                type: Number,
                required: true
            },       
            end: {
                type: Number,
                required: true
            }
        },],
        required: false,
        default: [],
    },

    maxParticipants: {
        type: Number,
        default: 1,
        required: true,
    },

    path: {
        type: [
        {
            points: {
                type: [{ 
                    x: {
                        type: Number,
                        required: true
                    },
                    y: {
                        type: Number,
                        required: true
                    }
                }],
                required: true,
                validate: {
                    validator: (v: unknown[]) => v && v.length > 0,
                    message: 'Points ne peut pas être vide'
                }
            },
            userId: {
                type: Types.ObjectId,
                required: true
            },
            color: {
                type: String,
                default: '#000000'
            },

            size: {
                type: Number,
                default: 1
            },

            timestamp: {
                type: Number,
                default: Date.now()
            }
        },],
        required: false,
        default: [],
    },

    currentTurn: {
        type: Types.ObjectId,
        default: null,
        required: false,
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
                minlength: [6, "Nom d'utilisateur trop court (min 4 caractères)"],
                trim: true
            },

            emoji: {
                type: String,
                default: '1f600',
                trim: true,
            },
        },

        required: true,
    },

    likes: {
        type: Number,
        default: 0,
    },

    whoLiked: {
        type: [],
        default: [],
    },

    isDone: {
        type: Boolean,
        default: false,
    },

    isPublic: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

interface IDrawingDocument extends IDrawing, Document {}
export default mongoose.model<IDrawingDocument>('Drawing', DrawingSchema)


import mongoose, { Schema, Document, Types, Model } from 'mongoose'
import { IDrawing, IDrawingMethods } from '../types/drawing'


const DrawingSchema = new Schema<IDrawingDocument, IDrawingModel> ({
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

    formattedParticipants: {
        type: {
            userId: {
                type: Types.ObjectId,
                required: true
            },

            username: {
                type: String,
                required: true,
                minlength: [6, "Nom d'utilisateur trop court (min 4 caractères)"],
                trim: true
            }
        },
        required: false
    }
}, {
    timestamps: true
})

DrawingSchema.methods.hasLiked = function (userId: Types.ObjectId): boolean {
    return this.whoLiked.some((id: Types.ObjectId) => id.toString() === userId.toString());
};

DrawingSchema.methods.toggleLike = async function (userId: Types.ObjectId): Promise<number> {
    if (this.hasLiked(userId)) {
        this.whoLiked = this.whoLiked.filter((id: Types.ObjectId) => id.toString() !== userId.toString());
        this.likes = Math.max(0, this.likes - 1);
        await this.save();
        return -1;
    }
    
    this.whoLiked.push(userId);
    this.likes += 1;
    await this.save();
    return 1;
};


type FindPublicCompletedOptions = {
    author?: Types.ObjectId;
    theme?: string;
    isPublic?: boolean;
    isDone?: boolean
};

DrawingSchema.statics.findPublicCompleted = function (options: FindPublicCompletedOptions | null = {}) {
    const normalizedOptions = options ?? {};
    const filter: {
        isPublic: boolean;
        $or: object[];
        'author.authorId'?: Types.ObjectId;
        theme?: string;
        isDone?: boolean
    } = {
        isPublic: true,
        $or: [
            { isDone: true },
            {
                $expr: {
                    $gte: [
                        { $size: { $ifNull: ['$participants', []] } },
                        { $ifNull: ['$maxParticipants', 2] }
                    ]
                }
            }
        ]
    };

    if (normalizedOptions.author) filter['author.authorId'] = normalizedOptions.author;
    if (normalizedOptions.theme) filter.theme = normalizedOptions.theme;
    if (normalizedOptions.isPublic) filter.isPublic = normalizedOptions.isPublic
    if (normalizedOptions.isDone) filter.isDone = normalizedOptions.isDone

    return this.find(filter);
};

interface IDrawingModel extends Model<IDrawingDocument> {
    findPublicCompleted(options?: FindPublicCompletedOptions | null): Promise<IDrawingDocument[]>;
}

export interface IDrawingDocument extends IDrawing, IDrawingMethods, Document {}
export default mongoose.model<IDrawingDocument, IDrawingModel>('Drawing', DrawingSchema)
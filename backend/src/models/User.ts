import mongoose, { Schema, Document } from 'mongoose';

export interface IDrawing {
    drawingId: Schema.Types.ObjectId;
    date: Date;
}

export interface IUser extends Document {
    username: string;
    name: string;
    email: string;
    password: string;
    emoji: string;
    admin: boolean;
    drawings: IDrawing[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [4, "Nom d'utilisateur trop court (min 4 caractères)"]
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email invalide']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Mot de passe trop court (min 8 caractères)']
    },
    drawings: {
        type: [{
            drawingId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }],
        default: []
    },
    admin: {
        type: Boolean,
        default: false
    },
    emoji: {
        type: String,
        default: '1f600'
    }
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
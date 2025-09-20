import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../interface/IUser';

export type IUserDocument = IUser & Document;

const userSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
    },
    { timestamps: true }
);

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);

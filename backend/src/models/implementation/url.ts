import mongoose, { Document, Schema } from 'mongoose';
import { IUrl } from '../interface/IUrl';

export type IUrlDocument = IUrl & Document;

const urlSchema = new Schema<IUrlDocument>(
    {
        url: {
            type: String,
            required: true,
            trim: true,
        },
        shortCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },
        clicks: {
            type: Number,
            default: 0,
            min: 0,
        },
        expiresAt: {
            type: Date,
            index: { expireAfterSeconds: 0 },
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    { timestamps: true }    
);


export const UrlModel = mongoose.model<IUrlDocument>('Url', urlSchema);

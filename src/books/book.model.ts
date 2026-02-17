import mongoose, { Types } from 'mongoose';

export interface BookDocument {
    _id: Types.ObjectId;
    title: string;
    description: string;
    price: number;
    author: string;
    status: 'PUBLISHED' | 'SOLD';
    ownerId: Types.ObjectId;
    soldAt: Date | null;
    createdAt: Date;
    updateAt: Date;
}

const bookSchema = new mongoose.Schema<BookDocument>(
    {
        title: {
            type: String,
            required: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        author: {
            type: String,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['PUBLISHED', 'SOLD'],
            default: 'PUBLISHED',
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        soldAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export const BookModel = mongoose.model('Book', bookSchema, 'Books');

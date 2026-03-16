export type BookStatus = 'PUBLISHED' | 'SOLD';

export interface Book {
    id: string;
    title: string;
    description: string;
    price: number;
    author: string;
    status: BookStatus;
    ownerId: string;
    soldAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

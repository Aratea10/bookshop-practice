import { BookDocument, BookModel } from './book.model.js';
import { Pagination } from '../shared/types/pagination.js';

interface FindBooksQuery extends Pagination {
    search?: string;
    ownerId?: string;
    status?: 'PUBLISHED' | 'SOLD';
}

interface UpdateBookData {
    title?: string;
    description?: string;
    price?: number;
    author?: string;
}

export const bookRepository = {
    async create(data: {
        title: string;
        description: string;
        price: number;
        author: string;
        ownerId: string;
    }) {
        const book = new BookModel(data);
        return book.save();
    },

    async findMany({ page, limit, search, ownerId, status }: FindBooksQuery) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: Record<string, any> = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
            ];
        }

        if (ownerId) {
            query.ownerId = ownerId;
        }

        if (status) {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        return BookModel.find(query).skip(skip).limit(limit);
    },

    async findById(bookId: string) {
        return BookModel.findById(bookId);
    },

    async update(bookId: string, data: UpdateBookData) {
        return BookModel.findByIdAndUpdate(bookId, data, { new: true });
    },

    async delete(bookId: string) {
        return BookModel.findByIdAndDelete(bookId);
    },

    async findPublishedOlderThan(days: number) {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);

        return BookModel.find({
            status: 'PUBLISHED',
            createdAt: { $lte: dateLimit },
        });
    },
};

import { Book } from '../domain/book.entity.js';
import {
    BookRepositoryPort,
    CreateBookData,
    UpdateBookData,
    FindBooksQuery,
} from '../domain/book.repository.port.js';
import { BookDocument, BookModel } from './book.model.js';

function toBook(doc: BookDocument): Book {
    return {
        id: doc._id.toString(),
        title: doc.title,
        description: doc.description,
        price: doc.price,
        author: doc.author,
        status: doc.status,
        ownerId: doc.ownerId.toString(),
        soldAt: doc.soldAt,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
}

export class MongoBookRepository implements BookRepositoryPort {
    async create(data: CreateBookData): Promise<Book> {
        const book = new BookModel(data);
        const saved = await book.save();
        return toBook(saved);
    }

    async findById(bookId: string): Promise<Book | null> {
        const doc = await BookModel.findById(bookId);
        return doc ? toBook(doc) : null;
    }

    async findMany({ page, limit, search, ownerId, status }: FindBooksQuery): Promise<Book[]> {
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
        const docs = await BookModel.find(query).skip(skip).limit(limit);
        return docs.map(toBook);
    }

    async update(bookId: string, data: UpdateBookData): Promise<Book | null> {
        const doc = await BookModel.findByIdAndUpdate(bookId, data, { returnDocument: 'after' });
        return doc ? toBook(doc) : null;
    }

    async delete(bookId: string): Promise<void> {
        await BookModel.findByIdAndDelete(bookId);
    }

    async findPublishedOlderThan(days: number): Promise<Book[]> {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);

        const docs = await BookModel.find({
            status: 'PUBLISHED',
            createdAt: { $lte: dateLimit },
        });
        return docs.map(toBook);
    }
}

import { Book } from './book.entity.js';

export interface CreateBookData {
    title: string;
    description: string;
    price: number;
    author: string;
    ownerId: string;
}

export interface UpdateBookData {
    title?: string;
    description?: string;
    price?: number;
    author?: string;
    status?: 'PUBLISHED' | 'SOLD';
    soldAt?: Date | null;
}

export interface FindBooksQuery {
    page: number;
    limit: number;
    search?: string;
    ownerId?: string;
    status?: 'PUBLISHED' | 'SOLD';
}

export interface BookRepositoryPort {
    create(data: CreateBookData): Promise<Book>;
    findById(bookId: string): Promise<Book | null>;
    findMany(query: FindBooksQuery): Promise<Book[]>;
    update(bookId: string, data: UpdateBookData): Promise<Book | null>;
    delete(bookId: string): Promise<void>;
    findPublishedOlderThan(days: number): Promise<Book[]>;
}

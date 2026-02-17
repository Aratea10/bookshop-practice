import { bookRepository } from './book.repository.js';
import { userRepository } from '../users/user.repository.js';
import { emailService } from '../shared/services/email.service.js';
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
} from '../shared/errors/app-error.js';

export const bookService = {
    async createBook(data: {
        title: string;
        description: string;
        price: number;
        author: string;
        userId: string;
    }) {
        const book = await bookRepository.create({
            title: data.title,
            description: data.description,
            price: data.price,
            author: data.author,
            ownerId: data.userId,
        });

        return book;
    },

    async updateBook(
        bookId: string,
        userId: string,
        data: { title?: string; description?: string; price?: number; author?: string }
    ) {
        const book = await bookRepository.findById(bookId);

        if (!book) {
            throw new NotFoundError('Libro no encontrado');
        }

        if (book.ownerId.toString() !== userId) {
            throw new ForbiddenError('Solo el dueño del libro puede editarlo');
        }

        const updatedBook = await bookRepository.update(bookId, data);
        return updatedBook;
    },

    async buyBook(bookId: string, buyerId: string) {
        const book = await bookRepository.findById(bookId);

        if (!book) {
            throw new NotFoundError('Libro no encontrado');
        }

        if (book.status === 'SOLD') {
            throw new BadRequestError('Este libro ya ha sido vendido');
        }

        if (book.ownerId.toString() === buyerId) {
            throw new ForbiddenError('No puedes comprar tu propio libro');
        }

        const soldBook = await bookRepository.update(bookId, {
            status: 'SOLD',
            soldAt: new Date(),
        } as any);

        try {
            const seller = await userRepository.findById(book.ownerId.toString());

            if (seller) {
                await emailService.sendEmail(
                    seller.email,
                    'Tu libro ha sido vendido',
                    `¡Enhorabuena! Tu libro "${book.title}" ha sido comprado.`
                );
            }
        } catch {
            console.log(`No se pudo enviar el email de notificación para el libro "${book.title}"`)
        }

        return soldBook;
    },

    async getPublicBooks(page: number, limit: number, search?: string) {
        const books = await bookRepository.findMany({
            page,
            limit,
            search,
            status: 'PUBLISHED',
        });

        return books;
    },

    async getMyBooks(userId: string, page: number, limit: number) {
        const books = await bookRepository.findMany({
            page,
            limit,
            ownerId: userId,
        });

        return books;
    },
};

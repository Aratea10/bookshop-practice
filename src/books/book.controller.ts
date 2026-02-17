import { NextFunction, Request, Response } from 'express';
import { createBookSchema, updateBookSchema } from './book.validator.js';
import { bookService } from './book.service.js';
import { status } from 'http-status';
import { BadRequestError } from '../shared/errors/app-error.js';

export const createBookController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = createBookSchema.parse(req.body);
        const userId = req.user!.id;
        const book = await bookService.createBook({ ...data, userId });
        res.status(status.CREATED).json(book);
    } catch (error) {
        next(error);
    }
};

export const updateBookController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = updateBookSchema.parse(req.body);
        const userId = req.user!.id;
        const bookId = req.params.bookId as string;

        if (!bookId) {
            throw new BadRequestError('El id del libro es obligatorio');
        }

        const book = await bookService.updateBook(bookId, userId, data);
        res.status(status.OK).json(book);
    } catch (error) {
        next(error);
    }
};

export const deleteBookController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const bookId = req.params.bookId as string;

        if (!bookId) {
            throw new BadRequestError('El id del libro es obligatorio');
        }

        const result = await bookService.deleteBook(bookId, userId);
        res.status(status.OK).json(result);
    } catch (error) {
        next(error);
    }
};

export const buyBookController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const buyerId = req.user!.id;
        const bookId = req.params.bookId as string;

        if (!bookId) {
            throw new BadRequestError('El id del libro es obligatorio');
        }

        const book = await bookService.buyBook(bookId, buyerId);
        res.status(status.OK).json(book);
    } catch (error) {
        next(error);
    }
};

export const getPublicBooksController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string | undefined;
        const books = await bookService.getPublicBooks(page, limit, search);
        res.status(status.OK).json(books);
    } catch (error) {
        next(error);
    }
};

export const getMyBooksController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const books = await bookService.getMyBooks(userId, page, limit);
        res.status(status.OK).json(books);
    } catch (error) {
        next(error);
    }
};

import { NextFunction, Request, Response } from 'express';
import { createBookSchema, updateBookSchema } from './book.validator.js';
import { status } from 'http-status';
import { BadRequestError } from '../../shared/errors/app-error.js';
import { CreateBookUseCase } from '../application/create-book.use-case.js';
import { UpdateBookUseCase } from '../application/update-book.use-case.js';
import { DeleteBookUseCase } from '../application/delete-book.use-case.js';
import { BuyBookUseCase } from '../application/buy-book.use-case.js';
import { GetPublicBooksUseCase } from '../application/get-public-books.use-case.js';
import { GetMyBooksUseCase } from '../application/get-my-books.use-case.js';

export class BookController {
    constructor(
        private readonly createBookUseCase: CreateBookUseCase,
        private readonly updateBookUseCase: UpdateBookUseCase,
        private readonly deleteBookUseCase: DeleteBookUseCase,
        private readonly buyBookUseCase: BuyBookUseCase,
        private readonly getPublicBooksUseCase: GetPublicBooksUseCase,
        private readonly getMyBooksUseCase: GetMyBooksUseCase,
    ) { }

    createBook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = createBookSchema.parse(req.body);
            const userId = req.user!.id;
            const book = await this.createBookUseCase.execute({ ...data, ownerId: userId });
            res.status(status.CREATED).json(book);
        } catch (error) {
            next(error);
        }
    };

    updateBook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = updateBookSchema.parse(req.body);
            const userId = req.user!.id;
            const bookId = req.params.bookId as string;

            if (!bookId) {
                throw new BadRequestError('El id del libro es obligatorio');
            }

            const book = await this.updateBookUseCase.execute(bookId, userId, data);
            res.status(status.OK).json(book);
        } catch (error) {
            next(error);
        }
    };

    deleteBook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const bookId = req.params.bookId as string;

            if (!bookId) {
                throw new BadRequestError('El id del libro es obligatorio');
            }

            const result = await this.deleteBookUseCase.execute(bookId, userId);
            res.status(status.OK).json(result);
        } catch (error) {
            next(error);
        }
    };

    buyBook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const buyerId = req.user!.id;
            const bookId = req.params.bookId as string;

            if (!bookId) {
                throw new BadRequestError('El id del libro es obligatorio');
            }

            const book = await this.buyBookUseCase.execute(bookId, buyerId);
            res.status(status.OK).json(book);
        } catch (error) {
            next(error);
        }
    };

    getPublicBooks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string | undefined;
            const books = await this.getPublicBooksUseCase.execute(page, limit, search);
            res.status(status.OK).json(books);
        } catch (error) {
            next(error);
        }
    };

    getMyBooks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const books = await this.getMyBooksUseCase.execute(userId, page, limit);
            res.status(status.OK).json(books);
        } catch (error) {
            next(error);
        }
    };
}

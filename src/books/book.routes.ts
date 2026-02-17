import { Router } from 'express';
import {
    createBookController,
    updateBookController,
    buyBookController,
    getPublicBooksController,
    getMyBooksController,
} from './book.controller.js';
import { authMiddleware } from '../shared/middlewares/auth.middleware.js';

const bookRouter = Router();

bookRouter.get('/', getPublicBooksController);

bookRouter.post('/', [authMiddleware], createBookController);
bookRouter.put('/:bookId', [authMiddleware], updateBookController);
bookRouter.post('/:bookId/buy', [authMiddleware], buyBookController);

export default bookRouter;

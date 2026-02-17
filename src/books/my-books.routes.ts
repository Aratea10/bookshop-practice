import { Router } from 'express';
import { getMyBooksController } from './book.controller.js';
import { authMiddleware } from '../shared/middlewares/auth.middleware.js';

const myBooksRouter = Router();

myBooksRouter.get('/books', [authMiddleware], getMyBooksController);

export default myBooksRouter;

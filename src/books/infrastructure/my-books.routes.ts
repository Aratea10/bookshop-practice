import { Router } from 'express';
import { bookController } from './book.container.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';

const myBooksRouter = Router();

myBooksRouter.get('/books', [authMiddleware], bookController.getMyBooks);

export default myBooksRouter;

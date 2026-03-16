import { Router } from 'express';
import { bookController } from './book.container.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';

const bookRouter = Router();

bookRouter.get('/', bookController.getPublicBooks);

bookRouter.post('/', [authMiddleware], bookController.createBook);
bookRouter.put('/:bookId', [authMiddleware], bookController.updateBook);
bookRouter.delete('/:bookId', [authMiddleware], bookController.deleteBook);
bookRouter.post('/:bookId/buy', [authMiddleware], bookController.buyBook);

export default bookRouter;

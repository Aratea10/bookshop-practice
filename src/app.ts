import express from 'express';
import authRouter from './auth/auth.routes.js';
import bookRouter from './books/book.routes.js';
import { errorHandlerMiddleware } from './shared/errors/error-handler.middleware.js';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}

export const app = express();

app.use(express.json());

app.use('/authentication', authRouter);
app.use('/books', bookRouter);

app.use(errorHandlerMiddleware);

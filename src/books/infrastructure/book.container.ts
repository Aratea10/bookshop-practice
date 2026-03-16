import { MongoBookRepository } from './mongo-book.repository.js';
import { MongoUserRepository } from '../../users/infrastructure/mongo-user.repository.js';
import { MailtrapEmailAdapter } from '../../shared/infrastructure/mailtrap-email.adapter.js';
import { CreateBookUseCase } from '../application/create-book.use-case.js';
import { UpdateBookUseCase } from '../application/update-book.use-case.js';
import { DeleteBookUseCase } from '../application/delete-book.use-case.js';
import { BuyBookUseCase } from '../application/buy-book.use-case.js';
import { GetPublicBooksUseCase } from '../application/get-public-books.use-case.js';
import { GetMyBooksUseCase } from '../application/get-my-books.use-case.js';
import { BookController } from './book.controller.js';

// Adaptadores (infraestructura)
const bookRepository = new MongoBookRepository();
const userRepository = new MongoUserRepository();
const emailService = new MailtrapEmailAdapter();

// Casos de uso (aplicación)
const createBookUseCase = new CreateBookUseCase(bookRepository);
const updateBookUseCase = new UpdateBookUseCase(bookRepository);
const deleteBookUseCase = new DeleteBookUseCase(bookRepository);
const buyBookUseCase = new BuyBookUseCase(bookRepository, userRepository, emailService);
const getPublicBooksUseCase = new GetPublicBooksUseCase(bookRepository);
const getMyBooksUseCase = new GetMyBooksUseCase(bookRepository);

// Controller
export const bookController = new BookController(
    createBookUseCase,
    updateBookUseCase,
    deleteBookUseCase,
    buyBookUseCase,
    getPublicBooksUseCase,
    getMyBooksUseCase,
);

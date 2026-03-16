import { Book } from '../domain/book.entity.js';
import { BookRepositoryPort } from '../domain/book.repository.port.js';
import { UserRepositoryPort } from '../domain/user.repository.port.js';
import { EmailPort } from '../domain/email.port.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../shared/errors/app-error.js';

export class BuyBookUseCase {
    constructor(
        private readonly bookRepository: BookRepositoryPort,
        private readonly userRepository: UserRepositoryPort,
        private readonly emailService: EmailPort,
    ) { }

    async execute(bookId: string, buyerId: string): Promise<Book | null> {
        const book = await this.bookRepository.findById(bookId);

        if (!book) {
            throw new NotFoundError('Libro no encontrado');
        }

        if (book.status === 'SOLD') {
            throw new BadRequestError('Este libro ya ha sido vendido');
        }

        if (book.ownerId === buyerId) {
            throw new ForbiddenError('No puedes comprar tu propio libro');
        }

        const soldBook = await this.bookRepository.update(bookId, {
            status: 'SOLD',
            soldAt: new Date(),
        });

        try {
            const seller = await this.userRepository.findById(book.ownerId);

            if (seller) {
                await this.emailService.sendEmail(
                    seller.email,
                    'Tu libro ha sido vendido',
                    `¡Enhorabuena! Tu libro "${book.title}" ha sido comprado.`
                );
            }
        } catch {
            console.log(`No se pudo enviar el email de notificación para el libro "${book.title}"`);
        }

        return soldBook;
    }
}

import { Book } from '../domain/book.entity.js';
import { BookRepositoryPort } from '../domain/book.repository.port.js';
import { NotFoundError, ForbiddenError } from '../../shared/errors/app-error.js';

export class UpdateBookUseCase {
    constructor(private readonly bookRepository: BookRepositoryPort) { }

    async execute(
        bookId: string,
        userId: string,
        data: { title?: string; description?: string; price?: number; author?: string }
    ): Promise<Book | null> {
        const book = await this.bookRepository.findById(bookId);

        if (!book) {
            throw new NotFoundError('Libro no encontrado');
        }

        if (book.ownerId !== userId) {
            throw new ForbiddenError('Solo el dueño del libro puede editarlo');
        }

        return this.bookRepository.update(bookId, data);
    }
}

import { BookRepositoryPort } from '../domain/book.repository.port.js';
import { NotFoundError, ForbiddenError } from '../../shared/errors/app-error.js';

export class DeleteBookUseCase {
    constructor(private readonly bookRepository: BookRepositoryPort) { }

    async execute(bookId: string, userId: string): Promise<{ message: string }> {
        const book = await this.bookRepository.findById(bookId);

        if (!book) {
            throw new NotFoundError('Libro no encontrado');
        }

        if (book.ownerId !== userId) {
            throw new ForbiddenError('Solo el dueño del libro puede eliminarlo');
        }

        await this.bookRepository.delete(bookId);

        return { message: 'Libro eliminado correctamente' };
    }
}

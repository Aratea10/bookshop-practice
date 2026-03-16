import { Book } from '../domain/book.entity.js';
import { BookRepositoryPort } from '../domain/book.repository.port.js';

export class GetPublicBooksUseCase {
    constructor(private readonly bookRepository: BookRepositoryPort) { }

    async execute(page: number, limit: number, search?: string): Promise<Book[]> {
        return this.bookRepository.findMany({
            page,
            limit,
            search,
            status: 'PUBLISHED',
        });
    }
}

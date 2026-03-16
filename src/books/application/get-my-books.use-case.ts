import { Book } from '../domain/book.entity.js';
import { BookRepositoryPort } from '../domain/book.repository.port.js';

export class GetMyBooksUseCase {
    constructor(private readonly bookRepository: BookRepositoryPort) { }

    async execute(userId: string, page: number, limit: number): Promise<Book[]> {
        return this.bookRepository.findMany({
            page,
            limit,
            ownerId: userId,
        });
    }
}

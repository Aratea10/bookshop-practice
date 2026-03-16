import { Book } from '../domain/book.entity.js';
import { BookRepositoryPort, CreateBookData } from '../domain/book.repository.port.js';

export class CreateBookUseCase {
    constructor(private readonly bookRepository: BookRepositoryPort) { }

    async execute(data: CreateBookData): Promise<Book> {
        return this.bookRepository.create(data);
    }
}

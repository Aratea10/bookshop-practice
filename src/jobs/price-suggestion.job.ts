import { MongoBookRepository } from '../books/infrastructure/mongo-book.repository.js';
import { MongoUserRepository } from '../users/infrastructure/mongo-user.repository.js';
import { MailtrapEmailAdapter } from '../shared/infrastructure/mailtrap-email.adapter.js';

const bookRepository = new MongoBookRepository();
const userRepository = new MongoUserRepository();
const emailService = new MailtrapEmailAdapter();

export const runPriceSuggestionJob = async () => {
    console.log('Ejecutando tarea de sugerencia de bajada de precio...');

    const books = await bookRepository.findPublishedOlderThan(7);

    for (const book of books) {
        try {
            const seller = await userRepository.findById(book.ownerId.toString());

            if (seller) {
                await emailService.sendEmail(
                    seller.email,
                    'Sugerencia de bajada de precio',
                    `Hola, tu libro "${book.title}" lleva publicado más de 7 días. ¿Te gustaría bajar el precio para atraer más compradores?`
                );
            }
        } catch {
            console.log(`No se pudo enviar sugerencia para el libro "${book.title}"`);
        }
    }

    console.log(`Sugerencia enviada para ${books.length} libro(s) ✅`);
};

import { bookRepository } from '../books/book.repository.js';
import { userRepository } from '../users/user.repository.js';
import { emailService } from '../shared/services/email.service.js';

export const runPriceSuggestionJob = async () => {
    console.log('Ejecutando tarea de sugerencia de bajada de precio...');

    const books = await bookRepository.findPublishedOlderThan(7);

    for (const book of books) {
        const seller = await userRepository.findById(book.ownerId.toString());

        if (seller) {
            await emailService.sendEmail(
                seller.email,
                'Sugerencia de bajada de precio',
                `Hola, tu libro "${book.title}" lleva publicado más de 7 días. ¿Te gustaría bajar el precio para atraer más compradores?`
            );
        }
    }

    console.log(`Sugerencia enviada para ${books.length} libro(s) ✅`);
};

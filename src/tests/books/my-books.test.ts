import request from 'supertest';
import { app } from '../../app.js';
import { createUser, createBook } from '../helpers.js';

describe('GET /me/books', () => {
    it('debería devolver los libros del usuario autenticado', async () => {
        const { token, userId } = await createUser();

        await createBook(token, { title: 'Mi Libro 1' });
        await createBook(token, { title: 'Mi Libro 2' });

        const otherUser = await createUser();
        await createBook(otherUser.token, { title: 'Libro de Otro' });

        const response = await request(app)
            .get('/me/books')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        response.body.forEach((book: { ownerId: string }) => {
            expect(book.ownerId).toBe(userId);
        });
    });

    it('debería devolver 401 si no hay token', async () => {
        const response = await request(app).get('/me/books');
        expect(response.status).toBe(401);
    });
});

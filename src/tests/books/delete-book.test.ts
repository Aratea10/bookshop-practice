import request from 'supertest';
import { app } from '../../app.js';
import { createUser, createBook } from '../helpers.js';

describe('DELETE /books/:bookId', () => {
    it('debería eliminar un libro correctamente', async () => {
        const { token } = await createUser();

        const createResponse = await createBook(token);
        const bookId = createResponse.body._id;

        const response = await request(app)
            .delete(`/books/${bookId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Libro eliminado correctamente');

        const booksResponse = await request(app).get('/books');
        expect(booksResponse.body).toHaveLength(0);
    });

    it('no debería permitir eliminar un libro de otro usuario', async () => {
        const owner = await createUser();
        const otherUser = await createUser();

        const createResponse = await createBook(owner.token);
        const bookId = createResponse.body._id;

        const response = await request(app)
            .delete(`/books/${bookId}`)
            .set('Authorization', `Bearer ${otherUser.token}`);

        expect(response.status).toBe(403);
    });

    it('debería devolver 404 si el libro no existe', async () => {
        const { token } = await createUser();

        const response = await request(app)
            .delete('/books/000000000000000000000000')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
    });

    it('debería devolver 401 si no hay token', async () => {
        const { token } = await createUser();

        const createResponse = await createBook(token);
        const bookId = createResponse.body._id;

        const response = await request(app).delete(`/books/${bookId}`);

        expect(response.status).toBe(401);
    });
});

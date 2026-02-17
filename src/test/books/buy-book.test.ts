import request from 'supertest';
import { app } from '../../app.js';
import { createUser, createBook } from '../helpers.js';

describe('POST /books/:bookId/buy', () => {
    it('debería comprar un libro correctamente', async () => {
        const seller = await createUser();
        const buyer = await createUser();

        const createResponse = await createBook(seller.token);
        const bookId = createResponse.body._id;

        const response = await request(app)
            .post(`/books/${bookId}/buy`)
            .set('Authorization', `Bearer ${buyer.token}`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('SOLD');
        expect(response.body.soldAt).toBeDefined();
    });

    it('no debería permitir comprar tu propio libro', async () => {
        const seller = await createUser();

        const createResponse = await createBook(seller.token);
        const bookId = createResponse.body._id;

        const response = await request(app)
            .post(`/books/${bookId}/buy`)
            .set('Authorization', `Bearer ${seller.token}`);

        expect(response.status).toBe(403);
    });

    it('no debería permitir comprar un libro ya vendido', async () => {
        const seller = await createUser();
        const buyer1 = await createUser();
        const buyer2 = await createUser();

        const createResponse = await createBook(seller.token);
        const bookId = createResponse.body._id;

        await request(app)
            .post(`/books/${bookId}/buy`)
            .set('Authorization', `Bearer ${buyer1.token}`);

        const response = await request(app)
            .post(`/books/${bookId}/buy`)
            .set('Authorization', `Bearer ${buyer2.token}`);

        expect(response.status).toBe(400);
    });

    it('debería devolver 404 si el libro no existe', async () => {
        const buyer = await createUser();

        const response = await request(app)
            .post('/books/000000000000000000000000/buy')
            .set('Authorization', `Bearer ${buyer.token}`);

        expect(response.status).toBe(404);
    });

    it('un libro vendido no debería aparecer en GET /books', async () => {
        const seller = await createUser();
        const buyer = await createUser();

        const createResponse = await createBook(seller.token);
        const bookId = createResponse.body._id;

        await request(app)
            .post(`/books/${bookId}/buy`)
            .set('Authorization', `Bearer ${buyer.token}`);

        const response = await request(app).get('/books');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(0);
    });
});

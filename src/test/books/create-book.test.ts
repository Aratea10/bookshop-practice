import request from 'supertest';
import { app } from '../../app.js';
import { createUser, createBook } from '../helpers.js';

describe('POST /books', () => {
    it('debería crear un libro correctamente', async () => {
        const { token } = await createUser();

        const response = await createBook(token);

        expect(response.status).toBe(201);
        expect(response.body.title).toBeDefined();
        expect(response.body.description).toBeDefined();
        expect(response.body.price).toBeDefined();
        expect(response.body.author).toBeDefined();
        expect(response.body.status).toBe('PUBLISHED');
        expect(response.body.soldAt).toBeNull();
    });

    it('debería devolver 401 si no se envía token', async () => {
        const response = await request(app).post('/books').send({
            title: 'Test',
            description: 'Test desc',
            price: 10,
            author: 'Test Author',
        });

        expect(response.status).toBe(401);
    });

    it('debería devolver 400 si faltan campos obligatorios', async () => {
        const { token } = await createUser();

        const response = await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Solo título' });

        expect(response.status).toBe(400);
    });
});

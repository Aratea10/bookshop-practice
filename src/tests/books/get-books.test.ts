import request from 'supertest';
import { app } from '../../app.js';
import { createUser, createBook } from '../helpers.js';

describe('GET /books', () => {
    it('debería devolver una lista vacía si no hay libros', async () => {
        const response = await request(app).get('/books');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('debería devolver solo libros con estado PUBLISHED', async () => {
        const { token } = await createUser();

        // Crear 2 libros
        await createBook(token);
        await createBook(token);

        const response = await request(app).get('/books');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        response.body.forEach((book: { status: string }) => {
            expect(book.status).toBe('PUBLISHED');
        });
    });

    it('debería buscar libros por título', async () => {
        const { token } = await createUser();

        await createBook(token, { title: 'El Quijote' });
        await createBook(token, { title: 'La Celestina' });

        const response = await request(app).get('/books?search=quijote');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].title).toBe('El Quijote');
    });

    it('debería buscar libros por autor', async () => {
        const { token } = await createUser();

        await createBook(token, { author: 'Cervantes' });
        await createBook(token, { author: 'Shakespeare' });

        const response = await request(app).get('/books?search=cervantes');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].author).toBe('Cervantes');
    });

    it('debería paginar los resultados', async () => {
        const { token } = await createUser();

        // Crear 5 libros
        for (let i = 0; i < 5; i++) {
            await createBook(token);
        }

        const response = await request(app).get('/books?page=1&limit=2');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    });
});

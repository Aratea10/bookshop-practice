import { app } from '../app.js';
import request from 'supertest';
import { faker } from '@faker-js/faker';

export const createUser = async () => {
    const email = faker.internet.email();
    const password = faker.internet.password({ length: 8 });

    const signupResponse = await request(app).post('/authentication/signup').send({ email, password });
    const userId = signupResponse.body.id;

    const signinResponse = await request(app)
        .post('/authentication/signin')
        .send({ email, password });

    const token = signinResponse.body.token as string;

    return { email, password, token, userId };
};

export const createBook = async (token: string, overrides = {}) => {
    const bookData = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 1, max: 100 })),
        author: faker.person.fullName(),
        ...overrides,
    };

    const response = await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send(bookData);

    return response;
};

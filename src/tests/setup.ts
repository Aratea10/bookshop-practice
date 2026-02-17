import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { envService } from '../config/env.js';

let mongo: MongoMemoryServer;
envService.load();

// 1 vez antes de todos los tests
beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
});

// Después de cada test, limpiamos todas las colecciones
afterEach(async () => {
    const collections = (await mongoose.connection.db?.collections()) ?? [];

    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

// 1 vez después de todos los tests
afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
});

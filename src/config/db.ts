import mongoose from 'mongoose';
import { envService } from './env.js';

export const connectDatabase = async () => {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST } = envService.get();

    console.log('Conectando a MongoDb...');
    await mongoose.connect(
        `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/bookshop?authSource=admin`
    );
    console.log('Conectado a MongoDB ✅');
};

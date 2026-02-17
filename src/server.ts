import { app } from './app.js';
import { envService } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { initSentry } from './config/sentry.js';
import cron from 'node-cron';
import { runPriceSuggestionJob } from './jobs/price-suggestion.job.js';

const startServer = async () => {
    try {
        console.log('Cargando entorno...');
        envService.load();
        console.log('Entorno cargado ✅');

        initSentry();

        await connectDatabase();

        const { API_PORT } = envService.get();
        app.listen(API_PORT, () => {
            console.log(`API arrancada en el puerto ${API_PORT} 🚀`);
        });

        cron.schedule('0 10 * * 1', () => {
            void runPriceSuggestionJob();
        });
        console.log('Tarea programada de sugerencia de precios activada ✅');
    } catch (error) {
        console.log('Error al arrancar la aplicación: ', error);
        process.exit(1);
    }
};

void startServer();

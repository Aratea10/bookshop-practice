import * as Sentry from '@sentry/node';
import { envService } from './env.js';

export const initSentry = () => {
    const { SENTRY_DSN, ENVIRONMENT } = envService.get();

    Sentry.init({
        dsn: SENTRY_DSN,
        environment: ENVIRONMENT,
    });
};

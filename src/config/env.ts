import dotenv from 'dotenv';
import * as z from 'zod';

const envSchema = z.object({
    ENVIRONMENT: z.enum(['local', 'staging', 'production']),
    API_PORT: z.string(),
    MONGO_USER: z.string(),
    MONGO_PASSWORD: z.string(),
    MONGO_HOST: z.string(),
    JWT_SECRET: z.string(),
    SENTRY_DSN: z.url(),
    MAILTRAP_TOKEN: z.string(),
});

type EnvVariables = z.infer<typeof envSchema>;

class EnvService {
    private variables: EnvVariables | null = null;

    load() {
        if (this.variables) {
            return;
        }
        
        const currentEnv = process.env.NODE_ENV ?? '';
        const envFile = this.getEnvFile(currentEnv);
        const result = dotenv.config({ path: envFile });

        if (result.error) {
            throw new Error(`Error leyendo el archivo de entorno: ${result.error.message}`);
        }
        try {
            this.variables = envSchema.parse(result.parsed);
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Error validando las variables de entorno: ${msg}`);
        }
    }
    
    get(): EnvVariables {
        if (!this.variables) {
            throw new Error('Entorno no cargado. Llama a load() primero.');
        }
        return this.variables;
    }

    private getEnvFile(env: string): string {
        switch (env) {
            case 'production':
                return '.env.production';
            case 'staging':
                return '.env.staging';
            default:
                return '.env';
        }
    }
}

export const envService = new EnvService();

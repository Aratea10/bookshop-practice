import * as z from 'zod';

export const authBodySchema = z.object({
    email: z.email('El email no es válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

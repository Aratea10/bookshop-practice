import * as z from 'zod';

export const createBookSchema = z.object({
    title: z.string().min(1, 'El título es obligatorio'),
    description: z.string().min(1, 'La descripción es obligatoria'),
    price: z.number().positive('El precio debe ser mayor que 0'),
    author: z.string().min(1, 'El autor es obligatorio'),
});

export const updateBookSchema = z.object({
    title: z.string().min(1, 'El título es obligatorio').optional(),
    description: z.string().min(1, 'La descripción es obligatoria').optional(),
    price: z.number().positive('El precio debe ser mayor que 0').optional(),
    author: z.string().min(1, 'El autor es obligatorio').optional(),
});

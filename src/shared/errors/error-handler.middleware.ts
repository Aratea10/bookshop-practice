import { NextFunction, Request, Response } from 'express';
import { AppError } from './app-error.js';
import * as zod from 'zod';
import * as Sentry from '@sentry/node';
import { status } from 'http-status';

export const errorHandlerMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
    }

    if (error instanceof zod.ZodError) {
        const errorMessage = zod.flattenError(error).fieldErrors;
        res.status(status.BAD_REQUEST).json({ message: errorMessage });
        return;
    }

    Sentry.captureException(error, {
        extra: {
            path: req.path,
            method: req.method,
            user: req.user?.id,
        },
    });

    res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'Error interno del servidor',
    });
};

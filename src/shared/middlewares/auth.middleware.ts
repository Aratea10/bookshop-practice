import { NextFunction, Request, Response } from 'express';
import { securityService } from '../services/security.service.js';
import { UnauthorizedError } from '../errors/app-error.js';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        throw new UnauthorizedError('No se ha proporcionado token en la cabecera Authorization');
    }

    const data = securityService.verifyToken(token);
    req.user = { id: data.userId };

    next();
};

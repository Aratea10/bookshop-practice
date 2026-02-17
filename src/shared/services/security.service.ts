import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { envService } from '../../config/env.js';
import { UnauthorizedError } from '../errors/app-error.js';

export const securityService = {
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    },

    async comparePasswords(incoming: string, stored: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(incoming, stored);
        if (!isMatch) {
            throw new UnauthorizedError('Email o contraseña incorrectos');
        }
        return isMatch;
    },

    generateToken(userId: string): string {
        const { JWT_SECRET } = envService.get();
        try {
            return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'jwt.sign error';
            throw new UnauthorizedError(`Error generando el JWT: ${msg}`);
        }
    },

    verifyToken(token: string): { userId: string } {
        const { JWT_SECRET } = envService.get();
        try {
            return jwt.verify(token, JWT_SECRET) as { userId: string };
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'jwt.verify error';
            throw new UnauthorizedError(`Error verificando el JWT: ${msg}`);
        }
    },
};

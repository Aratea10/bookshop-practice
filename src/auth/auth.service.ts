import { userRepository } from '../users/user.repository.js';
import { securityService } from '../shared/services/security.service.js';
import { ConflictError, UnauthorizedError } from '../shared/errors/app-error.js';

export const authService = {
    async signup(email: string, password: string) {
        const existingUser = await userRepository.findByEmail(email);

        if (existingUser) {
            throw new ConflictError('Ya existe un usuario con ese email');
        }

        const hashedPassword = await securityService.hashPassword(password);
        const user = await userRepository.create(email, hashedPassword);

        return {
            id: user._id.toString(),
            email: user.email,
            createdAt: user.createdAt,
        };
    },

    async signin(email: string, password: string) {
        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new UnauthorizedError('Email o contraseña incorrectos');
        }

        await securityService.comparePasswords(password, user.password);

        const token = securityService.generateToken(user._id.toString());

        return { token };
    },
};

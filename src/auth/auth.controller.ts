import { NextFunction, Request, Response } from 'express';
import { authBodySchema } from './auth.validator.js';
import { authService } from './auth.service.js';
import { status } from 'http-status';

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = authBodySchema.parse(req.body);
        const user = await authService.signup(email, password);
        res.status(status.CREATED).json(user);
    } catch (error) {
        next(error);
    }
};

export const signinController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = authBodySchema.parse(req.body);
        const result = await authService.signin(email, password);
        res.status(status.OK).json(result);
    } catch (error) {
        next(error);
    }
};

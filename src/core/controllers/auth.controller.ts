import { Request, Response, NextFunction } from 'express';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('Login Works!')
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('Register Works!')
}
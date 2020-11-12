import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { StatusCodeExplanation } from '../enums/statusCodeExplanation.enum';
import { IError } from '../interfaces/error.interface';
dotenv.config();

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let error: IError = { statusCode: 403, message: StatusCodeExplanation.FORBIDEN };
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        verify(token, (process.env.TOKEN_SECRET as string), (err, user) => {
            if (err) {
                return res.status(error.statusCode).json(error)
            }
            (req as any).user=user;
            next();
        });
    } else {
        error.statusCode = 401;
        error.message = StatusCodeExplanation.UNAUTHORIZED;
        return res.status(error.statusCode).json(error);
    }
};
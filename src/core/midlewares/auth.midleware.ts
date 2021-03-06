import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { StatusCodeExplanation } from '../enums/statusCodeExplanation.enum';
import { IError } from '../interfaces/error.interface';
import { Environment } from '../environment';
import { ReqExtended } from '../interfaces/requestExtended';
import { IUser } from '../interfaces/user.interface';

export const authenticateJWT = (req: ReqExtended, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let error: IError = { statusCode: 403, message: StatusCodeExplanation.FORBIDEN };
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        verify(token, (Environment.TOKEN_SECRET as string), (err, user) => {
            if (err) {
                return res.status(error.statusCode).json(error)
            }
            req.user = user as IUser;
            next();
        });
    } else {
        error.statusCode = 401;
        error.message = StatusCodeExplanation.UNAUTHORIZED;
        return res.status(error.statusCode).json(error);
    }
};
import { Request, Response, NextFunction } from 'express';
import { ReqExtended } from '../interfaces/requestExtended';
import { StatusCodeExplanation } from '../enums/statusCodeExplanation.enum';
import { IError } from '../interfaces/error.interface';
import { User } from '../models/mongoose/user.model';

export const me = async (req: ReqExtended, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ _id: req?.user?._id }).select({ password: 0 });
        if (!user) {
            const error: IError = { statusCode: 404, message: StatusCodeExplanation.NOT_FOUND, details: 'User not found' };
            return res.status(error.statusCode).json(error);
        }
        return res.status(200).json(user)
    } catch (e) {
        const error: IError = { statusCode: 500, message: StatusCodeExplanation.INTERNAL_SERVER_ERROR, details: e };
        return res.status(error.statusCode).json(e)
    }
}
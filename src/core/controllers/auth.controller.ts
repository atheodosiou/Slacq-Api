import e, { Request, Response, NextFunction } from 'express';
import { StatusCodeExplanation } from '../enums/statusCodeExplanation.enum';
import { IError } from '../interfaces/error.interface';
import { IUser } from '../interfaces/user.interface';
import { User } from '../models/mongoose/user.model';
import { JoiUserSchema } from '../models/validators/user.validator';
import { hash } from 'bcryptjs';

//Register
export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = JoiUserSchema.validate(req.body);
    if (error) {
        const validationError: IError = { statusCode: 400, message: StatusCodeExplanation.BAD_REQUEST, details: error.details.map(d => d.message) };
        return res.status(validationError.statusCode).json(validationError)
    }
    const userToRegister: IUser = new User(value);
    try {
        //Before save the user, hash the password
        const hasedPassword = await hash(userToRegister.password, 8);
        userToRegister.password = hasedPassword;
        const registeredUser = await userToRegister.save();
        return res.status(200).json(registeredUser);
    } catch (error) {
        let validationError: IError = { statusCode: 500, message: StatusCodeExplanation.INTERNAL_SERVER_ERROR, details: error };
        if (error && error.code === 11000) {
            validationError = { statusCode: 400, message: StatusCodeExplanation.BAD_REQUEST, details: 'Email already in use.' };
        }
        return res.status(validationError.statusCode).json(validationError)
    }

}

//Login
export const login = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('Login Works!')
}
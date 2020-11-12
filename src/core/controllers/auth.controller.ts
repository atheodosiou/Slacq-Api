import e, { Response, NextFunction } from 'express';
import { ReqExtended } from '../interfaces/requestExtended';
import { StatusCodeExplanation } from '../enums/statusCodeExplanation.enum';
import { IError } from '../interfaces/error.interface';
import { IUser } from '../interfaces/user.interface';
import { User } from '../models/mongoose/user.model';
import { JoiUserSchema } from '../models/validators/user.validator';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Environment } from '../environment';

//Register
export const register = async (req: ReqExtended, res: Response, next: NextFunction) => {
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
export const login = async (req: ReqExtended, res: Response, next: NextFunction) => {
    const { value, error } = JoiUserSchema.validate(req.body);
    if (error) {
        const validationError: IError = { statusCode: 400, message: StatusCodeExplanation.BAD_REQUEST, details: error.details.map(d => d.message) };
        return res.status(validationError.statusCode).json(validationError)
    }
    //Find the user
    const user = await User.findOne({ email: value.email })
    const commonError: IError = { statusCode: 401, message: StatusCodeExplanation.UNAUTHORIZED };
    if (!user) {
        return res.status(commonError.statusCode).json(commonError);
    }
    //Compere the passwords
    const isPasswordOk = await compare(value.password, user.password);
    if (!isPasswordOk) {
        return res.status(commonError.statusCode).json(commonError);
    }
    const userDetails = JSON.parse(JSON.stringify(user));
    delete userDetails.password;
    //Generate token
    const token = sign(userDetails, Environment.TOKEN_SECRET as string, { expiresIn: 3600 });

    res.setHeader('X-Access-Token', token);
    return res.status(200).json({ message: 'Logged in' });
}
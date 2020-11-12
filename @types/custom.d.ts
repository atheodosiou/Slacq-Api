import express = require('express');
import { IUser } from '../src/core/interfaces/user.interface';

declare global {

    namespace Express {

        export interface Request {
            user?: IUser
        }
    }
}

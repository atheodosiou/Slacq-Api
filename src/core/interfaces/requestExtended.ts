import { Request } from "express";
import { IUser } from "./user.interface";

export interface ReqExtended extends Request {
    user?: IUser
}
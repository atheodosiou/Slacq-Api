import { Document } from "mongoose";
import { IUser } from "./user.interface";

export interface IChannel extends Document {
    owner: string;
    name: string
    topic?: string
    users: IUser[];
    messages: any[];
    isPrivate: boolean;
}
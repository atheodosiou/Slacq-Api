import { Document } from "mongoose";
import { IChannel } from "./channel.interface";
import { IUser } from "./user.interface";

export interface IMessage extends Document {
    text?: string;
    attachment?: any;
    sendFrom: IUser;
    sendTo: IUser | IChannel;
    timeSend: Date;
    timeRead: Date;
}
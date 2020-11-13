import mongoose, { Schema } from 'mongoose';
import { IChannel } from '../../interfaces/channel.interface';
import { UserSchema } from './user.model';

export const MessageSchema: Schema = new Schema({
    text: { type: String, required: true },
    attachment: { type: String },
    sendFrom: { type: UserSchema, required: true },
    sendTo: { type: UserSchema },
    timeSend: { type: Date },
    timeRead: { type: Date }
}, {
    timestamps: true
});

export const Message = mongoose.model<IChannel>('Message', MessageSchema);
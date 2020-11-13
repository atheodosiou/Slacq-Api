import mongoose, { Schema } from 'mongoose';
import { IChannel } from '../../interfaces/channel.interface';
import { MessageSchema } from './message.model';
import { UserSchema } from './user.model';

export const ChannelSchema: Schema = new Schema({
    owner: { type: UserSchema, required: true },
    name: { type: String, required: true, unique: true },
    topic: { type: String, maxlength: 128 },
    users: { type: [UserSchema], maxlength: 50 },
    messages: { type: [MessageSchema] },
    isPrivate: { type: Boolean, required: true, default: false }
}, {
    timestamps: true
});

export const Channel = mongoose.model<IChannel>('Channel', ChannelSchema);
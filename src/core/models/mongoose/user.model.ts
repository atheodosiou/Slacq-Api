import mongoose, { Schema } from 'mongoose';
import { Role } from '../../enums/role.enum';
import { IUser } from '../../interfaces/user.interface';

export const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: [Role.ADMIN, Role.USER, Role.CHANNEL_ADMIN], default: Role.USER, required: true },
    displayName: { type: String },
    profilePhotoUrl: { type: String }
},{
    timestamps:true
});

export const User = mongoose.model<IUser>('User', UserSchema);
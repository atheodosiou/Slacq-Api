import { Role } from "../enums/role.enum";
import { Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    role: Role;
    displayName?: string,
    profilePhotoUrl?: string
}
import { Request, Response, NextFunction } from 'express';
import { ReqExtended } from '../interfaces/requestExtended';
import { StatusCodeExplanation } from '../enums/statusCodeExplanation.enum';
import { IError } from '../interfaces/error.interface';
import { User } from '../models/mongoose/user.model';
import { isValidObjectId } from 'mongoose';
import { Channel } from '../models/mongoose/channel.model';
import { IUser } from '../interfaces/user.interface';
import { Environment } from '../environment';
import { uploadFileMiddleware } from '../midlewares/upload.midleware';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

export const getAllUsers = async (req: ReqExtended, res: Response, next: NextFunction) => {
    try {
        const users = await User.find().select({ password: 0 });
        return res.status(200).json(users)
    } catch (e) {
        const error: IError = { statusCode: 500, message: StatusCodeExplanation.INTERNAL_SERVER_ERROR, details: e };
        return res.status(error.statusCode).json(e)
    }
}

export const me = async (req: ReqExtended, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ _id: req?.user?._id }).select({ password: 0 });
        if (!user) {
            const error: IError = { statusCode: 404, message: StatusCodeExplanation.NOT_FOUND, details: 'User not found' };
            return res.status(error.statusCode).json(error);
        }
        return res.status(200).json(user)
    } catch (e) {
        const error: IError = { statusCode: 500, message: StatusCodeExplanation.INTERNAL_SERVER_ERROR, details: e };
        return res.status(error.statusCode).json(e)
    }
}

export const joinChannel = async (req: ReqExtended, res: Response, next: NextFunction) => {
    const channelId = req.params.id;
    if (!isValidObjectId(channelId)) {
        let err: IError = { statusCode: 400, message: StatusCodeExplanation.BAD_REQUEST, details: `Id ${channelId} is not valid` };
        return res.status(err.statusCode).json(err);
    }

    try {
        const channelToJoin = await Channel.findOne({ _id: channelId });
        if (channelToJoin) {
            //chech if the user has already joind this channel
            const { users } = channelToJoin;
            const alreadyJoined = users.find(u => u.id === req.user?._id);

            if (alreadyJoined && alreadyJoined !== undefined) {
                const error: IError = { statusCode: 403, message: StatusCodeExplanation.FORBIDEN, details: 'You have already joid this channel!' };
                return res.status(error.statusCode).json(error);
            }

            if (channelToJoin.isPrivate) {
                const error: IError = { statusCode: 403, message: StatusCodeExplanation.FORBIDEN, details: 'This channel is private! Ask someone with admin privilages to add you.' };
                return res.status(error.statusCode).json(error);
            }

            channelToJoin.users.push(req.user as IUser);
            await channelToJoin.save();
            return res.status(200).json({ message: 'Join was successfull' });
        } else {
            const error: IError = { statusCode: 404, message: StatusCodeExplanation.NOT_FOUND, details: 'The requested channel was not found!' };
            return res.status(error.statusCode).json(error);
        }

    } catch (e) {
        const error: IError = { statusCode: 500, message: StatusCodeExplanation.INTERNAL_SERVER_ERROR, details: e };
        return res.status(error.statusCode).json(e)
    }
}

export const leaveChannel = async (req: ReqExtended, res: Response, next: NextFunction) => {
    const channelId = req.params.id;
    if (!isValidObjectId(channelId)) {
        let err: IError = { statusCode: 400, message: StatusCodeExplanation.BAD_REQUEST, details: `Id ${channelId} is not valid` };
        return res.status(err.statusCode).json(err);
    }

    try {
        const channelToLeave = await Channel.findOne({ _id: channelId });
        if (channelToLeave) {
            //chech if the user has already joind this channel
            const { users } = channelToLeave;
            const alreadyJoined = users.find(u => u.id === req.user?._id);

            if (!alreadyJoined || alreadyJoined === undefined) {
                const error: IError = { statusCode: 403, message: StatusCodeExplanation.FORBIDEN, details: 'You are not a member of this channel!' };
                return res.status(error.statusCode).json(error);
            }
            const indexOfUser = channelToLeave.users.indexOf(alreadyJoined);
            if (indexOfUser !== -1) {
                channelToLeave.users.splice(indexOfUser, 1);
            }
            await channelToLeave.save();
            return res.status(200).json({ message: 'You have left this channel successfully!' });
        } else {
            const error: IError = { statusCode: 404, message: StatusCodeExplanation.NOT_FOUND, details: 'The requested channel was not found!' };
            return res.status(error.statusCode).json(error);
        }

    } catch (e) {
        const error: IError = { statusCode: 500, message: StatusCodeExplanation.INTERNAL_SERVER_ERROR, details: e };
        return res.status(error.statusCode).json(e)
    }
}

export const uploadAvatar = async (req: ReqExtended, res: Response, next: NextFunction) => {
    try {
        //Find the users who is trying to upload avatar
        const user = await User.findOne({ _id: req?.user?._id }).select({ password: 0 });
        if (!user) {
            const error: IError = { statusCode: 404, message: StatusCodeExplanation.NOT_FOUND, details: 'User not found' };
            return res.status(error.statusCode).json(error);
        }

        //folder public/uploads/avatar must exits!
        if (fs.existsSync(Environment.avatarsPublicFolder) === false) {
            try {
                mkdirp.sync(Environment.avatarsPublicFolder);
            } catch (fsError) {
                return res.status(500).json(fsError);
            }
        }
        await uploadFileMiddleware(req, res);
        if (req.file == undefined) {
            const error: IError = { statusCode: 400, message: StatusCodeExplanation.BAD_REQUEST, details: 'Please upload a file!' };
            return res.status(error.statusCode).json(error);
        }
        const avatarPath = `${req.protocol}://${req.hostname}:${Environment.PORT}/uploads/avatars/${req.file.filename}`;
        user.profilePhotoUrl = avatarPath;
        await user.save();

        return res.status(201).json({
            file: req.file.originalname,
            path: avatarPath,
            size: req.file.size
        });
    } catch (err) {
        const error: IError = { statusCode: 500, message: StatusCodeExplanation.INTERNAL_SERVER_ERROR, details: `Could not upload the file! ${err}` };
        res.status(error.statusCode).json(error);
    }
}
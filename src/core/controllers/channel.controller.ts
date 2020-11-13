import { Response, NextFunction } from 'express';
import { ReqExtended } from '../interfaces/requestExtended';
import { StatusCodeExplanation } from '../enums/statusCodeExplanation.enum';
import { IError } from '../interfaces/error.interface';
import { Channel } from '../models/mongoose/channel.model';
import { JoiChannelSchema } from '../models/validators/channel.validator';
import { IChannel } from '../interfaces/channel.interface';
import { IUser } from '../interfaces/user.interface';
import { User } from '../models/mongoose/user.model';
export const getAllChannels = async (req: ReqExtended, res: Response, next: NextFunction) => {
    try {
        const channels = await Channel.find();
        res.status(200).json(channels);
    } catch (e) {
        const error: IError = { statusCode: 500, message: StatusCodeExplanation.INTERNAL_SERVER_ERROR, details: e };
        return res.status(error.statusCode).json(e)
    }
}

export const createChannel = async (req: ReqExtended, res: Response, next: NextFunction) => {
    const { value, error } = JoiChannelSchema.validate(req.body);
    if (error) {
        const validationError: IError = { statusCode: 400, message: StatusCodeExplanation.BAD_REQUEST, details: error.details.map(d => d.message) };
        return res.status(validationError.statusCode).json(validationError)
    }
    try {
        //Check if this user has already created a channel
        //with the same name
        const channelsIfAny = await Channel.find({ owner: req.user?._id, name: value.name });
        if (channelsIfAny && channelsIfAny.length > 0) {
            const alreadyExistsError: IError = { statusCode: 409, message: StatusCodeExplanation.CONFLICT, details: 'A channel with this name already exists' };
            return res.status(alreadyExistsError.statusCode).json(alreadyExistsError);
        }
        const channelToCreate: IChannel = new Channel(value);
        channelToCreate.owner = req.user?._id;
        const savedChannel = await channelToCreate.save();
        res.status(201).json(savedChannel);
    } catch (error) {
        let err: IError = { statusCode: 500, message: StatusCodeExplanation.INTERNAL_SERVER_ERROR, details: error?.message };
        return res.status(err.statusCode).json(err)
    }
}
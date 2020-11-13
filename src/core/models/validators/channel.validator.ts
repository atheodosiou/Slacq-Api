import * as Joi from '@hapi/joi';

export const JoiChannelSchema = Joi.object({
    owner: Joi.object().required(),
    name: Joi.string().max(50).required(),
    topic: Joi.string().max(128).optional(),
    users: Joi.array().max(50).optional(),
    messages: Joi.array().optional(),
    isPrivate: Joi.boolean().required()
});
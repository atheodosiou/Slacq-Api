import * as Joi from '@hapi/joi';

export const JoiMessageSchema = Joi.object({
    text: Joi.string().required(),
    attachment: Joi.object().optional(),
    sendFrom: Joi.object().required(),
    sendTo: Joi.object().optional(),
    timeSend: Joi.date().optional(),
    timeRead: Joi.date().optional()
});
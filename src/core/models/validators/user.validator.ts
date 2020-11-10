import * as Joi from '@hapi/joi';

export const JoiUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required(),
    role: Joi.string().optional(),
    displayName: Joi.string().optional(),
    profilePhotoUrl: Joi.string().optional()
});
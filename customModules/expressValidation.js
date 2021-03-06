import { Joi } from "express-validation";
// JOI DOCUMENTATION EXAMPLE
// const validationSchema = Joi.object({
//     username: Joi.string()
//         .alphanum()
//         .min(3)
//         .max(30)
//         .required(),
    
//     password: Joi.string()
//         .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    
//     confirm_password: Joi.ref('password'),

//     moodifyToken: [
//         Joi.string(),
//         Joi.number()
//     ]
// })
export const mongoIdValidation = {
    params: Joi.object({
        id: Joi.string()
            .required()
            .length(24)
    })
}

export const registerValidation = {
    body: Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        displayName: Joi.string()
            .min(3)
            .max(30)
            .required(),
        password: Joi.string()
            .pattern(/^\S+$/)
            .min(3)
            .max(30)
            .required(),
    })
}

export const loginValidation = {
    body: Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        password: Joi.string()
            .pattern(/^\S+$/)
            .min(3)
            .max(30)
            .required(),
    })
}

export const updateUserValidation = {
}

export const playlistValidation = {
    body: Joi.object({
        title: Joi.string()
            .min(3)
            .max(50)
            .required(),
        songs: Joi.array()
            .items(Joi.object())
            .min(1)
            .required(),
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        description: Joi.string()
            .allow('')
            .optional()
            .min(3)
            .max(80)
    })
}

export const patchPlaylistValidation = {
    body: Joi.object({
        title: Joi.string()
            .min(3)
            .max(50)
            .optional(),
        songs: Joi.array()
            .items(Joi.object())
            .min(1)
            .optional(),
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .optional(),
        description: Joi.string()
            .allow('')
            .optional()
            .min(3)
            .max(80)
    })
}
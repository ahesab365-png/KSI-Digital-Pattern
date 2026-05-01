import Joi from 'joi'

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'البريد الإلكتروني غير صالح',
        'string.empty': 'البريد الإلكتروني مطلوب',
        'any.required': 'البريد الإلكتروني مطلوب'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'كلمة المرور مطلوبة',
        'any.required': 'كلمة المرور مطلوبة'
    })
}).required()

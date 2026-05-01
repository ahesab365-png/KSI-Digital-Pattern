import { AppError } from "../utils/error.handler.js"

/**
 * Middleware to validate request data (body, params, query) using a Joi schema.
 */
export const validation = (schema) => {
    return (req, res, next) => {
        const inputData = { ...req.body, ...req.params, ...req.query }
        
        const { error } = schema.validate(inputData, { abortEarly: false })
        
        if (error) {
            const errorMessages = error.details.map(detail => detail.message)
            return next(new AppError(errorMessages.join(', '), 400))
        }
        
        next()
    }
}

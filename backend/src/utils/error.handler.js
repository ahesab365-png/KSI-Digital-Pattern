/**
 * Wraps an async express middleware/controller to catch errors and pass them to the global error handler.
 * This eliminates the need for repetitive try-catch blocks.
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            return next(new Error(error.message, { cause: { status: 500 } }))
        })
    }
}

/**
 * Custom Error class for operational errors
 */
export class AppError extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
        this.isOperational = true
    }
}

import sanitize from 'mongo-sanitize'

/**
 * Middleware to sanitize user input to prevent NoSQL injection attacks.
 */
export const sanitizeInput = (req, res, next) => {
    req.body = sanitize(req.body)
    req.params = sanitize(req.params)
    req.query = sanitize(req.query)
    next()
}

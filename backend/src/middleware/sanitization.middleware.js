import sanitize from 'mongo-sanitize'

/**
 * Middleware to sanitize user input to prevent NoSQL injection attacks.
 */
export const sanitizeInput = (req, res, next) => {
    if (req.method === 'OPTIONS') return next();

    if (req.body) req.body = sanitize(req.body)
    if (req.params) req.params = sanitize(req.params)
    if (req.query) {
        // In Express 5, req.query is often read-only or has a protected setter.
        // We sanitize the values but avoid reassigning the entire object if possible.
        const sanitized = sanitize(req.query);
        for (const key in sanitized) {
            req.query[key] = sanitized[key];
        }
    }
    next()
}

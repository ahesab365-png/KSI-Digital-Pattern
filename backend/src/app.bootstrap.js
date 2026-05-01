import { NODE_ENV } from '../config/config.service.js'
import { authRouter, userRouter, articleRouter, uploadRouter, categoryRouter } from './modules/index.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import { connectDB } from './DB/connection.db.js'
import { seedDefaultAdmin } from './utils/seeding.util.js'
import { sanitizeInput } from './middleware/sanitization.middleware.js'

async function bootstrap() {
    const app = express()
    
    // 0. Logging (Morgan)
    if (NODE_ENV === 'development') {
        app.use(morgan('dev'))
    } else {
        app.use(morgan('combined'))
    }

    // 1. Security Headers (Helmet)
    app.use(helmet())

    // 2. NoSQL Injection Sanitization
    app.use(sanitizeInput)

    // 3. Performance (Compression)

    app.use(compression())

    // 3. Connect to Database
    await connectDB()

    // 4. Seed Default Admin (Cleaned up)
    await seedDefaultAdmin()

    // 5. Rate Limiting (Prevents Brute-force/DoS)
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: { message: "Too many requests from this IP, please try again later." },
        standardHeaders: true,
        legacyHeaders: false,
    })
    app.use('/auth', limiter) // Apply mostly to auth routes

    // 6. Middlewares
    const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : '*'
    app.use(cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }))
    
    // Increased limit to handle images, but keeping it safer
    app.use(express.json({ limit: '10mb' }))
    app.use(express.urlencoded({ limit: '10mb', extended: true }))
    
    // Application routing
    app.get('/', (req, res) => res.send('Welcome to KSI Digital Pattern API'))
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/articles', articleRouter)
    app.use('/upload', uploadRouter)
    app.use('/categories', categoryRouter)

    // Invalid routing
    app.use((req, res) => {
        return res.status(404).json({ message: "Invalid application routing" })
    })

    // 7. Global Error-handling (Robust & Secure)
    app.use((error, req, res, next) => {
        const status = error.cause?.status ?? error.status ?? 500
        const message = status === 500 ? 'Internal Server Error' : error.message
        
        console.error(`[Error] ${req.method} ${req.url}:`, error)

        return res.status(status).json({
            success: false,
            message,
            stack: NODE_ENV === "development" ? error.stack : undefined
        })
    })
    
    return app;
}
export default bootstrap
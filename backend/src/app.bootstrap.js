import { NODE_ENV, port } from '../config/config.service.js'
import { authRouter, userRouter, articleRouter } from './modules/index.js'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import { connectDB } from './DB/connection.db.js'
import { UserModel } from './DB/model/user.model.js'

async function bootstrap() {
    const app = express()
    
    // Connect to Database
    await connectDB()

    // Seed Default Admin
    const adminExists = await UserModel.findOne({ role: 'superadmin' })
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('password123', 8)
        await UserModel.create({
            email: 'admin@ksi.com',
            password: hashedPassword,
            role: 'superadmin'
        })
        console.log('Default Admin Created: admin@ksi.com / password123')
    }

    // Middlewares
    app.use(cors())
    
    // 🔥 Increased limit to handle high-res images in articles (Base64)
    app.use(express.json({ limit: '50mb' }))
    app.use(express.urlencoded({ limit: '50mb', extended: true }))
    
    // Application routing
    app.get('/', (req, res) => res.send('Welcome to KSI Digital Pattern API'))
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/articles', articleRouter)

    // Invalid routing
    app.use((req, res) => {
        return res.status(404).json({ message: "Invalid application routing" })
    })

    // Error-handling
    app.use((error, req, res, next) => {
        const status = error.cause?.status ?? 500
        return res.status(status).json({
            error_message: status == 500 ? 'something went wrong' : error.message ?? 'something went wrong',
            stack: NODE_ENV == "development" ? error.stack : undefined
        })
    })
    
    app.listen(port, () => console.log(`Server is running on port ${port}!`))
}
export default bootstrap
import mongoose from 'mongoose'
import { DB_URI } from '../../config/config.service.js'

export const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI)
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
}

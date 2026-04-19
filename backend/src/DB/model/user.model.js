import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['admin', 'superadmin'], 
        default: 'admin' 
    }
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);
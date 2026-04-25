import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    program: { type: String, required: true }, // '1' for Gerber, '2' for Gemini
    mainCategory: { type: String, required: true }, // 'women', 'men', 'kids'
    category: { type: String }, // e.g., 'T-shirt', 'Shirt'
    status: { 
        type: String, 
        enum: ['active', 'draft', 'paused'], 
        default: 'active' 
    },
    isPublic: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    blocks: [{
        type: { 
            type: String, 
            enum: ['title', 'steps', 'video', 'extra'],
            required: true 
        },
        title: { type: String },
        content: { type: String },
        videoUrl: { type: String },
        steps: [{
            title: { type: String },
            text: { type: String },
            image: { type: String }
        }]
    }]
}, { timestamps: true });

export const ArticleModel = mongoose.model('Article', articleSchema);

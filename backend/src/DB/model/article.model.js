import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    program: { type: String, required: true }, // '1' for Gerber, '2' for Gemini
    mainCategory: { type: String, required: true }, // 'women', 'men', 'kids'
    category: { type: String }, // e.g., 'T-shirt', 'Shirt'
    isPublic: { type: Boolean, default: true },
    steps: [{
        id: { type: Number },
        title: { type: String },
        text: { type: String },
        image: { type: String } // Cloudinary URL
    }],
    extraSections: [{
        title: { type: String },
        content: { type: String }
    }]
}, { timestamps: true });

export const ArticleModel = mongoose.model('Article', articleSchema);

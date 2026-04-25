import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL
    mainCategory: { type: String, required: true }, // 'women', 'men', 'kids'
    program: { type: String, required: true }, // '1' for Gerber, '2' for Gemini
}, { timestamps: true });

// Ensure unique combination of name, mainCategory and program
categorySchema.index({ name: 1, mainCategory: 1, program: 1 }, { unique: true });

export const CategoryModel = mongoose.model('Category', categorySchema);

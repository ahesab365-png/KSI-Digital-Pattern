import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

export const fileUpload = (folderName = 'General') => {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            // Detect format from mimetype
            const ext = file.mimetype.split('/')[1]; // e.g. 'jpeg', 'png', 'webp'
            const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
            const format = allowedFormats.includes(ext) ? ext : 'jpg';
            return {
                folder: `KSI/${folderName}`,
                format,
                public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
            };
        },
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'), false);
        }
    };

    return multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit
};

// Wrapper to handle multer errors properly in Express
export const handleMulterError = (upload) => (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Multer error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: err.message || 'Upload error' });
        }
        next();
    });
};

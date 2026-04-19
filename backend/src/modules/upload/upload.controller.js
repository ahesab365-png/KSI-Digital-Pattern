export const uploadImage = async (req, res, next) => {
    try {
        console.log('📸 Upload request received');
        console.log('File:', req.file ? `✅ ${req.file.originalname}` : '❌ No file');
        console.log('User:', req.user ? `✅ ${req.user.email}` : '❌ No user');

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded. Make sure to send the field as 'image'" });
        }

        console.log('☁️ Cloudinary response:', {
            url: req.file.path,
            publicId: req.file.filename
        });

        return res.status(200).json({ 
            message: "Success", 
            imageUrl: req.file.path,      // Cloudinary URL
            publicId: req.file.filename   // Cloudinary public_id
        });
    } catch (error) {
        console.error('❌ Upload controller error:', error);
        return next(error);
    }
};

import cloudinary from '../../utils/cloudinary.js';

export const uploadImage = async (req, res, next) => {
    try {
        console.log('📸 Upload request received (Base64 Mode)');
        console.log('User:', req.user ? `✅ ${req.user.email}` : '❌ No user');

        const { image, fileName } = req.body;

        if (!image) {
            return res.status(400).json({ message: "No image provided. Please send a Base64 string." });
        }

        // Upload directly to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: 'KSI/articles',
            public_id: `${Date.now()}-${fileName ? fileName.split('.')[0] : 'image'}`,
            resource_type: "auto"
        });

        console.log('☁️ Cloudinary response (Base64):', {
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id
        });

        return res.status(200).json({ 
            message: "Success", 
            imageUrl: uploadResponse.secure_url,
            publicId: uploadResponse.public_id
        });
    } catch (error) {
        console.error('❌ Upload controller error (Base64):', error);
        return res.status(500).json({ message: "فشل الرفع إلى الخادم السحابي", details: error.message });
    }
};

import { Router } from "express";
import * as uploadController from "./upload.controller.js";
import { fileUpload, handleMulterError } from "../../middlewares/multer.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

// Only authenticated admins should be able to upload images
router.post(
    "/image",
    auth,
    handleMulterError(fileUpload('articles').single('image')),
    uploadController.uploadImage
);

export default router;

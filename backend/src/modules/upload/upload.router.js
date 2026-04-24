import { Router } from "express";
import * as uploadController from "./upload.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

// Only authenticated admins should be able to upload images
router.post(
    "/image",
    auth,
    uploadController.uploadImage
);

export default router;

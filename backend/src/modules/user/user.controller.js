import { Router } from "express";
import { profile } from "./user.service.js";
const router = Router()

router.get("/", async (req, res, next) => {
    try {
        const result = await profile(req.query.id);
        return res.status(200).json({ message: "Profile", result });
    } catch (error) {
        return next(error);
    }
});

export default router;
import { Router } from "express";
import * as articleController from "./article.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", articleController.getArticles);
router.get("/:id", articleController.getArticleById);

// Admin Only Routes
router.post("/", auth, articleController.createArticle);
router.put("/:id", auth, articleController.updateArticle);
router.delete("/:id", auth, articleController.deleteArticle);

export default router;

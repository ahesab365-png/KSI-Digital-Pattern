import { Router } from "express";
import * as articleController from "./article.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", articleController.getArticles);
router.get("/:id", articleController.getArticleById);

// Admin Only Routes
router.post("/", auth, articleController.createArticle);
router.patch("/bulk-status", auth, articleController.bulkUpdateArticlesStatus);
router.delete("/bulk-delete", auth, articleController.bulkDeleteArticles);
router.put("/:id", auth, articleController.updateArticle);
router.delete("/:id", auth, articleController.deleteArticle);


router.post("/:id/view", articleController.incrementViews);
router.post("/:id/click", articleController.incrementClicks);

export default router;

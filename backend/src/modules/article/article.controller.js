import { ArticleModel } from "../../DB/model/article.model.js";

export const getArticles = async (req, res, next) => {
    try {
        console.log("Fetching all articles...");
        const { program, mainCategory } = req.query;
        const filter = {};
        if (program) filter.program = program;
        if (mainCategory) filter.mainCategory = mainCategory;
        
        if (program || mainCategory) {
            filter.isPublic = true;
        }

        const articles = await ArticleModel.find(filter).sort({ createdAt: -1 });
        console.log(`Found ${articles.length} articles.`);
        return res.status(200).json({ message: "Success", articles });
    } catch (error) {
        console.error("GET Articles Error:", error);
        return next(error);
    }
};

export const getArticleById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const article = await ArticleModel.findById(id);
        if (!article) return res.status(404).json({ message: "Article not found" });
        return res.status(200).json({ message: "Success", article });
    } catch (error) {
        return next(error);
    }
};

export const createArticle = async (req, res, next) => {
    try {
        console.log("Attempting to create a new article...");
        const article = await ArticleModel.create(req.body);
        console.log("Article created successfully:", article._id);
        return res.status(201).json({ message: "Article created successfully", article });
    } catch (error) {
        console.error("POST Article Error:", error);
        return next(error);
    }
};

export const updateArticle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const article = await ArticleModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!article) return res.status(404).json({ message: "Article not found" });
        return res.status(200).json({ message: "Article updated successfully", article });
    } catch (error) {
        return next(error);
    }
};

export const deleteArticle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const article = await ArticleModel.findByIdAndDelete(id);
        if (!article) return res.status(404).json({ message: "Article not found" });
        return res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
        return next(error);
    }
};

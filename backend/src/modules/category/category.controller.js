import { CategoryModel } from '../../DB/model/index.js';

export const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        return res.status(200).json({ categories });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};

export const upsertCategory = async (req, res) => {
    try {
        const { name, image, mainCategory, program } = req.body;

        if (!name || !image || !mainCategory || !program) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const category = await CategoryModel.findOneAndUpdate(
            { name, mainCategory, program },
            { image },
            { new: true, upsert: true }
        );

        return res.status(200).json({ message: "Category saved successfully", category });
    } catch (error) {
        return res.status(500).json({ message: "Error saving category", error: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await CategoryModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting category", error: error.message });
    }
};

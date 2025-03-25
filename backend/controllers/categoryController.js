import Category from "../models/categoryModel.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { category, subcategory } = req.body;
    const newCategory = new Category({ category, subcategory });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Failed to add category" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, subcategory, navbar_active } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { category, subcategory, navbar_active, updated_at: Date.now() },
      { new: true }
    );

    res.json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    res.json({ success: false, error: "Failed to update category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.json({ success: false, error: "Failed to delete category" });
  }
};

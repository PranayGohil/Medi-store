import Category from "../models/categoryModel.js";

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCategory = async (req, res) => {
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

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, subcategory } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { category, subcategory },
      { new: true }
    );

    res.json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    res.json({ success: false, error: "Failed to update category" });
  }
};

export { addCategory, getAllCategories, updateCategory };

import Category from '../models/Category.js';
import { logActivity } from '../utils/helpers.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, description, icon, image, subCategories } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Cette catégorie existe déjà' });
    }

    const category = await Category.create({
      name,
      description,
      icon,
      image,
      subCategories
    });

    await logActivity('Category Created', req.user._id, `Category: ${name}`);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const { name, description, icon, image, subCategories, status } = req.body;

    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      category.description = description || category.description;
      category.icon = icon || category.icon;
      category.image = image || category.image;
      category.subCategories = subCategories || category.subCategories;
      category.status = status || category.status;

      const updatedCategory = await category.save();
      await logActivity('Category Updated', req.user._id, `Category: ${category.name}`);
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Catégorie introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      await Category.deleteOne({ _id: category._id });
      await logActivity('Category Deleted', req.user._id, `Category: ${category.name}`);
      res.json({ message: 'Catégorie supprimée' });
    } else {
      res.status(404).json({ message: 'Catégorie introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Category = require('../models/Category');
const Expense = require('../models/Expense');
const ResponseHandler = require('../utils/responseHandler');

exports.getCategories = async (req, res, next) => {
  try {
    // Get both default categories and user's custom categories
    const categories = await Category.find({
      $or: [
        { isDefault: true },
        { userId: req.userId }
      ]
    }).lean();

    // Optional: attach expense count/total amount per category
    // This can be done via aggregation if needed, or multiple queries.
    // For simplicity, we just aggregate the counts using Expense model.
    const expenses = await Expense.find({ userId: req.userId }).select('categoryId amount');
    
    const categoryStats = {};
    expenses.forEach(exp => {
      const catId = exp.categoryId.toString();
      if (!categoryStats[catId]) {
        categoryStats[catId] = { count: 0, total: 0 };
      }
      categoryStats[catId].count += 1;
      categoryStats[catId].total += exp.amount;
    });

    const categoriesWithStats = categories.map(cat => ({
      ...cat,
      expenseCount: categoryStats[cat._id.toString()]?.count || 0,
      totalAmount: categoryStats[cat._id.toString()]?.total || 0
    }));

    return ResponseHandler.success(res, { categories: categoriesWithStats });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, icon, color } = req.body;

    // Check if category with same name already exists for user or in default
    const existingCat = await Category.findOne({
      name: new RegExp(`^${name}$`, 'i'),
      $or: [{ userId: req.userId }, { isDefault: true }]
    });

    if (existingCat) {
      return ResponseHandler.error(res, 'Category with this name already exists', 409);
    }

    const category = await Category.create({
      name,
      icon,
      color,
      userId: req.userId,
      isDefault: false
    });

    return ResponseHandler.created(res, { category }, 'Category created successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return ResponseHandler.notFound(res, 'Category not found');
    }

    if (category.isDefault) {
      return ResponseHandler.badRequest(res, 'Cannot update default category');
    }

    if (category.userId.toString() !== req.userId) {
      return ResponseHandler.forbidden(res, 'Not authorized');
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return ResponseHandler.success(res, { category: updatedCategory }, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return ResponseHandler.notFound(res, 'Category not found');
    }

    if (category.isDefault) {
      return ResponseHandler.badRequest(res, 'Cannot delete default category');
    }

    if (category.userId.toString() !== req.userId) {
      return ResponseHandler.forbidden(res, 'Not authorized');
    }

    // Check if there are expenses linked to this category
    const expenseCount = await Expense.countDocuments({ categoryId: req.params.id });
    if (expenseCount > 0) {
      return ResponseHandler.badRequest(res, 'Cannot delete category with existing expenses');
    }

    await Category.findByIdAndDelete(req.params.id);

    return ResponseHandler.success(res, null, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

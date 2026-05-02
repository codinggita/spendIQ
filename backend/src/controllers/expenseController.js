const Expense = require('../models/Expense');
const Category = require('../models/Category');
const ResponseHandler = require('../utils/responseHandler');

exports.createExpense = async (req, res, next) => {
  try {
    const { amount, category, description, notes, merchant, date, type, paymentMethod } = req.body;

    // The frontend passes string "category", e.g., "Food & Dining". Find the categoryId.
    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      return ResponseHandler.badRequest(res, 'Invalid category name provided');
    }
    
    const categoryId = categoryDoc._id;
    const descToUse = description || notes || '';

    const expense = await Expense.create({
      userId: req.userId,
      amount,
      categoryId,
      description: descToUse,
      merchant,
      date,
      type,
      paymentMethod,
      source: 'manual'
    });

    const populatedExpense = await Expense.findById(expense._id).populate('categoryId', 'name icon color');

    // Format response
    const formattedExpense = populatedExpense.toObject();
    formattedExpense.category = formattedExpense.categoryId;
    delete formattedExpense.categoryId;

    return ResponseHandler.created(res, { expense: formattedExpense }, 'Expense added successfully');
  } catch (error) {
    next(error);
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    let { page = 1, limit = 20, startDate, endDate, categoryId, type, search, sortBy = 'date', sortOrder = 'desc' } = req.query;
    
    page = parseInt(page);
    limit = parseInt(limit);
    if (limit > 100) limit = 100;

    const query = { userId: req.userId };

    // Filters
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (categoryId) query.categoryId = categoryId;
    if (type) query.type = type;

    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { merchant: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [expenses, totalRecords] = await Promise.all([
      Expense.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('categoryId', 'name icon color')
        .lean(),
      Expense.countDocuments(query)
    ]);

    // Format expenses
    const formattedExpenses = expenses.map(exp => {
      const formatted = { ...exp, category: exp.categoryId };
      delete formatted.categoryId;
      return formatted;
    });

    // Summary statistics
    const summaryAggr = await Expense.aggregate([
      { $match: { ...query, userId: req.user._id } }, // using Mongoose ObjectId for aggregation
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    let totalExpenses = 0;
    let totalIncome = 0;
    let count = 0;

    summaryAggr.forEach(stat => {
      if (stat._id === 'expense') totalExpenses += stat.total;
      if (stat._id === 'income') totalIncome += stat.total;
      count += stat.count;
    });

    const totalPages = Math.ceil(totalRecords / limit);

    return ResponseHandler.success(res, {
      expenses: formattedExpenses,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages
      },
      summary: {
        totalExpenses,
        totalIncome,
        count
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.userId })
      .populate('categoryId', 'name icon color')
      .lean();

    if (!expense) {
      return ResponseHandler.notFound(res, 'Expense not found');
    }

    const formattedExpense = { ...expense, category: expense.categoryId };
    delete formattedExpense.categoryId;

    return ResponseHandler.success(res, { expense: formattedExpense });
  } catch (error) {
    next(error);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    let expense = await Expense.findOne({ _id: req.params.id, userId: req.userId });

    if (!expense) {
      return ResponseHandler.notFound(res, 'Expense not found');
    }

    // Verify new category if provided
    if (req.body.categoryId) {
      const category = await Category.findById(req.body.categoryId);
      if (!category) {
        return ResponseHandler.badRequest(res, 'Invalid category ID');
      }
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('categoryId', 'name icon color').lean();

    const formattedExpense = { ...expense, category: expense.categoryId };
    delete formattedExpense.categoryId;

    return ResponseHandler.success(res, { expense: formattedExpense }, 'Expense updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!expense) {
      return ResponseHandler.notFound(res, 'Expense not found');
    }

    return ResponseHandler.success(res, null, 'Expense deleted successfully');
  } catch (error) {
    next(error);
  }
};

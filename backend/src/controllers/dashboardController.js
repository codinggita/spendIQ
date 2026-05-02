const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const ResponseHandler = require('../utils/responseHandler');
const DateHelpers = require('../utils/dateHelpers');

exports.getSummary = async (req, res, next) => {
  try {
    const { period = 'thisMonth', startDate, endDate } = req.query;

    let start, end;
    if (period === 'custom' && startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else if (period === 'lastMonth') {
      const range = DateHelpers.getMonthRange(1);
      start = range.start;
      end = range.end;
    } else {
      // thisMonth default
      const range = DateHelpers.getMonthRange(0);
      start = range.start;
      end = range.end;
    }

    const query = {
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    };

    const expenses = await Expense.find(query).populate('categoryId', 'name icon color').lean();

    let totalExpenses = 0;
    let totalIncome = 0;
    let expenseCount = 0;
    const categoryTotals = {};

    const recentExpenses = expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(exp => {
        const formatted = { ...exp, category: exp.categoryId };
        delete formatted.categoryId;
        return formatted;
      });

    expenses.forEach(exp => {
      if (exp.type === 'expense') {
        totalExpenses += exp.amount;
        expenseCount++;

        const catId = exp.categoryId?._id?.toString() || 'unassigned';
        if (!categoryTotals[catId]) {
          categoryTotals[catId] = {
            category: exp.categoryId || { name: 'Unassigned' },
            totalAmount: 0,
            count: 0
          };
        }
        categoryTotals[catId].totalAmount += exp.amount;
        categoryTotals[catId].count++;
      } else if (exp.type === 'income') {
        totalIncome += exp.amount;
      }
    });

    const netBalance = totalIncome - totalExpenses;
    const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;

    const categoryBreakdown = Object.values(categoryTotals)
      .map(cat => ({
        ...cat,
        percentage: totalExpenses > 0 ? Number(((cat.totalAmount / totalExpenses) * 100).toFixed(1)) : 0
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);

    return ResponseHandler.success(res, {
      summary: {
        totalExpenses,
        totalIncome,
        netBalance,
        expenseCount,
        averageExpense,
        period: {
          label: period,
          startDate: DateHelpers.formatDate(start),
          endDate: DateHelpers.formatDate(end)
        }
      },
      categoryBreakdown,
      recentExpenses
    });
  } catch (error) {
    next(error);
  }
};

exports.getMonthlyTrend = async (req, res, next) => {
  try {
    const trend = [];
    
    // Get data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const range = DateHelpers.getMonthRange(i);
      const query = {
        userId: req.user._id,
        date: { $gte: range.start, $lte: range.end }
      };

      const expenses = await Expense.find(query).lean();

      let totalExpenses = 0;
      let totalIncome = 0;
      let expenseCount = 0;

      expenses.forEach(exp => {
        if (exp.type === 'expense') {
          totalExpenses += exp.amount;
          expenseCount++;
        } else if (exp.type === 'income') {
          totalIncome += exp.amount;
        }
      });

      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthStr = `${range.start.getFullYear()}-${String(range.start.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `${monthNames[range.start.getMonth()]} ${range.start.getFullYear()}`;

      trend.push({
        month: monthStr,
        monthLabel,
        totalExpenses,
        totalIncome,
        expenseCount
      });
    }

    return ResponseHandler.success(res, { trend });
  } catch (error) {
    next(error);
  }
};

exports.getBudgetStatus = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id }).populate('categoryId', 'name icon color').lean();
    const range = DateHelpers.getMonthRange(0); // Assuming this month for overall status
    
    let totalOverallBudget = 0;
    
    const budgetStatuses = await Promise.all(budgets.map(async (budget) => {
      // Find expenses for this budget
      const query = {
        userId: req.user._id,
        date: { $gte: range.start, $lte: range.end },
        type: 'expense'
      };
      
      if (budget.categoryId) {
        query.categoryId = budget.categoryId._id;
      } else {
        totalOverallBudget = budget.amount;
      }
      
      const expenses = await Expense.find(query).lean();
      const spentAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const remainingAmount = budget.amount - spentAmount;
      const percentage = (spentAmount / budget.amount) * 100;
      
      let status = 'safe';
      if (percentage > 100) status = 'exceeded';
      else if (percentage >= budget.alertThreshold) status = 'warning';

      return {
        id: budget._id,
        category: budget.categoryId,
        budgetAmount: budget.amount,
        spentAmount,
        remainingAmount,
        percentage: Number(percentage.toFixed(1)),
        status,
        period: budget.period,
        startDate: DateHelpers.formatDate(range.start),
        endDate: DateHelpers.formatDate(range.end)
      };
    }));

    // Calculate overall status
    const overallExpenses = await Expense.find({
      userId: req.user._id,
      date: { $gte: range.start, $lte: range.end },
      type: 'expense'
    }).lean();

    const totalSpent = overallExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const overallPercentage = totalOverallBudget > 0 ? (totalSpent / totalOverallBudget) * 100 : 0;

    return ResponseHandler.success(res, {
      budgets: budgetStatuses,
      overall: {
        totalBudget: totalOverallBudget,
        totalSpent,
        remaining: totalOverallBudget - totalSpent,
        percentage: Number(overallPercentage.toFixed(1))
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createOrUpdateBudget = async (req, res, next) => {
  try {
    const { categoryId, amount, period = 'monthly', alertThreshold = 80 } = req.body;
    const catIdQuery = categoryId || null;

    let budget = await Budget.findOne({ userId: req.user._id, categoryId: catIdQuery });

    if (budget) {
      budget = await Budget.findByIdAndUpdate(
        budget._id,
        { amount, period, alertThreshold },
        { new: true, runValidators: true }
      );
    } else {
      const range = DateHelpers.getMonthRange(0);
      budget = await Budget.create({
        userId: req.user._id,
        categoryId: catIdQuery,
        amount,
        period,
        alertThreshold,
        startDate: range.start
      });
    }

    return ResponseHandler.created(res, { budget }, 'Budget saved successfully');
  } catch (error) {
    next(error);
  }
};

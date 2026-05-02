const express = require('express');
const { body } = require('express-validator');
const { getSummary, getMonthlyTrend, getBudgetStatus, createOrUpdateBudget } = require('../controllers/dashboardController');
const { validate } = require('../middlewares/validateRequest');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

const budgetValidation = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('period').optional().isIn(['monthly', 'weekly']).withMessage('Invalid period'),
  body('categoryId').optional().custom((value) => {
    if (value && value !== 'null' && typeof value !== 'string') {
      throw new Error('Invalid category format');
    }
    return true;
  }),
  body('alertThreshold').optional().isInt({ min: 0, max: 100 }).withMessage('Alert threshold must be between 0 and 100')
];

router.get('/summary', getSummary);
router.get('/monthly-trend', getMonthlyTrend);
router.get('/budget-status', getBudgetStatus);
router.post('/budgets', budgetValidation, validate, createOrUpdateBudget);

module.exports = router;

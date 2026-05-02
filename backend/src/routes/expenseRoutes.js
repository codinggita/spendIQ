const express = require('express');
const { body } = require('express-validator');
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');
const { validate } = require('../middlewares/validateRequest');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

const createValidation = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('description').optional().isLength({ max: 200 }).withMessage('Description too long'),
  body('notes').optional().isLength({ max: 200 }).withMessage('Notes too long'),
  body('merchant').optional().isLength({ max: 100 }).withMessage('Merchant name too long'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('type').optional().isIn(['expense', 'income']).withMessage('Invalid type'),
  body('paymentMethod').optional().isIn(['cash', 'card', 'upi', 'other']).withMessage('Invalid payment method')
];

const updateValidation = [
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('description').optional().isLength({ max: 200 }).withMessage('Description too long'),
  body('notes').optional().isLength({ max: 200 }).withMessage('Notes too long'),
  body('merchant').optional().isLength({ max: 100 }).withMessage('Merchant name too long'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('type').optional().isIn(['expense', 'income']).withMessage('Invalid type'),
  body('paymentMethod').optional().isIn(['cash', 'card', 'upi', 'other']).withMessage('Invalid payment method')
];

router.post('/', createValidation, validate, createExpense);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.put('/:id', updateValidation, validate, updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;

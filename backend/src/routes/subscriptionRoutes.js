const express = require('express');
const { body } = require('express-validator');
const { getSubscriptions, createSubscription, deleteSubscription } = require('../controllers/subscriptionController');
const { validate } = require('../middlewares/validateRequest');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All subscription routes require authentication
router.use(authMiddleware);

const subscriptionValidation = [
  body('name').trim().notEmpty().withMessage('Subscription name is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('renewalDate').isISO8601().toDate().withMessage('Valid renewal date is required')
];

router.get('/', getSubscriptions);
router.post('/', subscriptionValidation, validate, createSubscription);
router.delete('/:id', deleteSubscription);

module.exports = router;

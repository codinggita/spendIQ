const express = require('express');
const { body } = require('express-validator');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { validate } = require('../middlewares/validateRequest');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

const createValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('icon').optional().trim(),
  body('color').optional().trim().matches(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i).withMessage('Color must be a valid hex code')
];

const updateValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('icon').optional().trim(),
  body('color').optional().trim().matches(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i).withMessage('Color must be a valid hex code')
];

router.get('/', getCategories);
router.post('/', createValidation, validate, createCategory);
router.put('/:id', updateValidation, validate, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;

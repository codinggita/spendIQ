const express = require('express');
const { body } = require('express-validator');
const { parseSms, bulkParseSms } = require('../controllers/smsController');
const { validate } = require('../middlewares/validateRequest');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

const parseValidation = [
  body('smsText').notEmpty().withMessage('SMS text is required'),
  body('autoSave').optional().isBoolean().withMessage('autoSave must be a boolean')
];

const bulkParseValidation = [
  body('smsList').isArray({ min: 1 }).withMessage('smsList must be a non-empty array'),
  body('smsList.*').isString().withMessage('Each SMS must be a string'),
  body('autoSave').optional().isBoolean().withMessage('autoSave must be a boolean')
];

router.post('/parse', parseValidation, validate, parseSms);
router.post('/bulk-parse', bulkParseValidation, validate, bulkParseSms);

module.exports = router;

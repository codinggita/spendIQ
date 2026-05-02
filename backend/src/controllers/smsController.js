const Expense = require('../models/Expense');
const smsParserService = require('../services/smsParserService');
const ResponseHandler = require('../utils/responseHandler');

exports.parseSms = async (req, res, next) => {
  try {
    const { smsText, autoSave = false } = req.body;

    const parsed = await smsParserService.parse(smsText, req.userId);

    if (!parsed || !parsed.amount) {
      return ResponseHandler.badRequest(res, 'Could not parse amount from SMS');
    }

    let expense = null;

    if (autoSave && parsed.suggestedCategory) {
      expense = await Expense.create({
        userId: req.userId,
        amount: parsed.amount,
        categoryId: parsed.suggestedCategory.id,
        description: `SMS: ${parsed.merchant}`,
        merchant: parsed.merchant,
        date: parsed.date,
        type: parsed.type,
        paymentMethod: 'other', // Or infer from sms
        source: 'sms',
        smsRaw: smsText
      });
      
      const populated = await Expense.findById(expense._id).populate('categoryId', 'name icon color').lean();
      expense = { ...populated, category: populated.categoryId };
      delete expense.categoryId;
    }

    return ResponseHandler.success(res, {
      parsed,
      expense,
      smsRaw: smsText
    }, 'SMS parsed successfully');
  } catch (error) {
    next(error);
  }
};

exports.bulkParseSms = async (req, res, next) => {
  try {
    const { smsList, autoSave = false } = req.body;

    const results = [];
    let successful = 0;
    let failed = 0;
    let totalAmount = 0;

    for (let i = 0; i < smsList.length; i++) {
      const smsText = smsList[i];
      try {
        const parsed = await smsParserService.parse(smsText, req.userId);
        
        if (!parsed || !parsed.amount) {
          failed++;
          results.push({
            index: i,
            success: false,
            error: 'Could not parse SMS format'
          });
          continue;
        }

        let expense = null;
        if (autoSave && parsed.suggestedCategory) {
          const expDoc = await Expense.create({
            userId: req.userId,
            amount: parsed.amount,
            categoryId: parsed.suggestedCategory.id,
            description: `SMS: ${parsed.merchant}`,
            merchant: parsed.merchant,
            date: parsed.date,
            type: parsed.type,
            paymentMethod: 'other',
            source: 'sms',
            smsRaw: smsText
          });
          expense = expDoc.toObject();
        }

        successful++;
        if (parsed.type === 'expense') {
          totalAmount += parsed.amount;
        }

        results.push({
          index: i,
          success: true,
          parsed,
          expense
        });
      } catch (err) {
        failed++;
        results.push({
          index: i,
          success: false,
          error: err.message
        });
      }
    }

    return ResponseHandler.success(res, {
      results,
      summary: {
        total: smsList.length,
        successful,
        failed,
        totalAmount
      }
    }, `Parsed ${smsList.length} SMS successfully`);
  } catch (error) {
    next(error);
  }
};

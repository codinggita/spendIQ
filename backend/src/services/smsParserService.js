const Category = require('../models/Category');

class SmsParserService {
  constructor() {
    this.categoryKeywords = {
      'Food & Dining': ['starbucks', 'cafe', 'restaurant', 'pizza', 'zomato', 'swiggy', 'kfc', 'mcdonalds'],
      'Transportation': ['uber', 'ola', 'fuel', 'petrol', 'irctc', 'flight', 'metro'],
      'Shopping': ['amazon', 'flipkart', 'mall', 'myntra', 'ajio', 'store', 'mart'],
      'Bills & Utilities': ['electricity', 'water', 'recharge', 'jio', 'airtel', 'bill', 'bescom']
    };
  }

  async parse(smsText, userId) {
    if (!smsText) return null;

    const lowerSms = smsText.toLowerCase();

    // Determine type
    let type = 'expense';
    if (lowerSms.includes('credited by') || lowerSms.includes('salary credited')) {
      type = 'income';
    } else if (lowerSms.includes('debited') || lowerSms.includes('paid') || lowerSms.includes('spent') || lowerSms.includes('used for')) {
      type = 'expense';
    }

    // Extract amount
    let amount = null;
    const amountRegex = /(?:rs\.?|inr|₹|amount:|amt:?)\s*([\d,]+(?:\.\d{1,2})?)/i;
    const amountMatch = smsText.match(amountRegex);
    if (amountMatch) {
      amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    // Extract Date (DD-MMM-YY or simple dates)
    let date = new Date();
    const dateRegex = /(\d{1,2}-[a-zA-Z]{3}-\d{2,4})|(\d{1,2}\/\d{1,2}\/\d{2,4})/;
    const dateMatch = smsText.match(dateRegex);
    if (dateMatch) {
      const parsedDate = new Date(dateMatch[0]);
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate;
      }
    }

    // Extract Merchant
    let merchant = 'Unknown';
    // Match text after "at ", "to ", "from "
    const merchantRegex = /(?:at|to|from)\s+([A-Z0-9\s\.\&\-]+?)(?:\s+on|\.|\svia|\sAvl)/i;
    const merchantMatch = smsText.match(merchantRegex);
    if (merchantMatch && merchantMatch[1]) {
      merchant = merchantMatch[1].trim();
    } else if (lowerSms.includes('amazon')) {
      merchant = 'AMAZON.IN';
    } else if (lowerSms.includes('uber')) {
      merchant = 'UBER';
    }

    // Extract Account Number
    let accountNumber = null;
    const accRegex = /(?:a\/c|account)\s+([X\d]+)/i;
    const accMatch = smsText.match(accRegex);
    if (accMatch) {
      accountNumber = accMatch[1];
    } else {
      // Credit card alternative
      const cardRegex = /(?:card)\s+([X\d]+)/i;
      const cardMatch = smsText.match(cardRegex);
      if (cardMatch) {
        accountNumber = cardMatch[1];
      }
    }

    // Extract balance
    let balance = null;
    const balRegex = /(?:avl bal|avl limit|balance).*?(?:rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/i;
    const balMatch = smsText.match(balRegex);
    if (balMatch) {
      balance = parseFloat(balMatch[1].replace(/,/g, ''));
    }

    // Suggest Category
    let suggestedCategoryName = 'Other';
    let confidence = 0.5;

    for (const [catName, keywords] of Object.entries(this.categoryKeywords)) {
      if (keywords.some(kw => lowerSms.includes(kw))) {
        suggestedCategoryName = catName;
        confidence = 0.85;
        break;
      }
    }

    // Find category in DB
    const category = await Category.findOne({
      name: suggestedCategoryName,
      $or: [{ userId: userId }, { isDefault: true }]
    }).lean();

    return {
      amount,
      merchant,
      date: date.toISOString().split('T')[0],
      type,
      accountNumber,
      balance,
      suggestedCategory: category ? {
        id: category._id,
        name: category.name,
        confidence
      } : null
    };
  }
}

module.exports = new SmsParserService();

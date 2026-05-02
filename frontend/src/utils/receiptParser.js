/**
 * receiptParser.js
 * Utility to extract structured data from raw OCR text of a receipt.
 * Kept separate from OCR logic (Tesseract) and UI concerns.
 */

// ─── Amount Extraction ──────────────────────────────────────────────────────
// Matches patterns like: TOTAL: 450, Total 450.00, ₹450, $450, Amount: 1,200.50
const AMOUNT_PATTERNS = [
  /(?:total|amount|grand\s*total|net\s*total|payable|to\s*pay|balance\s*due)[:\s]*[₹$]?\s*([\d,]+(?:\.\d{1,2})?)/i,
  /[₹$]\s*([\d,]+(?:\.\d{1,2})?)/,
  /\b([\d,]{3,}(?:\.\d{1,2})?)\b/,
];

export function extractAmount(text) {
  for (const pattern of AMOUNT_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      // Remove commas and parse
      const value = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(value) && value > 0 && value < 1000000) {
        return value;
      }
    }
  }
  return null;
}

// ─── Merchant Extraction ─────────────────────────────────────────────────────
// Known brands + fallback to first significant line
const KNOWN_MERCHANTS = {
  swiggy: 'Swiggy',
  zomato: 'Zomato',
  amazon: 'Amazon',
  flipkart: 'Flipkart',
  uber: 'Uber',
  ola: 'Ola',
  starbucks: 'Starbucks',
  dominos: "Domino's",
  'domino': "Domino's",
  mcdonalds: "McDonald's",
  kfc: 'KFC',
  pizza: 'Pizza Hut',
  walmart: 'Walmart',
  bigbasket: 'BigBasket',
  blinkit: 'Blinkit',
  dunzo: 'Dunzo',
  paytm: 'Paytm',
  razorpay: 'Razorpay',
  reliance: 'Reliance Fresh',
  dmart: 'D-Mart',
  myntra: 'Myntra',
  ajio: 'AJIO',
};

export function extractMerchant(text) {
  const lower = text.toLowerCase();
  for (const [key, value] of Object.entries(KNOWN_MERCHANTS)) {
    if (lower.includes(key)) return value;
  }

  // Fallback: first non-empty line that isn't a number or date
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 2 && !/^\d/.test(l));

  if (lines.length > 0) {
    // Return the first line up to 40 chars, title-cased
    return lines[0].substring(0, 40).replace(/\w\S*/g, (w) =>
      w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    );
  }
  return 'Unknown Merchant';
}

// ─── Category Mapping ────────────────────────────────────────────────────────
const MERCHANT_CATEGORY_MAP = {
  Swiggy: 'Food',
  Zomato: 'Food',
  "Domino's": 'Food',
  "McDonald's": 'Food',
  KFC: 'Food',
  'Pizza Hut': 'Food',
  Starbucks: 'Food',
  BigBasket: 'Food',
  Blinkit: 'Food',
  Dunzo: 'Food',
  'D-Mart': 'Food',
  'Reliance Fresh': 'Food',
  Uber: 'Transport',
  Ola: 'Transport',
  Amazon: 'Shopping',
  Flipkart: 'Shopping',
  Myntra: 'Shopping',
  AJIO: 'Shopping',
  Walmart: 'Shopping',
};

const KEYWORD_CATEGORY_MAP = [
  { keywords: ['restaurant', 'cafe', 'food', 'dining', 'eat', 'meal', 'pizza', 'burger', 'snack', 'coffee', 'chai'], category: 'Food' },
  { keywords: ['cab', 'taxi', 'ride', 'fuel', 'petrol', 'diesel', 'transport', 'bus', 'metro', 'train', 'flight', 'uber', 'ola'], category: 'Transport' },
  { keywords: ['shopping', 'mall', 'store', 'mart', 'supermarket', 'clothing', 'fashion', 'shoes', 'apparel'], category: 'Shopping' },
  { keywords: ['electricity', 'water', 'gas', 'utility', 'internet', 'broadband', 'bill', 'recharge', 'telecom'], category: 'Utilities' },
  { keywords: ['movie', 'cinema', 'netflix', 'spotify', 'game', 'entertainment', 'concert', 'event'], category: 'Entertainment' },
  { keywords: ['hospital', 'pharmacy', 'medicine', 'doctor', 'clinic', 'health', 'medical', 'dental'], category: 'Health' },
];

export function extractCategory(merchant, text) {
  // Check merchant map first
  if (MERCHANT_CATEGORY_MAP[merchant]) {
    return MERCHANT_CATEGORY_MAP[merchant];
  }

  const lower = text.toLowerCase() + ' ' + merchant.toLowerCase();
  for (const { keywords, category } of KEYWORD_CATEGORY_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category;
    }
  }
  return 'Other';
}

// ─── Master Parse Function ───────────────────────────────────────────────────
/**
 * Parse OCR text and return structured receipt data.
 * @param {string} text - Raw OCR text from Tesseract
 * @returns {{ amount: number|null, merchant: string, category: string }}
 */
export function parseReceiptText(text) {
  if (!text || text.trim().length === 0) {
    return { amount: null, merchant: 'Unknown', category: 'Other' };
  }

  const merchant = extractMerchant(text);
  const amount = extractAmount(text);
  const category = extractCategory(merchant, text);

  return { amount, merchant, category };
}

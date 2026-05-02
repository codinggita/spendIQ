const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0.01
  },
  description: {
    type: String,
    maxlength: 200,
    trim: true,
    default: ''
  },
  merchant: {
    type: String,
    maxlength: 100,
    trim: true,
    default: ''
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    default: 'expense'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'other'],
    default: 'other'
  },
  source: {
    type: String,
    enum: ['manual', 'sms'],
    default: 'manual'
  },
  smsRaw: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true
});

// Compound index for querying a user's expenses by date efficiently
expenseSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);

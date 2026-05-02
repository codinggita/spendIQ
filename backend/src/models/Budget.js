const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null // null indicates overall budget
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0.01
  },
  period: {
    type: String,
    enum: ['monthly', 'weekly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  alertThreshold: {
    type: Number,
    min: 0,
    max: 100,
    default: 80
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Budget', budgetSchema);

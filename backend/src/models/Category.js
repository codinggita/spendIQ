const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: 50
  },
  icon: {
    type: String,
    trim: true,
    default: '📦'
  },
  color: {
    type: String,
    trim: true,
    default: '#C7CEEA'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for default categories
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure unique category names per user (including default categories)
// A compound index might be tricky if userId is null, so we handle logic in the controller.
categorySchema.index({ name: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);

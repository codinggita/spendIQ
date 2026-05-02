require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const connectDB = require('../config/database');

const defaultCategories = [
  { name: 'Food & Dining', icon: '🍔', color: '#FF6B6B', isDefault: true },
  { name: 'Transportation', icon: '🚗', color: '#4ECDC4', isDefault: true },
  { name: 'Shopping', icon: '🛍️', color: '#95E1D3', isDefault: true },
  { name: 'Bills & Utilities', icon: '💡', color: '#F38181', isDefault: true },
  { name: 'Entertainment', icon: '🎬', color: '#AA96DA', isDefault: true },
  { name: 'Healthcare', icon: '⚕️', color: '#FCBAD3', isDefault: true },
  { name: 'Travel', icon: '✈️', color: '#FFFFD2', isDefault: true },
  { name: 'Education', icon: '📚', color: '#A8D8EA', isDefault: true },
  { name: 'Other', icon: '📦', color: '#C7CEEA', isDefault: true }
];

async function seedCategories() {
  try {
    await connectDB();
    
    // Check if categories already exist
    const count = await Category.countDocuments({ isDefault: true });
    
    if (count > 0) {
      console.log('✅ Default categories already exist');
      process.exit(0);
    }
    
    // Create categories
    for (const category of defaultCategories) {
      await Category.create(category);
    }
    
    console.log('✅ Default categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedCategories();
}

module.exports = seedCategories;

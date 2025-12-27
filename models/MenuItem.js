const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    default: ''
  },
  dietType: {
    type: String,
    required: [true, 'Diet type is required'],
    enum: ['Veg', 'Non-Veg']
  },
  foodType: {
    type: String,
    required: [true, 'Food type is required'],
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage']
  },
  cuisine: {
    type: String,
    enum: ['Indian', 'Chinese', 'Continental', 'Italian', 'Mexican', 'Thai', 'Japanese', 'Other'],
    default: 'Other'
  },
  budgetFriendly: {
    type: Boolean,
    required: [true, 'Budget category is required'],
    default: false
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
menuItemSchema.index({ dietType: 1, foodType: 1, budgetFriendly: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);

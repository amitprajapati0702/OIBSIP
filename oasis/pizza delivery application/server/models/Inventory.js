const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['base', 'sauce', 'cheese', 'vegetable', 'meat'],
    lowercase: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['pieces', 'kg', 'liters', 'grams'],
    default: 'pieces'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  threshold: {
    type: Number,
    required: [true, 'Threshold is required'],
    min: [0, 'Threshold cannot be negative'],
    default: 10
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  image: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  },
  supplier: {
    name: String,
    contact: String,
    email: String
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  }
}, {
  timestamps: true
});

// Indexes for better query performance
inventorySchema.index({ category: 1 });
inventorySchema.index({ isActive: 1 });
inventorySchema.index({ quantity: 1 });

// Virtual for checking if item is below threshold
inventorySchema.virtual('isBelowThreshold').get(function() {
  return this.quantity <= this.threshold;
});

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function() {
  if (this.quantity === 0) return 'out-of-stock';
  if (this.quantity <= this.threshold) return 'low-stock';
  return 'in-stock';
});

// Method to update quantity
inventorySchema.methods.updateQuantity = function(amount, operation = 'subtract') {
  if (operation === 'subtract') {
    this.quantity = Math.max(0, this.quantity - amount);
  } else if (operation === 'add') {
    this.quantity += amount;
    this.lastRestocked = new Date();
  }
  return this.save();
};

// Method to check availability
inventorySchema.methods.isAvailable = function(requiredQuantity = 1) {
  return this.isActive && this.quantity >= requiredQuantity;
};

// Static method to get low stock items
inventorySchema.statics.getLowStockItems = function() {
  return this.find({
    isActive: true,
    $expr: { $lte: ['$quantity', '$threshold'] }
  });
};

// Static method to get items by category
inventorySchema.statics.getByCategory = function(category) {
  return this.find({ 
    category: category.toLowerCase(), 
    isActive: true 
  }).sort({ name: 1 });
};

// Pre-save middleware to validate category-specific rules
inventorySchema.pre('save', function(next) {
  // Set default thresholds based on category
  if (this.isNew && !this.threshold) {
    const defaultThresholds = {
      base: 20,
      sauce: 15,
      cheese: 10,
      vegetable: 25,
      meat: 15
    };
    this.threshold = defaultThresholds[this.category] || 10;
  }
  
  next();
});

// Ensure virtuals are included in JSON output
inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Inventory', inventorySchema);

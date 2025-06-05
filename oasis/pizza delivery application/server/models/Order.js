const mongoose = require('mongoose');

const pizzaItemSchema = new mongoose.Schema({
  base: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true
  },
  sauce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true
  },
  cheese: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true
  },
  vegetables: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory'
  }],
  meat: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory'
  }],
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  customizations: {
    extraCheese: { type: Boolean, default: false },
    extraSauce: { type: Boolean, default: false },
    thinCrust: { type: Boolean, default: false },
    spicyLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot', 'extra-hot'],
      default: 'mild'
    }
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [pizzaItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'baking', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod'],
    required: true
  },
  paymentDetails: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    transactionId: String
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    landmark: String,
    instructions: String
  },
  contactInfo: {
    phone: { type: String, required: true },
    alternatePhone: String
  },
  estimatedDeliveryTime: {
    type: Date,
    required: true
  },
  actualDeliveryTime: Date,
  orderNotes: String,
  adminNotes: String,
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: [0, 'Delivery fee cannot be negative']
  },
  taxes: {
    type: Number,
    default: 0,
    min: [0, 'Taxes cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last order of the day
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const lastOrder = await this.constructor.findOne({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ createdAt: -1 });
    
    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-3));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `PZ${year}${month}${day}${sequence.toString().padStart(3, '0')}`;
    
    // Set estimated delivery time (45 minutes from now)
    this.estimatedDeliveryTime = new Date(Date.now() + 45 * 60 * 1000);
    
    // Add initial status to history
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      notes: 'Order placed'
    });
  }
  
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, updatedBy, notes = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    updatedBy: updatedBy,
    notes: notes
  });
  
  // Set actual delivery time if delivered
  if (newStatus === 'delivered') {
    this.actualDeliveryTime = new Date();
  }
  
  return this.save();
};

// Method to calculate total with taxes and fees
orderSchema.methods.calculateTotal = function() {
  const subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = this.discount || 0;
  const deliveryFee = this.deliveryFee || 0;
  const taxes = this.taxes || 0;
  
  this.totalAmount = subtotal - discountAmount + deliveryFee + taxes;
  return this.totalAmount;
};

// Static method to get orders by status
orderSchema.statics.getByStatus = function(status) {
  return this.find({ status, isActive: true })
    .populate('user', 'name email phone')
    .populate('items.base items.sauce items.cheese items.vegetables items.meat', 'name price')
    .sort({ createdAt: -1 });
};

// Static method to get user orders
orderSchema.statics.getUserOrders = function(userId) {
  return this.find({ user: userId, isActive: true })
    .populate('items.base items.sauce items.cheese items.vegetables items.meat', 'name price')
    .sort({ createdAt: -1 });
};

// Virtual for order age in minutes
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60));
});

// Ensure virtuals are included in JSON output
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);

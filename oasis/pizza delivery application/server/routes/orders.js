const express = require('express');
const crypto = require('crypto');

// Optional Razorpay with fallback
let Razorpay;
try {
  Razorpay = require('razorpay');
} catch (e) {
  console.warn('Razorpay not available - payment functionality will use mock mode');
  Razorpay = null;
}
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const { sendTemplatedEmail } = require('../utils/email');

const router = express.Router();

// Initialize Razorpay
let razorpay = null;
if (Razorpay) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// Create order
router.post('/create', auth, [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.base').isMongoId().withMessage('Valid base ID is required'),
  body('items.*.sauce').isMongoId().withMessage('Valid sauce ID is required'),
  body('items.*.cheese').isMongoId().withMessage('Valid cheese ID is required'),
  body('items.*.vegetables').optional().isArray().withMessage('Vegetables must be an array'),
  body('items.*.meat').optional().isArray().withMessage('Meat must be an array'),
  body('items.*.quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
  body('items.*.size').isIn(['small', 'medium', 'large']).withMessage('Size must be small, medium, or large'),
  body('deliveryAddress.street').notEmpty().withMessage('Street address is required'),
  body('deliveryAddress.city').notEmpty().withMessage('City is required'),
  body('deliveryAddress.state').notEmpty().withMessage('State is required'),
  body('deliveryAddress.zipCode').matches(/^\d{6}$/).withMessage('Valid 6-digit zip code is required'),
  body('contactInfo.phone').matches(/^\d{10}$/).withMessage('Valid 10-digit phone number is required'),
  body('paymentMethod').isIn(['razorpay', 'cod']).withMessage('Payment method must be razorpay or cod')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { items, deliveryAddress, contactInfo, paymentMethod, orderNotes } = req.body;
    const userId = req.user.userId;

    // Validate and calculate prices for all items
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const { base, sauce, cheese, vegetables = [], meat = [], quantity, size, customizations = {} } = item;

      // Get all ingredient IDs for this item
      const allIngredientIds = [base, sauce, cheese, ...vegetables, ...meat];

      // Fetch all ingredients
      const ingredients = await Inventory.find({
        _id: { $in: allIngredientIds },
        isActive: true
      });

      if (ingredients.length !== allIngredientIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more ingredients not found or inactive'
        });
      }

      // Check availability
      const unavailableItems = ingredients.filter(ing => !ing.isAvailable(quantity));
      if (unavailableItems.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock for some ingredients',
          unavailableItems: unavailableItems.map(ing => ({
            name: ing.name,
            available: ing.quantity,
            required: quantity
          }))
        });
      }

      // Calculate price for this item
      let itemPrice = ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0);

      // Size multipliers
      const sizeMultipliers = { small: 0.8, medium: 1.0, large: 1.3 };
      itemPrice *= sizeMultipliers[size];

      // Add customization costs
      if (customizations.extraCheese) itemPrice += 50;
      if (customizations.extraSauce) itemPrice += 30;
      if (customizations.thinCrust) itemPrice += 20;

      // Round to 2 decimal places
      itemPrice = Math.round(itemPrice * 100) / 100;

      processedItems.push({
        base,
        sauce,
        cheese,
        vegetables,
        meat,
        quantity,
        size,
        price: itemPrice,
        customizations
      });

      totalAmount += itemPrice * quantity;
    }

    // Add delivery fee and taxes
    const deliveryFee = 50;
    const taxRate = 0.18; // 18% GST
    const taxes = Math.round(totalAmount * taxRate * 100) / 100;
    totalAmount = Math.round((totalAmount + deliveryFee + taxes) * 100) / 100;

    // Create order
    const order = new Order({
      user: userId,
      items: processedItems,
      totalAmount,
      deliveryAddress,
      contactInfo,
      paymentMethod,
      orderNotes,
      deliveryFee,
      taxes,
      status: 'pending'
    });

    await order.save();

    // If payment method is Razorpay, create Razorpay order
    let razorpayOrder = null;
    if (paymentMethod === 'razorpay') {
      try {
        if (razorpay) {
          razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100), // Amount in paise
            currency: 'INR',
            receipt: order.orderNumber,
            notes: {
              orderId: order._id.toString(),
              userId: userId
            }
          });
        } else {
          // Mock Razorpay order for development
          razorpayOrder = {
            id: `order_mock_${Date.now()}`,
            amount: Math.round(totalAmount * 100),
            currency: 'INR',
            receipt: order.orderNumber
          };
        }

        order.paymentDetails.razorpayOrderId = razorpayOrder.id;
        await order.save();
      } catch (razorpayError) {
        console.error('Razorpay order creation failed:', razorpayError);
        return res.status(500).json({
          success: false,
          message: 'Failed to create payment order'
        });
      }
    }

    // Populate order details for response
    await order.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'items.base items.sauce items.cheese items.vegetables items.meat', select: 'name price category' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order,
        razorpayOrder: razorpayOrder ? {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency
        } : null
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Verify payment and confirm order
router.post('/verify-payment', auth, [
  body('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('razorpayPaymentId').notEmpty().withMessage('Razorpay payment ID is required'),
  body('razorpayOrderId').notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpaySignature').notEmpty().withMessage('Razorpay signature is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    const userId = req.user.userId;

    // Find the order
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      order.paymentStatus = 'failed';
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Payment verified successfully
    order.paymentStatus = 'completed';
    order.paymentDetails.razorpayPaymentId = razorpayPaymentId;
    order.paymentDetails.razorpaySignature = razorpaySignature;
    order.status = 'confirmed';

    // Add status update to history
    order.statusHistory.push({
      status: 'confirmed',
      timestamp: new Date(),
      notes: 'Payment verified and order confirmed'
    });

    await order.save();

    // Update inventory
    for (const item of order.items) {
      const allIngredientIds = [item.base, item.sauce, item.cheese, ...item.vegetables, ...item.meat];

      for (const ingredientId of allIngredientIds) {
        await Inventory.findByIdAndUpdate(
          ingredientId,
          { $inc: { quantity: -item.quantity } }
        );
      }
    }

    // Send confirmation email
    try {
      const user = await User.findById(userId);
      await sendTemplatedEmail('orderConfirmation', user.email, {
        name: user.name,
        order: order
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.to('admin-room').emit('new-order', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      status: order.status
    });

    res.json({
      success: true,
      message: 'Payment verified and order confirmed',
      data: { order }
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user.userId;

    let query = { user: userId, isActive: true };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate([
        { path: 'items.base items.sauce items.cheese items.vegetables items.meat', select: 'name price category' }
      ])
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get specific order
router.get('/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate([
        { path: 'user', select: 'name email phone' },
        { path: 'items.base items.sauce items.cheese items.vegetables items.meat', select: 'name price category description' }
      ]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;

const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');
const { sendTemplatedEmail } = require('../utils/email');

const router = express.Router();

// Get admin dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Get today's stats
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      isActive: true
    });

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          paymentStatus: 'completed',
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Get pending orders
    const pendingOrders = await Order.countDocuments({
      status: { $in: ['pending', 'confirmed', 'preparing', 'baking'] },
      isActive: true
    });

    // Get low stock items
    const lowStockItems = await Inventory.getLowStockItems();

    // Get recent orders
    const recentOrders = await Order.find({ isActive: true })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get order status distribution
    const orderStatusStats = await Order.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          todayOrders,
          todayRevenue: todayRevenue[0]?.total || 0,
          pendingOrders,
          lowStockCount: lowStockItems.length
        },
        lowStockItems,
        recentOrders,
        orderStatusStats
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get all orders for admin
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, startDate, endDate } = req.query;

    let query = { isActive: true };

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Search functionality
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'deliveryAddress.city': { $regex: search, $options: 'i' } },
        { 'contactInfo.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.base items.sauce items.cheese items.vegetables items.meat', 'name category')
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
    console.error('Admin get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update order status
router.patch('/orders/:orderId/status', adminAuth, [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'baking', 'ready', 'out-for-delivery', 'delivered', 'cancelled'])
    .withMessage('Invalid status'),
  body('notes').optional().isString().withMessage('Notes must be a string')
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

    const { orderId } = req.params;
    const { status, notes } = req.body;
    const adminId = req.user.userId;

    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status
    await order.updateStatus(status, adminId, notes);

    // Send status update email to customer
    try {
      await sendTemplatedEmail('orderStatusUpdate', order.user.email, {
        name: order.user.name,
        order: order,
        newStatus: status
      });
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
    }

    // Emit real-time update to user
    const io = req.app.get('io');
    io.to(`order-${orderId}`).emit('order-status-update', {
      orderId: order._id,
      status: status,
      timestamp: new Date(),
      notes: notes
    });

    // Emit update to admin room
    io.to('admin-room').emit('order-updated', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: status,
      updatedBy: adminId
    });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get order details for admin
router.get('/orders/:orderId', adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('user', 'name email phone address')
      .populate('items.base items.sauce items.cheese items.vegetables items.meat', 'name price category description')
      .populate('statusHistory.updatedBy', 'name email');

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
    console.error('Get admin order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get all users for admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;

    let query = { isActive: true };

    // Filter by role
    if (role && role !== 'all') {
      query.role = role;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -emailVerificationToken -passwordResetToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Analytics endpoint
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const { period = '7d' } = req.query;

    let startDate;
    const endDate = new Date();

    switch (period) {
      case '24h':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }

    // Revenue analytics
    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: 'completed',
          isActive: true
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Popular ingredients
    const popularIngredients = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: 'completed',
          isActive: true
        }
      },
      { $unwind: '$items' },
      {
        $project: {
          ingredients: {
            $concatArrays: [
              ['$items.base'],
              ['$items.sauce'],
              ['$items.cheese'],
              '$items.vegetables',
              '$items.meat'
            ]
          }
        }
      },
      { $unwind: '$ingredients' },
      {
        $group: {
          _id: '$ingredients',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        period,
        revenueData,
        popularIngredients
      }
    });

  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;

const express = require('express');
const { body, validationResult } = require('express-validator');
const Inventory = require('../models/Inventory');
const { adminAuth, auth } = require('../middleware/auth');
const { sendTemplatedEmail } = require('../utils/email');

const router = express.Router();

// Get all inventory items (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 20 } = req.query;

    let query = {};

    // Filter by category
    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    // Filter by status
    if (status) {
      switch (status) {
        case 'low-stock':
          query.$expr = { $lte: ['$quantity', '$threshold'] };
          break;
        case 'out-of-stock':
          query.quantity = 0;
          break;
        case 'in-stock':
          query.$expr = { $gt: ['$quantity', '$threshold'] };
          break;
        case 'inactive':
          query.isActive = false;
          break;
        default:
          query.isActive = true;
      }
    } else {
      query.isActive = true;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'supplier.name': { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Inventory.find(query)
      .sort({ category: 1, name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Inventory.countDocuments(query);

    // Get category counts
    const categoryCounts = await Inventory.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          lowStock: {
            $sum: {
              $cond: [{ $lte: ['$quantity', '$threshold'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        items,
        categoryCounts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Add new inventory item
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('category').isIn(['base', 'sauce', 'cheese', 'vegetable', 'meat']).withMessage('Invalid category'),
  body('quantity').isNumeric().isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('unit').isIn(['pieces', 'kg', 'liters', 'grams']).withMessage('Invalid unit'),
  body('price').isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('threshold').optional().isNumeric().isFloat({ min: 0 }).withMessage('Threshold must be a positive number'),
  body('description').optional().isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters')
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

    const { name, category, quantity, unit, price, threshold, description, supplier, nutritionalInfo } = req.body;

    // Check if item already exists
    const existingItem = await Inventory.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      category: category.toLowerCase()
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Item with this name already exists in this category'
      });
    }

    const inventoryItem = new Inventory({
      name,
      category: category.toLowerCase(),
      quantity,
      unit,
      price,
      threshold,
      description,
      supplier,
      nutritionalInfo
    });

    await inventoryItem.save();

    res.status(201).json({
      success: true,
      message: 'Inventory item added successfully',
      data: { item: inventoryItem }
    });

  } catch (error) {
    console.error('Add inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add inventory item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update inventory item
router.put('/:itemId', adminAuth, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('quantity').optional().isNumeric().isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('price').optional().isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('threshold').optional().isNumeric().isFloat({ min: 0 }).withMessage('Threshold must be a positive number'),
  body('description').optional().isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters')
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

    const { itemId } = req.params;
    const updateData = req.body;

    const item = await Inventory.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    // Check if name change conflicts with existing item
    if (updateData.name && updateData.name !== item.name) {
      const existingItem = await Inventory.findOne({
        _id: { $ne: itemId },
        name: { $regex: new RegExp(`^${updateData.name}$`, 'i') },
        category: item.category
      });

      if (existingItem) {
        return res.status(400).json({
          success: false,
          message: 'Item with this name already exists in this category'
        });
      }
    }

    // Update the item
    Object.assign(item, updateData);
    await item.save();

    res.json({
      success: true,
      message: 'Inventory item updated successfully',
      data: { item }
    });

  } catch (error) {
    console.error('Update inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inventory item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update stock quantity
router.patch('/:itemId/stock', adminAuth, [
  body('quantity').isNumeric().isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('operation').isIn(['add', 'subtract', 'set']).withMessage('Operation must be add, subtract, or set')
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

    const { itemId } = req.params;
    const { quantity, operation } = req.body;

    const item = await Inventory.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    const oldQuantity = item.quantity;

    // Update quantity based on operation
    switch (operation) {
      case 'add':
        item.quantity += quantity;
        item.lastRestocked = new Date();
        break;
      case 'subtract':
        item.quantity = Math.max(0, item.quantity - quantity);
        break;
      case 'set':
        item.quantity = quantity;
        if (quantity > oldQuantity) {
          item.lastRestocked = new Date();
        }
        break;
    }

    await item.save();

    // Check if item is now below threshold and send alert
    if (item.isBelowThreshold && !item.quantity === 0) {
      try {
        await sendTemplatedEmail('lowStockAlert', process.env.STOCK_THRESHOLD_EMAIL, {
          items: [item]
        });
      } catch (emailError) {
        console.error('Failed to send low stock alert:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Stock quantity updated successfully',
      data: { 
        item,
        previousQuantity: oldQuantity,
        operation,
        quantityChanged: quantity
      }
    });

  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get low stock items
router.get('/low-stock', adminAuth, async (req, res) => {
  try {
    const lowStockItems = await Inventory.getLowStockItems();

    res.json({
      success: true,
      data: {
        items: lowStockItems,
        count: lowStockItems.length
      }
    });

  } catch (error) {
    console.error('Get low stock items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch low stock items',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Send low stock alert manually
router.post('/send-stock-alert', adminAuth, async (req, res) => {
  try {
    const lowStockItems = await Inventory.getLowStockItems();

    if (lowStockItems.length === 0) {
      return res.json({
        success: true,
        message: 'No low stock items found'
      });
    }

    await sendTemplatedEmail('lowStockAlert', process.env.STOCK_THRESHOLD_EMAIL, {
      items: lowStockItems
    });

    res.json({
      success: true,
      message: 'Low stock alert sent successfully',
      data: {
        itemsCount: lowStockItems.length,
        sentTo: process.env.STOCK_THRESHOLD_EMAIL
      }
    });

  } catch (error) {
    console.error('Send stock alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send stock alert',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Delete inventory item (soft delete)
router.delete('/:itemId', adminAuth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Inventory.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    item.isActive = false;
    await item.save();

    res.json({
      success: true,
      message: 'Inventory item deleted successfully'
    });

  } catch (error) {
    console.error('Delete inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete inventory item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get inventory item details
router.get('/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Inventory.findById(itemId);
    if (!item || !item.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      data: { item }
    });

  } catch (error) {
    console.error('Get inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;

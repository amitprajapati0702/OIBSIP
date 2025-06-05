const express = require('express');
const { body, validationResult } = require('express-validator');
const Inventory = require('../models/Inventory');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all pizza ingredients by category
router.get('/ingredients', optionalAuth, async (req, res) => {
  try {
    const { category } = req.query;

    let query = { isActive: true };
    if (category) {
      query.category = category.toLowerCase();
    }

    const ingredients = await Inventory.find(query)
      .select('name category price description image quantity stockStatus')
      .sort({ category: 1, name: 1 });

    // Group ingredients by category
    const groupedIngredients = ingredients.reduce((acc, ingredient) => {
      const cat = ingredient.category;
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(ingredient);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        ingredients: groupedIngredients,
        total: ingredients.length
      }
    });

  } catch (error) {
    console.error('Get ingredients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ingredients',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get ingredients by specific category
router.get('/ingredients/:category', optionalAuth, async (req, res) => {
  try {
    const { category } = req.params;
    
    const validCategories = ['base', 'sauce', 'cheese', 'vegetable', 'meat'];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Valid categories are: ' + validCategories.join(', ')
      });
    }

    const ingredients = await Inventory.getByCategory(category);

    res.json({
      success: true,
      data: {
        category: category,
        ingredients: ingredients,
        total: ingredients.length
      }
    });

  } catch (error) {
    console.error('Get category ingredients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category ingredients',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Calculate pizza price
router.post('/calculate-price', [
  body('base').isMongoId().withMessage('Valid base ID is required'),
  body('sauce').isMongoId().withMessage('Valid sauce ID is required'),
  body('cheese').isMongoId().withMessage('Valid cheese ID is required'),
  body('vegetables').optional().isArray().withMessage('Vegetables must be an array'),
  body('vegetables.*').optional().isMongoId().withMessage('Each vegetable must be a valid ID'),
  body('meat').optional().isArray().withMessage('Meat must be an array'),
  body('meat.*').optional().isMongoId().withMessage('Each meat must be a valid ID'),
  body('size').isIn(['small', 'medium', 'large']).withMessage('Size must be small, medium, or large'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('customizations').optional().isObject().withMessage('Customizations must be an object')
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

    const { base, sauce, cheese, vegetables = [], meat = [], size, quantity, customizations = {} } = req.body;

    // Get all ingredient IDs
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
    const unavailableItems = ingredients.filter(item => !item.isAvailable());
    if (unavailableItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some ingredients are out of stock',
        unavailableItems: unavailableItems.map(item => ({
          id: item._id,
          name: item.name,
          category: item.category,
          stockStatus: item.stockStatus
        }))
      });
    }

    // Calculate base price
    let totalPrice = ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0);

    // Size multipliers
    const sizeMultipliers = {
      small: 0.8,
      medium: 1.0,
      large: 1.3
    };

    totalPrice *= sizeMultipliers[size];

    // Add customization costs
    if (customizations.extraCheese) totalPrice += 50;
    if (customizations.extraSauce) totalPrice += 30;
    if (customizations.thinCrust) totalPrice += 20;

    // Apply quantity
    totalPrice *= quantity;

    // Round to 2 decimal places
    totalPrice = Math.round(totalPrice * 100) / 100;

    // Prepare ingredient details for response
    const ingredientDetails = ingredients.map(ingredient => ({
      id: ingredient._id,
      name: ingredient.name,
      category: ingredient.category,
      price: ingredient.price,
      description: ingredient.description
    }));

    res.json({
      success: true,
      data: {
        totalPrice,
        basePrice: totalPrice / quantity,
        breakdown: {
          ingredients: ingredientDetails,
          size: size,
          sizeMultiplier: sizeMultipliers[size],
          customizations: customizations,
          quantity: quantity
        }
      }
    });

  } catch (error) {
    console.error('Calculate price error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate price',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Validate pizza configuration
router.post('/validate', [
  body('base').isMongoId().withMessage('Valid base ID is required'),
  body('sauce').isMongoId().withMessage('Valid sauce ID is required'),
  body('cheese').isMongoId().withMessage('Valid cheese ID is required'),
  body('vegetables').optional().isArray().withMessage('Vegetables must be an array'),
  body('vegetables.*').optional().isMongoId().withMessage('Each vegetable must be a valid ID'),
  body('meat').optional().isArray().withMessage('Meat must be an array'),
  body('meat.*').optional().isMongoId().withMessage('Each meat must be a valid ID'),
  body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10')
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

    const { base, sauce, cheese, vegetables = [], meat = [], quantity } = req.body;

    // Get all ingredient IDs
    const allIngredientIds = [base, sauce, cheese, ...vegetables, ...meat];
    
    // Fetch all ingredients
    const ingredients = await Inventory.find({
      _id: { $in: allIngredientIds },
      isActive: true
    });

    // Validation checks
    const validationResults = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Check if all ingredients exist
    if (ingredients.length !== allIngredientIds.length) {
      validationResults.isValid = false;
      validationResults.errors.push('One or more ingredients not found');
    }

    // Check category constraints
    const categoryCounts = ingredients.reduce((acc, ingredient) => {
      acc[ingredient.category] = (acc[ingredient.category] || 0) + 1;
      return acc;
    }, {});

    // Validate required categories
    const requiredCategories = ['base', 'sauce', 'cheese'];
    for (const category of requiredCategories) {
      if (!categoryCounts[category]) {
        validationResults.isValid = false;
        validationResults.errors.push(`${category} is required`);
      } else if (categoryCounts[category] > 1) {
        validationResults.isValid = false;
        validationResults.errors.push(`Only one ${category} is allowed`);
      }
    }

    // Check availability for required quantity
    const unavailableItems = ingredients.filter(item => !item.isAvailable(quantity));
    if (unavailableItems.length > 0) {
      validationResults.isValid = false;
      validationResults.errors.push('Insufficient stock for some ingredients');
      validationResults.unavailableItems = unavailableItems.map(item => ({
        id: item._id,
        name: item.name,
        category: item.category,
        available: item.quantity,
        required: quantity
      }));
    }

    // Check for low stock warnings
    const lowStockItems = ingredients.filter(item => item.isBelowThreshold);
    if (lowStockItems.length > 0) {
      validationResults.warnings.push('Some ingredients are running low in stock');
      validationResults.lowStockItems = lowStockItems.map(item => ({
        id: item._id,
        name: item.name,
        category: item.category,
        stockStatus: item.stockStatus
      }));
    }

    // Validate vegetable and meat limits
    if (vegetables.length > 5) {
      validationResults.warnings.push('Too many vegetables selected (maximum 5 recommended)');
    }

    if (meat.length > 3) {
      validationResults.warnings.push('Too many meat options selected (maximum 3 recommended)');
    }

    res.json({
      success: true,
      data: validationResults
    });

  } catch (error) {
    console.error('Validate pizza error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate pizza configuration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get popular pizza combinations
router.get('/popular-combinations', optionalAuth, async (req, res) => {
  try {
    // This would typically come from order analytics
    // For now, we'll return some predefined popular combinations
    const popularCombinations = [
      {
        name: "Margherita Classic",
        description: "Traditional Italian pizza with fresh basil",
        ingredients: {
          base: "Thin Crust",
          sauce: "Tomato Basil",
          cheese: "Mozzarella",
          vegetables: ["Fresh Basil", "Tomatoes"],
          meat: []
        },
        estimatedPrice: 299,
        popularity: 95
      },
      {
        name: "Pepperoni Supreme",
        description: "Classic pepperoni with extra cheese",
        ingredients: {
          base: "Regular Crust",
          sauce: "Pizza Sauce",
          cheese: "Mozzarella",
          vegetables: [],
          meat: ["Pepperoni"]
        },
        estimatedPrice: 399,
        popularity: 88
      },
      {
        name: "Veggie Delight",
        description: "Loaded with fresh vegetables",
        ingredients: {
          base: "Whole Wheat",
          sauce: "Tomato Basil",
          cheese: "Mozzarella",
          vegetables: ["Bell Peppers", "Mushrooms", "Onions", "Olives"],
          meat: []
        },
        estimatedPrice: 349,
        popularity: 82
      }
    ];

    res.json({
      success: true,
      data: {
        combinations: popularCombinations,
        total: popularCombinations.length
      }
    });

  } catch (error) {
    console.error('Get popular combinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular combinations',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;

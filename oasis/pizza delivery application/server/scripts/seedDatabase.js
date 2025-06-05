const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Inventory = require('../models/Inventory');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza-delivery', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample inventory data
const inventoryData = [
  // Pizza Bases
  {
    name: 'Thin Crust',
    category: 'base',
    quantity: 100,
    unit: 'pieces',
    price: 80,
    threshold: 20,
    description: 'Crispy thin crust pizza base',
    supplier: {
      name: 'Fresh Dough Co.',
      contact: '9876543210',
      email: 'orders@freshdough.com'
    },
    nutritionalInfo: {
      calories: 150,
      protein: 5,
      carbs: 30,
      fat: 2,
      fiber: 1
    }
  },
  {
    name: 'Thick Crust',
    category: 'base',
    quantity: 80,
    unit: 'pieces',
    price: 100,
    threshold: 20,
    description: 'Fluffy thick crust pizza base',
    supplier: {
      name: 'Fresh Dough Co.',
      contact: '9876543210',
      email: 'orders@freshdough.com'
    },
    nutritionalInfo: {
      calories: 200,
      protein: 7,
      carbs: 40,
      fat: 3,
      fiber: 2
    }
  },
  {
    name: 'Whole Wheat',
    category: 'base',
    quantity: 60,
    unit: 'pieces',
    price: 120,
    threshold: 15,
    description: 'Healthy whole wheat pizza base',
    supplier: {
      name: 'Healthy Grains Ltd.',
      contact: '9876543211',
      email: 'supply@healthygrains.com'
    },
    nutritionalInfo: {
      calories: 180,
      protein: 8,
      carbs: 35,
      fat: 2,
      fiber: 5
    }
  },
  {
    name: 'Gluten Free',
    category: 'base',
    quantity: 40,
    unit: 'pieces',
    price: 150,
    threshold: 10,
    description: 'Gluten-free pizza base for dietary restrictions',
    supplier: {
      name: 'Special Diet Foods',
      contact: '9876543212',
      email: 'orders@specialdiet.com'
    },
    nutritionalInfo: {
      calories: 160,
      protein: 4,
      carbs: 32,
      fat: 3,
      fiber: 2
    }
  },
  {
    name: 'Stuffed Crust',
    category: 'base',
    quantity: 50,
    unit: 'pieces',
    price: 180,
    threshold: 15,
    description: 'Cheese-stuffed crust pizza base',
    supplier: {
      name: 'Premium Pizza Co.',
      contact: '9876543213',
      email: 'orders@premiumpizza.com'
    },
    nutritionalInfo: {
      calories: 250,
      protein: 12,
      carbs: 35,
      fat: 8,
      fiber: 2
    }
  },

  // Sauces
  {
    name: 'Classic Tomato',
    category: 'sauce',
    quantity: 50,
    unit: 'liters',
    price: 60,
    threshold: 15,
    description: 'Traditional tomato pizza sauce with herbs',
    supplier: {
      name: 'Sauce Masters',
      contact: '9876543214',
      email: 'orders@saucemasters.com'
    },
    nutritionalInfo: {
      calories: 25,
      protein: 1,
      carbs: 6,
      fat: 0,
      fiber: 1
    }
  },
  {
    name: 'Pesto',
    category: 'sauce',
    quantity: 30,
    unit: 'liters',
    price: 120,
    threshold: 10,
    description: 'Fresh basil pesto sauce',
    supplier: {
      name: 'Herb Garden Co.',
      contact: '9876543215',
      email: 'orders@herbgarden.com'
    },
    nutritionalInfo: {
      calories: 80,
      protein: 2,
      carbs: 3,
      fat: 8,
      fiber: 1
    }
  },
  {
    name: 'BBQ Sauce',
    category: 'sauce',
    quantity: 40,
    unit: 'liters',
    price: 80,
    threshold: 12,
    description: 'Smoky barbecue sauce',
    supplier: {
      name: 'Sauce Masters',
      contact: '9876543214',
      email: 'orders@saucemasters.com'
    },
    nutritionalInfo: {
      calories: 45,
      protein: 0,
      carbs: 11,
      fat: 0,
      fiber: 0
    }
  },
  {
    name: 'White Sauce',
    category: 'sauce',
    quantity: 35,
    unit: 'liters',
    price: 100,
    threshold: 10,
    description: 'Creamy white garlic sauce',
    supplier: {
      name: 'Dairy Fresh Ltd.',
      contact: '9876543216',
      email: 'orders@dairyfresh.com'
    },
    nutritionalInfo: {
      calories: 90,
      protein: 3,
      carbs: 4,
      fat: 8,
      fiber: 0
    }
  },
  {
    name: 'Spicy Marinara',
    category: 'sauce',
    quantity: 45,
    unit: 'liters',
    price: 70,
    threshold: 15,
    description: 'Spicy tomato marinara sauce',
    supplier: {
      name: 'Spice World',
      contact: '9876543217',
      email: 'orders@spiceworld.com'
    },
    nutritionalInfo: {
      calories: 30,
      protein: 1,
      carbs: 7,
      fat: 0,
      fiber: 1
    }
  },

  // Cheese
  {
    name: 'Mozzarella',
    category: 'cheese',
    quantity: 25,
    unit: 'kg',
    price: 150,
    threshold: 10,
    description: 'Fresh mozzarella cheese',
    supplier: {
      name: 'Dairy Fresh Ltd.',
      contact: '9876543216',
      email: 'orders@dairyfresh.com'
    },
    nutritionalInfo: {
      calories: 280,
      protein: 22,
      carbs: 2,
      fat: 22,
      fiber: 0
    }
  },
  {
    name: 'Cheddar',
    category: 'cheese',
    quantity: 20,
    unit: 'kg',
    price: 180,
    threshold: 8,
    description: 'Sharp cheddar cheese',
    supplier: {
      name: 'Cheese Palace',
      contact: '9876543218',
      email: 'orders@cheesepalace.com'
    },
    nutritionalInfo: {
      calories: 400,
      protein: 25,
      carbs: 1,
      fat: 33,
      fiber: 0
    }
  },
  {
    name: 'Parmesan',
    category: 'cheese',
    quantity: 15,
    unit: 'kg',
    price: 250,
    threshold: 5,
    description: 'Aged parmesan cheese',
    supplier: {
      name: 'Italian Imports',
      contact: '9876543219',
      email: 'orders@italianImports.com'
    },
    nutritionalInfo: {
      calories: 430,
      protein: 38,
      carbs: 4,
      fat: 29,
      fiber: 0
    }
  },

  // Vegetables
  {
    name: 'Bell Peppers',
    category: 'vegetable',
    quantity: 30,
    unit: 'kg',
    price: 40,
    threshold: 25,
    description: 'Fresh colorful bell peppers',
    supplier: {
      name: 'Fresh Veggies Co.',
      contact: '9876543220',
      email: 'orders@freshveggies.com'
    },
    nutritionalInfo: {
      calories: 20,
      protein: 1,
      carbs: 5,
      fat: 0,
      fiber: 2
    }
  },
  {
    name: 'Mushrooms',
    category: 'vegetable',
    quantity: 25,
    unit: 'kg',
    price: 60,
    threshold: 20,
    description: 'Fresh button mushrooms',
    supplier: {
      name: 'Mushroom Farm',
      contact: '9876543221',
      email: 'orders@mushroomfarm.com'
    },
    nutritionalInfo: {
      calories: 15,
      protein: 2,
      carbs: 3,
      fat: 0,
      fiber: 1
    }
  },
  {
    name: 'Red Onions',
    category: 'vegetable',
    quantity: 40,
    unit: 'kg',
    price: 30,
    threshold: 30,
    description: 'Fresh red onions',
    supplier: {
      name: 'Fresh Veggies Co.',
      contact: '9876543220',
      email: 'orders@freshveggies.com'
    },
    nutritionalInfo: {
      calories: 25,
      protein: 1,
      carbs: 6,
      fat: 0,
      fiber: 1
    }
  },
  {
    name: 'Black Olives',
    category: 'vegetable',
    quantity: 20,
    unit: 'kg',
    price: 120,
    threshold: 15,
    description: 'Premium black olives',
    supplier: {
      name: 'Mediterranean Foods',
      contact: '9876543222',
      email: 'orders@medfoods.com'
    },
    nutritionalInfo: {
      calories: 80,
      protein: 1,
      carbs: 4,
      fat: 7,
      fiber: 2
    }
  },
  {
    name: 'Fresh Tomatoes',
    category: 'vegetable',
    quantity: 35,
    unit: 'kg',
    price: 50,
    threshold: 25,
    description: 'Fresh ripe tomatoes',
    supplier: {
      name: 'Fresh Veggies Co.',
      contact: '9876543220',
      email: 'orders@freshveggies.com'
    },
    nutritionalInfo: {
      calories: 18,
      protein: 1,
      carbs: 4,
      fat: 0,
      fiber: 1
    }
  },

  // Meat
  {
    name: 'Pepperoni',
    category: 'meat',
    quantity: 15,
    unit: 'kg',
    price: 300,
    threshold: 10,
    description: 'Spicy pepperoni slices',
    supplier: {
      name: 'Meat Masters',
      contact: '9876543223',
      email: 'orders@meatmasters.com'
    },
    nutritionalInfo: {
      calories: 450,
      protein: 20,
      carbs: 2,
      fat: 40,
      fiber: 0
    }
  },
  {
    name: 'Italian Sausage',
    category: 'meat',
    quantity: 12,
    unit: 'kg',
    price: 350,
    threshold: 8,
    description: 'Seasoned Italian sausage',
    supplier: {
      name: 'Italian Meats Co.',
      contact: '9876543224',
      email: 'orders@italianmeats.com'
    },
    nutritionalInfo: {
      calories: 300,
      protein: 16,
      carbs: 1,
      fat: 26,
      fiber: 0
    }
  },
  {
    name: 'Chicken',
    category: 'meat',
    quantity: 18,
    unit: 'kg',
    price: 250,
    threshold: 12,
    description: 'Grilled chicken pieces',
    supplier: {
      name: 'Poultry Fresh',
      contact: '9876543225',
      email: 'orders@poultryfresh.com'
    },
    nutritionalInfo: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 4,
      fiber: 0
    }
  }
];

// Admin user data
const adminUser = {
  name: 'Admin User',
  email: 'admin@pizzadelivery.com',
  password: 'admin123',
  phone: '9999999999',
  address: {
    street: '123 Admin Street',
    city: 'Admin City',
    state: 'Admin State',
    zipCode: '123456'
  },
  role: 'admin',
  isEmailVerified: true
};

// Seed function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Inventory.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = new User(adminUser);
    await admin.save();
    console.log('Admin user created');

    // Create inventory items
    await Inventory.insertMany(inventoryData);
    console.log('Inventory items created');

    console.log('Database seeding completed successfully!');
    console.log('\nAdmin Login Credentials:');
    console.log('Email: admin@pizzadelivery.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeder
if (require.main === module) {
  connectDB().then(() => {
    seedDatabase();
  });
}

module.exports = { seedDatabase, connectDB };

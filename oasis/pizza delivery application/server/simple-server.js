// Simple server without external dependencies for demonstration
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

// Simple in-memory data store
let users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@pizzadelivery.com',
    password: 'admin123', // In real app, this would be hashed
    role: 'admin',
    isEmailVerified: true
  }
];

let inventory = [
  // Pizza Bases
  { id: 1, name: 'Thin Crust', category: 'base', quantity: 100, price: 80, threshold: 20 },
  { id: 2, name: 'Thick Crust', category: 'base', quantity: 80, price: 100, threshold: 20 },
  { id: 3, name: 'Whole Wheat', category: 'base', quantity: 60, price: 120, threshold: 15 },
  { id: 4, name: 'Gluten Free', category: 'base', quantity: 40, price: 150, threshold: 10 },
  { id: 5, name: 'Stuffed Crust', category: 'base', quantity: 50, price: 180, threshold: 15 },
  
  // Sauces
  { id: 6, name: 'Classic Tomato', category: 'sauce', quantity: 50, price: 60, threshold: 15 },
  { id: 7, name: 'Pesto', category: 'sauce', quantity: 30, price: 120, threshold: 10 },
  { id: 8, name: 'BBQ Sauce', category: 'sauce', quantity: 40, price: 80, threshold: 12 },
  { id: 9, name: 'White Sauce', category: 'sauce', quantity: 35, price: 100, threshold: 10 },
  { id: 10, name: 'Spicy Marinara', category: 'sauce', quantity: 45, price: 70, threshold: 15 },
  
  // Cheese
  { id: 11, name: 'Mozzarella', category: 'cheese', quantity: 25, price: 150, threshold: 10 },
  { id: 12, name: 'Cheddar', category: 'cheese', quantity: 20, price: 180, threshold: 8 },
  { id: 13, name: 'Parmesan', category: 'cheese', quantity: 15, price: 250, threshold: 5 },
  
  // Vegetables
  { id: 14, name: 'Bell Peppers', category: 'vegetable', quantity: 30, price: 40, threshold: 25 },
  { id: 15, name: 'Mushrooms', category: 'vegetable', quantity: 25, price: 60, threshold: 20 },
  { id: 16, name: 'Red Onions', category: 'vegetable', quantity: 40, price: 30, threshold: 30 },
  { id: 17, name: 'Black Olives', category: 'vegetable', quantity: 20, price: 120, threshold: 15 },
  { id: 18, name: 'Fresh Tomatoes', category: 'vegetable', quantity: 35, price: 50, threshold: 25 },
  
  // Meat
  { id: 19, name: 'Pepperoni', category: 'meat', quantity: 15, price: 300, threshold: 10 },
  { id: 20, name: 'Italian Sausage', category: 'meat', quantity: 12, price: 350, threshold: 8 },
  { id: 21, name: 'Chicken', category: 'meat', quantity: 18, price: 250, threshold: 12 }
];

let orders = [];
let nextOrderId = 1;
let nextUserId = 2;

// Helper functions
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
};

const parseBody = (req) => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
};

// Simple authentication
const authenticate = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  // In a real app, you'd verify the JWT token
  // For demo, we'll just check if it's "admin-token" or "user-token"
  const token = authHeader.split(' ')[1];
  if (token === 'admin-token') {
    return users.find(u => u.role === 'admin');
  }
  if (token === 'user-token') {
    return users.find(u => u.role === 'user');
  }
  return null;
};

// Routes
const routes = {
  // Health check
  'GET /api/health': (req, res) => {
    sendJSON(res, 200, { 
      status: 'OK', 
      message: 'Pizza Delivery API is running',
      timestamp: new Date().toISOString()
    });
  },

  // Auth routes
  'POST /api/auth/login': async (req, res) => {
    const { email, password } = await parseBody(req);
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return sendJSON(res, 401, { success: false, message: 'Invalid credentials' });
    }

    // Generate mock token
    const token = user.role === 'admin' ? 'admin-token' : 'user-token';
    
    sendJSON(res, 200, {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  },

  'POST /api/auth/register': async (req, res) => {
    const { name, email, password, phone, address } = await parseBody(req);
    
    if (users.find(u => u.email === email)) {
      return sendJSON(res, 400, { success: false, message: 'User already exists' });
    }

    const newUser = {
      id: nextUserId++,
      name,
      email,
      password, // In real app, hash this
      phone,
      address,
      role: 'user',
      isEmailVerified: true // For demo
    };

    users.push(newUser);
    
    sendJSON(res, 201, {
      success: true,
      message: 'User registered successfully',
      data: { user: { id: newUser.id, name, email } }
    });
  },

  // Pizza ingredients
  'GET /api/pizza/ingredients': (req, res) => {
    const groupedIngredients = inventory.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    sendJSON(res, 200, {
      success: true,
      data: { ingredients: groupedIngredients }
    });
  },

  // Orders
  'POST /api/orders/create': async (req, res) => {
    const user = authenticate(req);
    if (!user) {
      return sendJSON(res, 401, { success: false, message: 'Authentication required' });
    }

    const { items, deliveryAddress, contactInfo, paymentMethod } = await parseBody(req);
    
    const order = {
      id: nextOrderId++,
      orderNumber: `PZ${Date.now()}`,
      userId: user.id,
      items,
      totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      deliveryAddress,
      contactInfo,
      paymentMethod,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
      createdAt: new Date().toISOString()
    };

    orders.push(order);

    sendJSON(res, 201, {
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  },

  'GET /api/orders/my-orders': (req, res) => {
    const user = authenticate(req);
    if (!user) {
      return sendJSON(res, 401, { success: false, message: 'Authentication required' });
    }

    const userOrders = orders.filter(o => o.userId === user.id);
    
    sendJSON(res, 200, {
      success: true,
      data: { orders: userOrders }
    });
  },

  // Admin routes
  'GET /api/admin/dashboard': (req, res) => {
    const user = authenticate(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { success: false, message: 'Admin access required' });
    }

    const stats = {
      todayOrders: orders.length,
      todayRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      lowStockCount: inventory.filter(i => i.quantity <= i.threshold).length
    };

    sendJSON(res, 200, {
      success: true,
      data: { stats, recentOrders: orders.slice(-10) }
    });
  },

  'GET /api/admin/orders': (req, res) => {
    const user = authenticate(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { success: false, message: 'Admin access required' });
    }

    sendJSON(res, 200, {
      success: true,
      data: { orders }
    });
  },

  'GET /api/inventory': (req, res) => {
    const user = authenticate(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { success: false, message: 'Admin access required' });
    }

    sendJSON(res, 200, {
      success: true,
      data: { items: inventory }
    });
  }
};

// Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const pathname = parsedUrl.pathname;
  const routeKey = `${method} ${pathname}`;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // Find matching route
  const handler = routes[routeKey];
  
  if (handler) {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('Route error:', error);
      sendJSON(res, 500, { success: false, message: 'Internal server error' });
    }
  } else {
    sendJSON(res, 404, { success: false, message: 'Route not found' });
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🍕 Pizza Delivery Server running on port ${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Demo Login: admin@pizzadelivery.com / admin123`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
});

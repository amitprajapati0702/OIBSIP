# 🍕 Pizza Delivery Application

A comprehensive full-stack pizza delivery application built with React, Node.js, Express, and MongoDB. Features include user authentication, pizza customization, real-time order tracking, admin dashboard, inventory management, and automated notifications.

## ✨ Features

### 🔐 Authentication System
- **User Registration** with email verification
- **Admin & User Login** with JWT authentication
- **Forgot Password** functionality with email reset links
- **Email Verification** for new accounts
- **Role-based Access Control** (Admin/User)

### 🍕 Pizza Customization
- **5 Pizza Base Options**: Thin Crust, Thick Crust, Whole Wheat, Gluten Free, Stuffed Crust
- **5 Sauce Varieties**: Classic Tomato, Pesto, BBQ, White Sauce, Spicy Marinara
- **Multiple Cheese Types**: Mozzarella, Cheddar, Parmesan
- **Vegetable Toppings**: Bell Peppers, Mushrooms, Red Onions, Black Olives, Fresh Tomatoes
- **Meat Options**: Pepperoni, Italian Sausage, Chicken
- **Size Selection**: Small, Medium, Large
- **Customizations**: Extra Cheese, Extra Sauce, Thin Crust, Spice Level

### 💳 Payment Integration
- **Razorpay Integration** for secure payments
- **Test Mode** with dummy transactions
- **Payment Verification** with signature validation
- **Order Confirmation** after successful payment

### 📊 Admin Dashboard
- **Order Management** with status updates
- **Inventory Management** with CRUD operations
- **User Management** with activation/deactivation
- **Analytics Dashboard** with key metrics
- **Real-time Notifications** for new orders
- **Low Stock Alerts** via email

### 🔄 Real-time Features
- **Socket.io Integration** for live updates
- **Order Status Tracking** in real-time
- **Admin Notifications** for new orders
- **Automatic Email Notifications** for order updates

### 📧 Email System
- **Welcome Emails** for new registrations
- **Order Confirmations** with details
- **Status Update Notifications** for customers
- **Low Stock Alerts** for administrators
- **Critical Stock Alerts** for out-of-stock items

### 📱 Responsive Design
- **Tailwind CSS** for modern styling
- **Mobile-first** responsive design
- **Attractive UI/UX** with smooth animations
- **Toast Notifications** for user feedback

## 🛠️ Technology Stack

### Frontend
- **React 19** with Hooks
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Socket.io Client** for real-time updates
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Socket.io** for real-time communication
- **Nodemailer** for email services
- **Node-cron** for scheduled tasks
- **Express Validator** for input validation

### Security & Performance
- **Helmet** for security headers
- **Express Rate Limit** for API protection
- **CORS** configuration
- **Input Validation** and sanitization
- **Password Encryption** with bcrypt

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Gmail account for email services
- Razorpay account for payments

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pizza-delivery-application
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Environment Configuration**

Create `.env` file in the server directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/pizza-delivery

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Razorpay (Test Mode)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_test_secret_key

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=admin@pizzadelivery.com
STOCK_THRESHOLD_EMAIL=admin@pizzadelivery.com
```

5. **Seed the Database**
```bash
cd server
npm run seed
```

6. **Start the Application**

Terminal 1 (Server):
```bash
cd server
npm run dev
```

Terminal 2 (Client):
```bash
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 👤 Default Admin Credentials

After seeding the database:
- **Email**: admin@pizzadelivery.com
- **Password**: admin123

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email/:token` - Email verification
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/me` - Get current user

### Pizza & Orders
- `GET /api/pizza/ingredients` - Get all ingredients
- `POST /api/pizza/calculate-price` - Calculate pizza price
- `POST /api/orders` - Create new order
- `POST /api/orders/verify-payment` - Verify Razorpay payment
- `GET /api/orders/user` - Get user orders

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Analytics data

### Inventory
- `GET /api/inventory` - Get inventory items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

## 🔧 Configuration

### Email Setup (Gmail)
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in EMAIL_PASS

### Razorpay Setup
1. Create a Razorpay account
2. Get Test API keys
3. Add keys to environment variables

### MongoDB Setup
- Local: Install MongoDB and start service
- Cloud: Use MongoDB Atlas connection string

## 📈 Features in Detail

### Inventory Management
- **Automatic Stock Deduction** after orders
- **Low Stock Email Alerts** (hourly checks)
- **Critical Stock Alerts** (every 6 hours)
- **Threshold-based Notifications**
- **Category-wise Inventory** tracking

### Order Management
- **Order Status Flow**: Pending → Confirmed → Preparing → Baking → Ready → Out for Delivery → Delivered
- **Real-time Status Updates** via Socket.io
- **Email Notifications** for each status change
- **Order History** with detailed tracking

### Admin Features
- **Dashboard Analytics** with key metrics
- **Order Management** with status updates
- **User Management** with activation controls
- **Inventory Control** with CRUD operations
- **Real-time Notifications** for new orders

## 🎨 UI/UX Features

- **Modern Design** with Tailwind CSS
- **Responsive Layout** for all devices
- **Loading Spinners** for better UX
- **Toast Notifications** for feedback
- **Form Validation** with error messages
- **Interactive Elements** with hover effects

## 🔒 Security Features

- **JWT Authentication** with secure tokens
- **Password Hashing** with bcrypt
- **Input Validation** and sanitization
- **Rate Limiting** for API protection
- **CORS Configuration** for cross-origin requests
- **Helmet** for security headers

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly on:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
CLIENT_URL=your-production-frontend-url
```

### Deployment Platforms
- **Frontend**: Vercel, Netlify
- **Backend**: Heroku, Railway, DigitalOcean
- **Database**: MongoDB Atlas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: support@pizzadelivery.com

---

**Built with ❤️ using React, Node.js, and MongoDB**

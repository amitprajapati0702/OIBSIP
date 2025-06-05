// Optional nodemailer with fallback
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  console.warn('Nodemailer not available - email functionality disabled');
  nodemailer = null;
}

// Create transporter
const createTransporter = () => {
  if (!nodemailer) {
    throw new Error('Nodemailer not available');
  }
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    if (!nodemailer) {
      console.log('Email would be sent to:', options.to, 'Subject:', options.subject);
      return { messageId: 'mock-email-id' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `Pizza Delivery <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

// Email templates
const emailTemplates = {
  // Welcome email template
  welcome: (name, verificationUrl) => ({
    subject: 'Welcome to Pizza Delivery!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ff6b35; color: white; padding: 20px; text-align: center;">
          <h1>🍕 Welcome to Pizza Delivery!</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Hi ${name}!</h2>
          <p>Thank you for joining our pizza family! We're excited to serve you the most delicious pizzas in town.</p>
          <p>To get started, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #ff6b35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
          </div>
          <p>This verification link will expire in 24 hours.</p>
          <p>Once verified, you can:</p>
          <ul>
            <li>Browse our delicious pizza varieties</li>
            <li>Create custom pizzas with your favorite toppings</li>
            <li>Track your orders in real-time</li>
            <li>Enjoy fast and reliable delivery</li>
          </ul>
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p>© 2024 Pizza Delivery. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  // Password reset template
  passwordReset: (name, resetUrl) => ({
    subject: 'Reset Your Password - Pizza Delivery',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ff6b35; color: white; padding: 20px; text-align: center;">
          <h1>🔒 Password Reset Request</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Hi ${name}!</h2>
          <p>We received a request to reset your password for your Pizza Delivery account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #ff6b35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p><strong>Important:</strong> This link will expire in 10 minutes for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
          <p>For security reasons, we recommend:</p>
          <ul>
            <li>Using a strong, unique password</li>
            <li>Not sharing your password with anyone</li>
            <li>Logging out from shared devices</li>
          </ul>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p>© 2024 Pizza Delivery. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  // Order confirmation template
  orderConfirmation: (name, order) => ({
    subject: `Order Confirmation #${order.orderNumber} - Pizza Delivery`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
          <h1>🍕 Order Confirmed!</h1>
          <h2>Order #${order.orderNumber}</h2>
        </div>
        <div style="padding: 20px;">
          <h2>Hi ${name}!</h2>
          <p>Thank you for your order! We've received your pizza order and it's being prepared with love.</p>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
            <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDeliveryTime).toLocaleString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>

          <h3>Items Ordered:</h3>
          ${order.items.map(item => `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
              <p><strong>Custom Pizza (${item.size})</strong> - Quantity: ${item.quantity}</p>
              <p>Price: ₹${item.price}</p>
            </div>
          `).join('')}

          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Delivery Address:</strong></p>
            <p>${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.zipCode}</p>
          </div>

          <p>You can track your order status in real-time by logging into your account.</p>
          <p>We'll notify you when your order is ready for delivery!</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p>© 2024 Pizza Delivery. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  // Low stock alert template
  lowStockAlert: (items) => ({
    subject: '⚠️ Low Stock Alert - Pizza Delivery Admin',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center;">
          <h1>⚠️ Low Stock Alert</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Attention Admin!</h2>
          <p>The following items are running low in stock and need immediate attention:</p>

          <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Items Below Threshold:</h3>
            ${items.map(item => `
              <div style="border-bottom: 1px solid #f5c6cb; padding: 10px 0;">
                <p><strong>${item.name}</strong> (${item.category})</p>
                <p>Current Stock: ${item.quantity} ${item.unit}</p>
                <p>Threshold: ${item.threshold} ${item.unit}</p>
                <p style="color: #721c24;"><strong>Status: ${item.stockStatus}</strong></p>
              </div>
            `).join('')}
          </div>

          <p><strong>Action Required:</strong></p>
          <ul>
            <li>Review current inventory levels</li>
            <li>Contact suppliers for restocking</li>
            <li>Update inventory management system</li>
            <li>Consider temporarily removing items from menu if out of stock</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/admin/inventory" style="background-color: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Manage Inventory</a>
          </div>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p>© 2024 Pizza Delivery Admin Panel. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  // Order status update template
  orderStatusUpdate: (name, order, newStatus) => ({
    subject: `Order Update #${order.orderNumber} - ${newStatus}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #17a2b8; color: white; padding: 20px; text-align: center;">
          <h1>📦 Order Status Update</h1>
          <h2>Order #${order.orderNumber}</h2>
        </div>
        <div style="padding: 20px;">
          <h2>Hi ${name}!</h2>
          <p>Your order status has been updated:</p>

          <div style="background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <h3 style="color: #0c5460;">New Status: ${newStatus.toUpperCase()}</h3>
          </div>

          ${newStatus === 'out-for-delivery' ? `
            <p>🚚 Great news! Your delicious pizza is on its way to you!</p>
            <p>Expected delivery time: ${new Date(order.estimatedDeliveryTime).toLocaleString()}</p>
          ` : newStatus === 'delivered' ? `
            <p>🎉 Your order has been delivered! We hope you enjoy your delicious pizza!</p>
            <p>Thank you for choosing Pizza Delivery!</p>
          ` : `
            <p>Your order is being processed. We'll keep you updated on its progress.</p>
          `}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/orders/${order._id}" style="background-color: #17a2b8; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Track Order</a>
          </div>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p>© 2024 Pizza Delivery. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  // Critical stock alert template
  criticalStockAlert: (name, data) => ({
    subject: '🚨 CRITICAL STOCK ALERT - Immediate Action Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center;">
          <h1>🚨 CRITICAL STOCK ALERT</h1>
          <h2>OUT OF STOCK ITEMS</h2>
        </div>
        <div style="padding: 20px;">
          <h2>URGENT: Immediate Action Required!</h2>
          <p style="color: #dc3545; font-weight: bold;">The following items are completely OUT OF STOCK and need immediate restocking:</p>

          <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 5px solid #dc3545;">
            <h3 style="color: #721c24;">Items Out of Stock (${data.totalItems}):</h3>
            ${data.items.map(item => `
              <div style="border-bottom: 1px solid #f5c6cb; padding: 10px 0;">
                <p><strong style="color: #dc3545;">${item.name}</strong> (${item.category})</p>
                <p>Current Stock: <strong style="color: #dc3545;">0 ${item.unit}</strong></p>
                <p>Threshold: ${item.threshold} ${item.unit}</p>
                <p style="color: #721c24;"><strong>⚠️ COMPLETELY OUT OF STOCK</strong></p>
              </div>
            `).join('')}
          </div>

          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 5px solid #ffc107;">
            <p><strong>IMMEDIATE ACTIONS REQUIRED:</strong></p>
            <ul style="color: #856404;">
              <li><strong>Contact suppliers immediately</strong> for emergency restocking</li>
              <li><strong>Remove out-of-stock items</strong> from the menu temporarily</li>
              <li><strong>Update inventory system</strong> as soon as stock arrives</li>
              <li><strong>Consider alternative ingredients</strong> if available</li>
              <li><strong>Notify kitchen staff</strong> about unavailable items</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/admin/inventory" style="background-color: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">MANAGE INVENTORY NOW</a>
          </div>

          <p style="color: #dc3545; font-weight: bold; text-align: center;">
            This is an automated alert. Please take immediate action to prevent order fulfillment issues.
          </p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p>© 2024 Pizza Delivery Admin Panel. All rights reserved.</p>
        </div>
      </div>
    `
  })
};

// Send templated email
const sendTemplatedEmail = async (template, to, data) => {
  try {
    let emailContent;

    // Handle different template types with appropriate data structure
    switch (template) {
      case 'lowStockAlert':
        emailContent = emailTemplates[template](data.items || data);
        break;
      case 'criticalStockAlert':
        emailContent = emailTemplates[template]('Admin', data);
        break;
      case 'orderStatusUpdate':
        emailContent = emailTemplates[template](data.name || 'Customer', data.order, data.newStatus);
        break;
      case 'orderConfirmation':
        emailContent = emailTemplates[template](data.name || 'Customer', data.order || data);
        break;
      default:
        emailContent = emailTemplates[template](data.name || 'Customer', data.url || data.order || data.items || data);
    }

    await sendEmail({
      to,
      subject: emailContent.subject,
      html: emailContent.html
    });

    console.log(`${template} email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send ${template} email to ${to}:`, error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendTemplatedEmail,
  emailTemplates
};

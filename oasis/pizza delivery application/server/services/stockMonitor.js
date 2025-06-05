const cron = require('node-cron');
const Inventory = require('../models/Inventory');
const { sendTemplatedEmail } = require('../utils/email');

class StockMonitorService {
  constructor() {
    this.isRunning = false;
    this.lastNotificationTime = new Map(); // Track last notification time for each item
  }

  start() {
    if (this.isRunning) {
      console.log('Stock monitor is already running');
      return;
    }

    // Run every hour to check stock levels
    this.cronJob = cron.schedule('0 * * * *', async () => {
      await this.checkStockLevels();
    }, {
      scheduled: false
    });

    // Also run every 6 hours for critical low stock items
    this.criticalCronJob = cron.schedule('0 */6 * * *', async () => {
      await this.checkCriticalStockLevels();
    }, {
      scheduled: false
    });

    this.cronJob.start();
    this.criticalCronJob.start();
    this.isRunning = true;

    console.log('Stock monitor service started');
    
    // Run initial check
    setTimeout(() => this.checkStockLevels(), 5000);
  }

  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
    }
    if (this.criticalCronJob) {
      this.criticalCronJob.stop();
    }
    this.isRunning = false;
    console.log('Stock monitor service stopped');
  }

  async checkStockLevels() {
    try {
      console.log('Checking stock levels...');
      
      const lowStockItems = await Inventory.getLowStockItems();
      
      if (lowStockItems.length === 0) {
        console.log('All items are adequately stocked');
        return;
      }

      // Filter items that haven't been notified recently (within last 24 hours)
      const itemsToNotify = lowStockItems.filter(item => {
        const lastNotified = this.lastNotificationTime.get(item._id.toString());
        const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
        
        return !lastNotified || lastNotified < twentyFourHoursAgo;
      });

      if (itemsToNotify.length === 0) {
        console.log('No new low stock items to notify');
        return;
      }

      await this.sendLowStockNotification(itemsToNotify);
      
      // Update last notification time
      itemsToNotify.forEach(item => {
        this.lastNotificationTime.set(item._id.toString(), Date.now());
      });

    } catch (error) {
      console.error('Error checking stock levels:', error);
    }
  }

  async checkCriticalStockLevels() {
    try {
      console.log('Checking critical stock levels...');
      
      const criticalItems = await Inventory.find({
        isActive: true,
        quantity: 0
      });

      if (criticalItems.length > 0) {
        await this.sendCriticalStockNotification(criticalItems);
      }

    } catch (error) {
      console.error('Error checking critical stock levels:', error);
    }
  }

  async sendLowStockNotification(lowStockItems) {
    try {
      const adminEmail = process.env.STOCK_THRESHOLD_EMAIL || process.env.ADMIN_EMAIL;
      
      if (!adminEmail) {
        console.error('No admin email configured for stock notifications');
        return;
      }

      const itemsByCategory = lowStockItems.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});

      const emailContent = this.generateLowStockEmailContent(itemsByCategory);

      await sendTemplatedEmail('lowStockAlert', adminEmail, {
        items: lowStockItems,
        itemsByCategory,
        totalItems: lowStockItems.length,
        customContent: emailContent
      });

      console.log(`Low stock notification sent for ${lowStockItems.length} items`);

    } catch (error) {
      console.error('Error sending low stock notification:', error);
    }
  }

  async sendCriticalStockNotification(criticalItems) {
    try {
      const adminEmail = process.env.STOCK_THRESHOLD_EMAIL || process.env.ADMIN_EMAIL;
      
      if (!adminEmail) {
        console.error('No admin email configured for critical stock notifications');
        return;
      }

      await sendTemplatedEmail('criticalStockAlert', adminEmail, {
        items: criticalItems,
        totalItems: criticalItems.length
      });

      console.log(`Critical stock notification sent for ${criticalItems.length} items`);

    } catch (error) {
      console.error('Error sending critical stock notification:', error);
    }
  }

  generateLowStockEmailContent(itemsByCategory) {
    let content = '<div style="font-family: Arial, sans-serif;">';
    
    Object.entries(itemsByCategory).forEach(([category, items]) => {
      content += `
        <h3 style="color: #ff6b35; text-transform: capitalize; margin-top: 20px;">
          ${category} Items (${items.length})
        </h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item Name</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Current Stock</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Threshold</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      items.forEach(item => {
        const statusColor = item.quantity === 0 ? '#dc3545' : '#ffc107';
        const statusText = item.quantity === 0 ? 'OUT OF STOCK' : 'LOW STOCK';
        
        content += `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity} ${item.unit}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.threshold} ${item.unit}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center; color: ${statusColor}; font-weight: bold;">
              ${statusText}
            </td>
          </tr>
        `;
      });
      
      content += '</tbody></table>';
    });
    
    content += '</div>';
    return content;
  }

  // Manual trigger for testing
  async triggerStockCheck() {
    console.log('Manually triggering stock check...');
    await this.checkStockLevels();
    await this.checkCriticalStockLevels();
  }
}

module.exports = new StockMonitorService();

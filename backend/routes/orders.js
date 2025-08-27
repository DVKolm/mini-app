const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { validateTelegramData, parseTelegramInitData } = require('../middleware/telegram');

const ordersFile = path.join(__dirname, '../data/orders.json');

function loadOrders() {
  try {
    if (fs.existsSync(ordersFile)) {
      const data = fs.readFileSync(ordersFile, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
}

function saveOrders(orders) {
  try {
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Error saving orders:', error);
  }
}

function generateOrderId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

router.post('/', validateTelegramData, async (req, res) => {
  try {
    const { items, deliveryAddress, totalAmount, initData } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }
    
    if (!deliveryAddress || !deliveryAddress.trim()) {
      return res.status(400).json({ error: 'Delivery address is required' });
    }
    
    const telegramData = initData ? parseTelegramInitData(initData) : null;
    const user = req.telegramUser || (telegramData && telegramData.user) || { id: 'unknown', first_name: 'Гость' };
    
    const order = {
      id: generateOrderId(),
      userId: user.id,
      userName: `${user.first_name} ${user.last_name || ''}`.trim(),
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })),
      totalAmount: totalAmount || items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      deliveryAddress,
      status: 'pending',
      createdAt: new Date().toISOString(),
      telegramData: {
        userId: user.id,
        userName: user.username || null,
        firstName: user.first_name,
        lastName: user.last_name || null
      }
    };
    
    const orders = loadOrders();
    orders.push(order);
    saveOrders(orders);
    
    if (process.env.TELEGRAM_BOT_TOKEN) {
      try {
        await sendOrderNotification(order);
      } catch (error) {
        console.error('Failed to send Telegram notification:', error);
      }
    }
    
    res.status(201).json({ 
      success: true, 
      orderId: order.id,
      message: 'Заказ успешно создан! Мы свяжемся с вами для подтверждения.'
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.get('/', (req, res) => {
  try {
    const orders = loadOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const orders = loadOrders();
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

async function sendOrderNotification(order) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.warn('Telegram bot credentials not configured');
    return;
  }
  
  const TelegramBot = require('node-telegram-bot-api');
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
  
  const itemsList = order.items.map(item => 
    `• ${item.name} x${item.quantity} - ${item.subtotal}₽`
  ).join('\n');
  
  const message = `🛍️ НОВЫЙ ЗАКАЗ #${order.id}

👤 Клиент: ${order.userName}
📱 Telegram ID: ${order.telegramData.userId}

🛒 Товары:
${itemsList}

💰 Общая сумма: ${order.totalAmount}₽
📍 Адрес доставки: ${order.deliveryAddress}

⏰ Время заказа: ${new Date(order.createdAt).toLocaleString('ru-RU')}`;

  try {
    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    throw error;
  }
}

module.exports = router;
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

class FarmShopBot {
  constructor() {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.warn('⚠️  TELEGRAM_BOT_TOKEN not configured');
      return;
    }

    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
    this.setupCommands();
    this.setupHandlers();
  }

  setupCommands() {
    // Настройка команд бота
    const commands = [
      { command: 'start', description: '🚀 Запустить магазин' },
      { command: 'shop', description: '🛒 Открыть магазин' },
      { command: 'help', description: '❓ Помощь' },
      { command: 'contact', description: '📞 Контакты фермы' },
      { command: 'about', description: 'ℹ️ О магазине' }
    ];

    this.bot.setMyCommands(commands).catch(console.error);
  }

  setupHandlers() {
    // Обработчик команды /start
    this.bot.onText(/\/start/, (msg) => {
      this.handleStart(msg);
    });

    // Обработчик команды /shop
    this.bot.onText(/\/shop/, (msg) => {
      this.handleShop(msg);
    });

    // Обработчик команды /help
    this.bot.onText(/\/help/, (msg) => {
      this.handleHelp(msg);
    });

    // Обработчик команды /contact
    this.bot.onText(/\/contact/, (msg) => {
      this.handleContact(msg);
    });

    // Обработчик команды /about
    this.bot.onText(/\/about/, (msg) => {
      this.handleAbout(msg);
    });

    // Обработчик любых других сообщений
    this.bot.on('message', (msg) => {
      if (!msg.text || msg.text.startsWith('/')) return;
      this.handleMessage(msg);
    });

    // Обработчик callback кнопок
    this.bot.on('callback_query', (query) => {
      this.handleCallback(query);
    });
  }

  async handleStart(msg) {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'друг';

    const welcomeMessage = `🥛 Добро пожаловать в фермерский магазин, ${firstName}!

Мы предлагаем свежие молочные продукты прямо с фермы:
🧀 Натуральные сыры
🥛 Домашнее молоко  
🍰 Свежий творог
🥤 Полезные напитки

Нажмите кнопку ниже, чтобы открыть магазин!`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '🛒 Открыть магазин', web_app: { url: process.env.MINI_APP_URL || 'https://your-app.netlify.app' } }],
        [
          { text: '📞 Контакты', callback_data: 'contact' },
          { text: 'ℹ️ О нас', callback_data: 'about' }
        ]
      ]
    };

    try {
      await this.bot.sendMessage(chatId, welcomeMessage, {
        reply_markup: keyboard,
        parse_mode: 'Markdown'
      });
    } catch (error) {
      console.error('Error sending start message:', error);
    }
  }

  async handleShop(msg) {
    const chatId = msg.chat.id;

    const message = `🛒 Открываю магазин...

Выберите товары, добавьте в корзину и оформите заказ прямо в приложении!`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '🛒 Открыть магазин', web_app: { url: process.env.MINI_APP_URL || 'https://your-app.netlify.app' } }]
      ]
    };

    try {
      await this.bot.sendMessage(chatId, message, { reply_markup: keyboard });
    } catch (error) {
      console.error('Error sending shop message:', error);
    }
  }

  async handleHelp(msg) {
    const chatId = msg.chat.id;

    const helpMessage = `❓ Помощь по использованию магазина:

🛒 /shop - Открыть магазин
📞 /contact - Связаться с фермой
ℹ️ /about - Узнать о нас больше

**Как сделать заказ:**
1. Откройте магазин кнопкой "🛒 Открыть магазин"
2. Выберите товары и добавьте в корзину
3. Укажите адрес доставки
4. Оформите заказ
5. Мы свяжемся с вами для подтверждения

**Время работы:** 8:00 - 20:00
**Доставка:** по городу и области

Если у вас есть вопросы, используйте команду /contact`;

    try {
      await this.bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error sending help message:', error);
    }
  }

  async handleContact(msg) {
    const chatId = msg.chat.id;

    const contactMessage = `📞 Контакты фермерского хозяйства:

**Наша ферма:**
🏠 Адрес: Московская область, д. Молочное
📱 Телефон: +7 (999) 123-45-67
📧 Email: farm@milk-shop.ru
⏰ Время работы: 8:00 - 20:00

**Доставка:**
🚚 По городу: 200₽
🚛 По области: 300₽
📦 Бесплатно при заказе от 1500₽

**Самовывоз:**
🏪 Адрес: ул. Фермерская, 15
⏰ 9:00 - 18:00 (кроме воскресенья)

Мы всегда рады ответить на ваши вопросы!`;

    try {
      await this.bot.sendMessage(chatId, contactMessage, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error sending contact message:', error);
    }
  }

  async handleAbout(msg) {
    const chatId = msg.chat.id;

    const aboutMessage = `ℹ️ О нашем фермерском хозяйстве:

🥛 **"Фермерский магазин"** - это семейное предприятие, которое занимается производством натуральных молочных продуктов уже более 15 лет.

🐄 **Наши принципы:**
• Коровы пасутся на экологически чистых лугах
• Никаких химических добавок и консервантов
• Свежесть гарантируется ежедневными поставками
• Традиционные рецепты и современные технологии

🏆 **Наша продукция:**
🧀 Сыры собственного производства
🥛 Молоко высшего качества
🍰 Свежий творог и творожные изделия
🥤 Натуральные кисломолочные напитки

✨ **Почему выбирают нас:**
• Гарантия качества и свежести
• Быстрая доставка
• Справедливые цены от производителя
• Персональный подход к каждому клиенту

Спасибо, что выбираете натуральные продукты! 🌱`;

    try {
      await this.bot.sendMessage(chatId, aboutMessage, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error sending about message:', error);
    }
  }

  async handleMessage(msg) {
    const chatId = msg.chat.id;

    // Простые ответы на ключевые слова
    const text = msg.text.toLowerCase();

    if (text.includes('привет') || text.includes('здравствуй')) {
      await this.bot.sendMessage(chatId, `Привет! 👋 Добро пожаловать в фермерский магазин! Нажмите /start чтобы начать покупки.`);
    } else if (text.includes('цена') || text.includes('стоимость')) {
      await this.bot.sendMessage(chatId, `💰 Актуальные цены смотрите в нашем магазине! Нажмите /shop чтобы открыть каталог.`);
    } else if (text.includes('доставка')) {
      await this.bot.sendMessage(chatId, `🚚 Информация о доставке: /contact`);
    } else {
      await this.bot.sendMessage(chatId, `Спасибо за сообщение! 😊 Используйте команды меню или нажмите /help для получения помощи.`);
    }
  }

  async handleCallback(query) {
    const chatId = query.message.chat.id;
    const data = query.data;

    try {
      await this.bot.answerCallbackQuery(query.id);

      switch (data) {
        case 'contact':
          await this.handleContact({ chat: { id: chatId } });
          break;
        case 'about':
          await this.handleAbout({ chat: { id: chatId } });
          break;
        default:
          await this.bot.sendMessage(chatId, 'Неизвестная команда');
      }
    } catch (error) {
      console.error('Error handling callback:', error);
    }
  }

  // Отправка уведомления о новом заказе
  async sendOrderNotification(order) {
    if (!this.bot || !process.env.TELEGRAM_CHAT_ID) {
      console.warn('Bot or chat ID not configured for notifications');
      return;
    }

    const itemsList = order.items.map(item => 
      `• ${item.name} x${item.quantity} - ${item.subtotal}₽`
    ).join('\n');

    const message = `🛍️ НОВЫЙ ЗАКАЗ #${order.id}

👤 Клиент: ${order.userName}
📱 Telegram ID: ${order.telegramData.userId}
${order.telegramData.userName ? `📝 Username: @${order.telegramData.userName}` : ''}

🛒 Товары:
${itemsList}

💰 Общая сумма: ${order.totalAmount}₽
📍 Адрес доставки: ${order.deliveryAddress}

⏰ Время заказа: ${new Date(order.createdAt).toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow'
    })}

📞 Свяжитесь с клиентом для подтверждения заказа!`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '✅ Подтвердить', callback_data: `confirm_${order.id}` },
          { text: '❌ Отклонить', callback_data: `reject_${order.id}` }
        ],
        [{ text: '📞 Связаться', url: `tg://user?id=${order.telegramData.userId}` }]
      ]
    };

    try {
      await this.bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message, {
        reply_markup: keyboard,
        parse_mode: 'Markdown'
      });
    } catch (error) {
      console.error('Error sending order notification:', error);
      throw error;
    }
  }

  // Установка webhook
  async setWebhook(url) {
    if (!this.bot) return;

    try {
      await this.bot.setWebHook(`${url}/api/telegram/webhook`);
      console.log(`✅ Webhook set to: ${url}/api/telegram/webhook`);
    } catch (error) {
      console.error('❌ Error setting webhook:', error);
    }
  }

  // Удаление webhook (для локальной разработки)
  async deleteWebhook() {
    if (!this.bot) return;

    try {
      await this.bot.deleteWebHook();
      console.log('✅ Webhook deleted');
    } catch (error) {
      console.error('❌ Error deleting webhook:', error);
    }
  }
}

module.exports = FarmShopBot;
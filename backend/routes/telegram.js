const express = require('express');
const router = express.Router();
const { validateTelegramData, parseTelegramInitData } = require('../middleware/telegram');

router.post('/webhook', (req, res) => {
  try {
    console.log('📨 Received webhook from Telegram');
    
    // Пересылаем webhook данные в бота для обработки
    if (req.app.locals.bot && req.app.locals.bot.bot) {
      req.app.locals.bot.bot.processUpdate(req.body);
    }
    
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Эндпоинт для установки webhook
router.post('/set-webhook', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (req.app.locals.bot) {
      await req.app.locals.bot.setWebhook(url);
      res.json({ success: true, message: 'Webhook set successfully' });
    } else {
      res.status(500).json({ error: 'Bot not initialized' });
    }
  } catch (error) {
    console.error('Set webhook error:', error);
    res.status(500).json({ error: 'Failed to set webhook' });
  }
});

// Эндпоинт для удаления webhook
router.delete('/webhook', async (req, res) => {
  try {
    if (req.app.locals.bot) {
      await req.app.locals.bot.deleteWebhook();
      res.json({ success: true, message: 'Webhook deleted successfully' });
    } else {
      res.status(500).json({ error: 'Bot not initialized' });
    }
  } catch (error) {
    console.error('Delete webhook error:', error);
    res.status(500).json({ error: 'Failed to delete webhook' });
  }
});

router.post('/validate', validateTelegramData, (req, res) => {
  try {
    const { initData } = req.body;
    
    if (!initData) {
      return res.status(400).json({ error: 'initData is required' });
    }
    
    const telegramData = parseTelegramInitData(initData);
    
    if (!telegramData) {
      return res.status(400).json({ error: 'Invalid initData format' });
    }
    
    res.json({
      valid: true,
      user: telegramData.user,
      authDate: telegramData.authDate
    });
    
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: 'Validation failed' });
  }
});

router.get('/user', (req, res) => {
  try {
    const initData = req.headers['x-telegram-init-data'];
    
    if (!initData) {
      return res.status(401).json({ error: 'No Telegram data provided' });
    }
    
    const telegramData = parseTelegramInitData(initData);
    
    if (!telegramData) {
      return res.status(400).json({ error: 'Invalid Telegram data' });
    }
    
    res.json({
      user: telegramData.user,
      authDate: telegramData.authDate,
      queryId: telegramData.queryId
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

module.exports = router;
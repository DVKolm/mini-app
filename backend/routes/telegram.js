const express = require('express');
const router = express.Router();
const { validateTelegramData, parseTelegramInitData } = require('../middleware/telegram');

router.post('/webhook', (req, res) => {
  try {
    console.log('Received webhook:', JSON.stringify(req.body, null, 2));
    
    const { message, callback_query } = req.body;
    
    if (message) {
      console.log('New message:', message.text, 'from:', message.from);
    }
    
    if (callback_query) {
      console.log('Callback query:', callback_query.data, 'from:', callback_query.from);
    }
    
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
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
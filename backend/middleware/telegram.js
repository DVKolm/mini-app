const crypto = require('crypto');

function verifyTelegramWebAppData(token, initData) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  
  const dataCheckArray = [];
  for (const [key, value] of urlParams.entries()) {
    dataCheckArray.push(`${key}=${value}`);
  }
  dataCheckArray.sort();
  
  const dataCheckString = dataCheckArray.join('\n');
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
  const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  
  return calculatedHash === hash;
}

function validateTelegramData(req, res, next) {
  try {
    const initData = req.headers['x-telegram-init-data'] || req.body.initData;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      console.warn('TELEGRAM_BOT_TOKEN not configured - skipping validation in development');
      return next();
    }
    
    if (!initData) {
      return res.status(401).json({ error: 'Missing Telegram init data' });
    }
    
    if (!verifyTelegramWebAppData(botToken, initData)) {
      return res.status(401).json({ error: 'Invalid Telegram data signature' });
    }
    
    const urlParams = new URLSearchParams(initData);
    const user = JSON.parse(urlParams.get('user') || '{}');
    req.telegramUser = user;
    
    next();
  } catch (error) {
    console.error('Telegram validation error:', error);
    res.status(401).json({ error: 'Invalid Telegram data' });
  }
}

function parseTelegramInitData(initData) {
  try {
    const urlParams = new URLSearchParams(initData);
    const user = JSON.parse(urlParams.get('user') || '{}');
    const queryId = urlParams.get('query_id');
    const authDate = urlParams.get('auth_date');
    
    return {
      user,
      queryId,
      authDate: authDate ? new Date(parseInt(authDate) * 1000) : null
    };
  } catch (error) {
    console.error('Error parsing init data:', error);
    return null;
  }
}

module.exports = {
  validateTelegramData,
  verifyTelegramWebAppData,
  parseTelegramInitData
};
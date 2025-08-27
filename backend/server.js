const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const FarmShopBot = require('./bot');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.MINI_APP_URL,
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Check if origin is in allowed list or is a Netlify/Render subdomain
    if (allowedOrigins.includes(origin) || 
        origin.endsWith('.netlify.app') || 
        origin.endsWith('.render.com') ||
        origin.includes('localhost')) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Telegram-Init-Data']
};

app.use(cors(corsOptions));
app.use(express.json());

// Инициализация бота
const bot = new FarmShopBot();

// Делаем бота доступным для маршрутов
app.locals.bot = bot;

const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const telegramRoutes = require('./routes/telegram');

app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/telegram', telegramRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Telegram Farm Shop API' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
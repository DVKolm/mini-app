// Production configuration
module.exports = {
  // Environment variables that will be set on hosting platforms
  requiredEnvVars: [
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHAT_ID', 
    'MINI_APP_URL'
  ],
  
  // Default values for production
  defaults: {
    NODE_ENV: 'production',
    PORT: process.env.PORT || 10000, // Render default
  },
  
  // CORS settings for production
  cors: {
    origin: [
      process.env.MINI_APP_URL,
      process.env.FRONTEND_URL,
      'https://*.netlify.app',
      'https://*.render.com'
    ].filter(Boolean),
    credentials: true
  }
};
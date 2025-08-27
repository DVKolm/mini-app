# 🚀 Быстрый запуск Telegram Mini App

## ⚡ За 5 минут

### 1. Установка зависимостей
```bash
npm run install:all
```

### 2. Настройка окружения
Создайте файл `backend/.env`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Запуск
```bash
npm run dev
```

## 🤖 Создание Telegram бота

### BotFather
1. Найдите [@BotFather](https://t.me/botfather)
2. `/newbot` → выберите имя и username
3. Скопируйте токен в `.env`

### Mini App
1. `/newapp` в BotFather
2. Выберите бота
3. Укажите URL: `https://your-ngrok.ngrok.io` (для разработки)

### Chat ID для уведомлений
```bash
# 1. Отправьте сообщение боту
# 2. Получите updates:
curl https://api.telegram.org/bot<TOKEN>/getUpdates
# 3. Найдите chat.id и добавьте в .env
```

## 🌐 Для разработки с Telegram

### Используйте ngrok:
```bash
# В новом терминале
ngrok http 3000

# Скопируйте https URL в BotFather как Mini App URL
```

## 📱 Тестирование
1. Откройте вашего бота в Telegram
2. Нажмите кнопку Mini App или используйте меню
3. Приложение должно открыться внутри Telegram

## ✅ Что должно работать:
- ✅ Загрузка товаров
- ✅ Добавление в корзину  
- ✅ Оформление заказа
- ✅ MainButton в Telegram
- ✅ Уведомления боту о заказах

## 🆘 Проблемы?
Читайте полный [README.md](README.md) для подробных инструкций!
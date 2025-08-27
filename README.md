# 🥛 Telegram Mini App - Фермерский Магазин

Полноценная Telegram Mini App для интернет-магазина фермерской молочной продукции. Реализован с использованием современного стека: React.js + Node.js + Express.js.

## ✨ Возможности

- 🛒 **Каталог товаров** с категориями: Сыры, Молоко, Творог, Напитки
- 🛍️ **Корзина** с возможностью изменения количества
- 📱 **Интеграция с Telegram** (получение данных пользователя, MainButton, уведомления)
- 🔐 **Валидация Telegram данных** для безопасности
- 📞 **Уведомления в Telegram** о новых заказах
- 💾 **Локальное сохранение** корзины в localStorage
- 📱 **Адаптивный дизайн** для мобильных устройств
- 🎨 **Поддержка тем Telegram** (светлая/темная)

## 🛠️ Технический стек

### Frontend
- **React.js 18** - основной фреймворк
- **Telegram Web App SDK** - интеграция с Telegram
- **CSS3** - стили и анимации
- **LocalStorage** - сохранение корзины

### Backend
- **Node.js** - серверная платформа
- **Express.js** - веб-фреймворк
- **node-telegram-bot-api** - работа с Telegram Bot API
- **JSON файлы** - хранение данных (продукты, заказы)
- **Crypto** - валидация Telegram данных

## 📂 Структура проекта

```
telegram-farm-shop/
├── frontend/                    # React приложение
│   ├── src/
│   │   ├── components/         # React компоненты
│   │   │   ├── ProductCard.js  # Карточка товара
│   │   │   ├── Categories.js   # Категории товаров
│   │   │   └── Cart.js         # Корзина
│   │   ├── hooks/              # Custom hooks
│   │   │   ├── useTelegram.js  # Hook для Telegram Web App
│   │   │   └── useCart.js      # Hook для работы с корзиной
│   │   ├── utils/
│   │   │   └── api.js          # API функции
│   │   └── App.js              # Главный компонент
│   ├── public/
│   │   └── index.html          # HTML с Telegram SDK
│   └── package.json
├── backend/                     # Node.js сервер
│   ├── routes/                 # API маршруты
│   │   ├── products.js         # Товары
│   │   ├── orders.js           # Заказы
│   │   └── telegram.js         # Telegram интеграция
│   ├── models/                 # Модели данных
│   │   ├── Product.js
│   │   └── Order.js
│   ├── middleware/
│   │   └── telegram.js         # Валидация Telegram данных
│   ├── data/                   # JSON файлы с данными
│   │   ├── products.json       # Каталог товаров
│   │   └── orders.json         # Заказы
│   └── server.js               # Основной файл сервера
└── README.md                   # Документация
```

## 🚀 Быстрый старт

### 1. Клонирование и установка зависимостей

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd telegram-farm-shop

# Установка зависимостей для backend
cd backend
npm install

# Установка зависимостей для frontend
cd ../frontend
npm install
```

### 2. Настройка окружения

Создайте файл `.env` в папке `backend`:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Запуск в режиме разработки

```bash
# Запуск backend сервера (в папке backend)
npm run dev
# Или npm start для продакшн режима

# Запуск frontend (в папке frontend, в новом терминале)
npm start
```

Backend будет доступен по адресу: http://localhost:3001
Frontend будет доступен по адресу: http://localhost:3000

## 🤖 Настройка Telegram бота

### 1. Создание бота

1. Найдите [@BotFather](https://t.me/botfather) в Telegram
2. Создайте нового бота командой `/newbot`
3. Выберите имя и username для бота
4. Скопируйте токен бота

### 2. Настройка Mini App

1. Отправьте команду `/newapp` в BotFather
2. Выберите вашего бота
3. Укажите название приложения
4. Добавьте описание
5. Загрузите иконку (512x512 px)
6. Укажите URL вашего Mini App:
   - Для разработки: `https://your-ngrok-url.ngrok.io`
   - Для продакшн: `https://your-domain.com`

### 3. Получение Chat ID

Для получения уведомлений о заказах:

```bash
# 1. Отправьте любое сообщение вашему боту в Telegram
# 2. Выполните запрос:
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates

# 3. Найдите chat.id в ответе и добавьте в .env файл
```

## 🌐 Деплой

### Vercel (Frontend)

1. Установите Vercel CLI:
```bash
npm install -g vercel
```

2. В папке `frontend`:
```bash
# Сборка проекта
npm run build

# Деплой
vercel --prod
```

3. Настройте переменную окружения:
- `REACT_APP_API_URL` - URL вашего backend API

### Render/Railway (Backend)

#### Render:
1. Подключите GitHub репозиторий
2. Выберите папку `backend`
3. Настройте переменные окружения
4. Команда сборки: `npm install`
5. Команда запуска: `npm start`

#### Railway:
```bash
# Установка Railway CLI
npm install -g @railway/cli

# В папке backend
railway login
railway init
railway add # Добавить переменные окружения
railway up
```

### Docker (Опционально)

Создайте `Dockerfile` в корне проекта:

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --only=production
COPY backend/ .
EXPOSE 3001
CMD ["npm", "start"]

# Frontend Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔐 Безопасность

### Валидация Telegram данных

Приложение автоматически валидирует `initData` от Telegram:

```javascript
// backend/middleware/telegram.js
function verifyTelegramWebAppData(token, initData) {
  // Проверка подписи данных от Telegram
  // Использует HMAC-SHA256 для валидации
}
```

### Защита API

- Валидация всех входящих данных
- Проверка подписи Telegram initData
- HTTPS для всех запросов в продакшн
- CORS настройка

## 🎨 Кастомизация

### Добавление новых товаров

Отредактируйте файл `backend/data/products.json`:

```json
{
  "id": 13,
  "name": "Новый товар",
  "description": "Описание товара",
  "price": 100,
  "category": "Категория",
  "image": "https://example.com/image.jpg",
  "unit": "шт",
  "weight": "100 г",
  "inStock": true,
  "nutritionalInfo": {
    "protein": 10,
    "fat": 5,
    "carbs": 15,
    "calories": 150
  }
}
```

### Изменение стилей

Основные CSS файлы:
- `frontend/src/App.css` - главные стили
- `frontend/src/components/*.css` - стили компонентов
- `frontend/src/index.css` - глобальные стили

### Добавление новых категорий

1. Добавьте товары с новой категорией в `products.json`
2. Обновите эмодзи в `backend/routes/products.js`:

```javascript
function getCategoryEmoji(category) {
  const emojiMap = {
    'Сыры': '🧀',
    'Молоко': '🥛',
    'Новая категория': '🆕' // Добавьте новую
  };
  return emojiMap[category] || '🥛';
}
```

## 📊 API Документация

### Товары

#### GET `/api/products`
Получить все товары или по категории

Параметры:
- `category` (опционально) - фильтр по категории

#### GET `/api/products/categories`
Получить список всех категорий

#### GET `/api/products/:id`
Получить товар по ID

### Заказы

#### POST `/api/orders`
Создать новый заказ

```json
{
  "items": [
    {
      "id": 1,
      "name": "Товар",
      "price": 100,
      "quantity": 2
    }
  ],
  "deliveryAddress": "Адрес доставки",
  "totalAmount": 200,
  "initData": "telegram_init_data"
}
```

#### GET `/api/orders/:id`
Получить заказ по ID

### Telegram

#### POST `/api/telegram/validate`
Валидация Telegram данных

#### POST `/api/telegram/webhook`
Webhook для Telegram бота

## 🔧 Разработка

### Полезные команды

```bash
# Backend
npm run dev          # Запуск с nodemon
npm start           # Продакшн запуск
npm test            # Тесты

# Frontend  
npm start           # Dev сервер
npm run build       # Сборка
npm test            # Тесты
npm run eject       # Извлечение конфигурации
```

### Отладка Telegram интеграции

1. Используйте ngrok для локальной разработки:
```bash
ngrok http 3000
```

2. Включите режим разработки в Telegram:
```javascript
// В useTelegram.js добавьте:
if (process.env.NODE_ENV === 'development') {
  window.Telegram = {
    WebApp: {
      // Mock объект для тестирования
    }
  };
}
```

3. Проверьте консоль браузера на наличие ошибок

### Тестирование

```bash
# Тестирование API endpoints
curl -X GET http://localhost:3001/api/products
curl -X GET http://localhost:3001/api/products/categories

# Тестирование создания заказа
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"id":1,"name":"Test","price":100,"quantity":1}],"deliveryAddress":"Test address","totalAmount":100}'
```

## 🐛 Решение проблем

### Частые ошибки

1. **Ошибка CORS**: Убедитесь, что `FRONTEND_URL` в `.env` соответствует URL фронтенда

2. **Telegram данные не валидируются**: Проверьте `TELEGRAM_BOT_TOKEN` в `.env`

3. **Изображения не загружаются**: Проверьте HTTPS URL в `products.json`

4. **MainButton не отображается**: Убедитесь, что приложение запущено внутри Telegram

### Логи

```bash
# Backend логи
tail -f backend/logs/app.log

# Frontend ошибки - открыть DevTools в браузере
```

## 📝 Лицензия

MIT License

## 🤝 Вклад в проект

1. Fork проекта
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📞 Поддержка

Если у вас есть вопросы или проблемы:

1. Проверьте [Issues](https://github.com/your-repo/issues)
2. Создайте новый Issue с подробным описанием
3. Приложите логи и скриншоты

---

🎉 **Готово!** Теперь у вас есть полноценная Telegram Mini App для фермерского магазина!

Не забудьте:
- ⭐ Поставить звезду проекту
- 📱 Протестировать в Telegram
- 🚀 Задеплоить на сервер
- 📈 Добавить аналитику (опционально)
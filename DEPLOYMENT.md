# 🚀 Деплой инструкция

## 📋 Необходимые переменные окружения

### Backend (Render/Railway):
```env
TELEGRAM_BOT_TOKEN=8407270687:AAFymC39ms8VqrGbZ2hJKzgXbDXQq0Otqyk
TELEGRAM_CHAT_ID=781182099
MINI_APP_URL=https://your-app-name.netlify.app
NODE_ENV=production
```

### Frontend (Netlify):
```env
REACT_APP_API_URL=https://your-backend-name.render.com/api
```

## 🔧 Шаги деплоя

### 1. Backend на Render:
1. Подключить GitHub репозиторий
2. Выбрать папку: `backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Добавить переменные окружения
6. Скопировать URL backend'а

### 2. Frontend на Netlify:
1. Подключить GitHub репозиторий
2. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
3. Добавить переменную: `REACT_APP_API_URL`
4. Скопировать URL frontend'а

### 3. Обновить переменные:
1. В Render обновить `MINI_APP_URL` на URL от Netlify
2. Перезапустить backend service

### 4. Настроить webhook:
```bash
curl -X POST https://your-backend.render.com/api/telegram/set-webhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-backend.render.com"}'
```

### 5. Обновить BotFather:
```
/editapp
[Выберите ваше приложение]
Изменить URL: https://your-app-name.netlify.app
```

## ✅ Проверка работы

После деплоя проверьте:
- [ ] Backend API отвечает: https://your-backend.render.com/health
- [ ] Frontend загружается: https://your-app-name.netlify.app
- [ ] Бот отвечает на /start
- [ ] Mini App открывается в Telegram
- [ ] Заказы отправляют уведомления

## 🔄 Обновление после изменений

```bash
git add .
git commit -m "Update: описание изменений"
git push origin main
```

Netlify и Render автоматически перезапустятся!
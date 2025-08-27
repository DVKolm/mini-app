# ✅ Чеклист перед деплоем

## 🔧 Backend (Render)

### Обязательные переменные:
- [ ] `TELEGRAM_BOT_TOKEN` = `8407270687:AAFymC39ms8VqrGbZ2hJKzgXbDXQq0Otqyk`
- [ ] `TELEGRAM_CHAT_ID` = `781182099` 
- [ ] `MINI_APP_URL` = `https://your-app.netlify.app` (будет обновлен после Netlify)
- [ ] `NODE_ENV` = `production`

### Настройки Render:
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Auto-Deploy: `Yes`

## 🎨 Frontend (Netlify)

### Обязательные переменные:
- [ ] `REACT_APP_API_URL` = `https://your-backend.render.com/api`

### Настройки Netlify:
- [ ] Base directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `frontend/build`
- [ ] Auto publish: `Yes`

## 🤖 Telegram (BotFather)

### После деплоя:
- [ ] Создать Mini App: `/newapp`
- [ ] Установить URL: `https://your-app.netlify.app`
- [ ] Настроить команды: `/setcommands`
- [ ] Установить описание: `/setdescription`
- [ ] Установить Menu Button: `/setmenubutton`

### Проверка:
- [ ] `/start` - показывает кнопку Mini App
- [ ] Mini App открывается в Telegram
- [ ] Заказы отправляются в чат `781182099`

## 🔄 После деплоя

1. **Получить URLs:**
   - Backend: https://your-backend.render.com
   - Frontend: https://your-app.netlify.app

2. **Обновить переменные:**
   ```bash
   # В Render обновить MINI_APP_URL
   # В Netlify обновить REACT_APP_API_URL
   ```

3. **Установить webhook:**
   ```bash
   curl -X POST https://your-backend.render.com/api/telegram/set-webhook \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-backend.render.com"}'
   ```

4. **Проверить работу:**
   - [ ] https://your-backend.render.com/health
   - [ ] https://your-app.netlify.app
   - [ ] Telegram бот отвечает на команды
   - [ ] Mini App работает в Telegram

## 🎯 Готов к деплою!

Все файлы подготовлены, переменные окружения настроены.
Можно пушить в GitHub и деплоить! 🚀
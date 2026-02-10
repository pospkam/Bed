# 🚀 Деплой HABKAM

Руководство по развертыванию проекта на различных платформах.

## 📋 Предварительные требования

1. **Telegram Bot Token** (получить у @BotFather)
2. **Chat ID** для уведомлений
3. **GitHub аккаунт** с доступом к репозиторию

---

## 🌐 Деплой на Vercel (Рекомендуется)

### Вариант 1: Через Web интерфейс (Самый простой)

1. **Перейдите на https://vercel.com**
2. **Войдите через GitHub**
3. **Нажмите "Add New Project"**
4. **Выберите репозиторий:** `pospkam/HabKam`
5. **Framework Preset:** Next.js (определится автоматически)
6. **Настройте Environment Variables:**
   ```
   TELEGRAM_BOT_TOKEN = ваш_токен_бота
   TELEGRAM_CHAT_ID = ваш_chat_id
   NEXT_PUBLIC_SITE_URL = https://ваш-проект.vercel.app
   ```
7. **Нажмите "Deploy"**
8. **Готово!** Через 2-3 минуты сайт будет доступен

### Вариант 2: Через Vercel CLI

```bash
# Установить Vercel CLI
npm i -g vercel

# Войти в аккаунт
vercel login

# Деплой
cd HabKam
vercel

# При первом деплое ответьте на вопросы:
# Set up and deploy? → Yes
# Which scope? → Your username
# Link to existing project? → No
# What's your project's name? → kamhub
# In which directory is your code located? → ./
# Want to override the settings? → No

# Настроить переменные окружения
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID
vercel env add NEXT_PUBLIC_SITE_URL

# Production деплой
vercel --prod
```

### После деплоя на Vercel:

✅ Автоматические деплои при каждом push в `main`  
✅ Preview деплои для Pull Requests  
✅ SSL сертификат (HTTPS)  
✅ CDN для быстрой загрузки  
✅ Serverless функции для API  

**URL:** `https://kamhub.vercel.app` (или ваш кастомный домен)

---

## 🔧 Деплой на Netlify

### Через Web интерфейс:

1. **Перейдите на https://netlify.com**
2. **Войдите через GitHub**
3. **Нажмите "Add new site" → Import existing project**
4. **Выберите репозиторий:** `pospkam/HabKam`
5. **Настройки сборки:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `netlify/functions` (создайте при необходимости)
6. **Environment variables:**
   ```
   TELEGRAM_BOT_TOKEN = ваш_токен
   TELEGRAM_CHAT_ID = ваш_chat_id
   NEXT_PUBLIC_SITE_URL = https://ваш-сайт.netlify.app
   ```
7. **Deploy site**

### Через Netlify CLI:

```bash
# Установить Netlify CLI
npm install -g netlify-cli

# Войти
netlify login

# Инициализация
netlify init

# Деплой
netlify deploy --prod
```

---

## 🐳 Деплой на свой VPS/сервер

### С использованием Docker:

```bash
# Клонировать репозиторий
git clone https://github.com/pospkam/HabKam.git
cd HabKam

# Создать .env.local
cat > .env.local << EOF
TELEGRAM_BOT_TOKEN=ваш_токен
TELEGRAM_CHAT_ID=ваш_chat_id
NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru
EOF

# Собрать и запустить
docker build -t kamhub .
docker run -d -p 3000:3000 --env-file .env.local kamhub
```

### Создать Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Без Docker (PM2):

```bash
# Клонировать и установить
git clone https://github.com/pospkam/HabKam.git
cd HabKam
npm install

# Создать .env.local
nano .env.local

# Собрать
npm run build

# Установить PM2
npm install -g pm2

# Запустить
pm2 start npm --name "kamhub" -- start
pm2 save
pm2 startup
```

### Настроить Nginx:

```nginx
server {
    listen 80;
    server_name kamhub.ru www.kamhub.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔐 Настройка переменных окружения

### Получить Telegram Bot Token:

1. Найдите **@BotFather** в Telegram
2. Отправьте: `/newbot`
3. Следуйте инструкциям (придумайте имя и username)
4. Скопируйте **токен** (формат: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Получить Chat ID:

1. Отправьте любое сообщение вашему боту
2. Откройте в браузере:
   ```
   https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
   ```
3. Найдите `"chat":{"id": 123456789}`
4. Скопируйте это число

### Добавить в Vercel/Netlify:

```
TELEGRAM_BOT_TOKEN = 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID = 123456789
NEXT_PUBLIC_SITE_URL = https://ваш-сайт.vercel.app
```

---

## 🎯 Проверка после деплоя

### Тест API:

```bash
# Список туров
curl https://ваш-сайт.vercel.app/api/tours

# Доступные даты
curl https://ваш-сайт.vercel.app/api/dates/winter-fishing-kamchatka
```

### Тест бронирования:

1. Откройте сайт
2. Перейдите в "Туры"
3. Выберите тур
4. Нажмите "Забронировать"
5. Заполните форму
6. Проверьте Telegram — должно прийти уведомление

---

## 🔄 Автоматический деплой при изменениях

### Vercel (настроено автоматически):

✅ Push в `main` → деплой на production  
✅ Pull Request → preview деплой  
✅ Rollback за 1 клик  

### GitHub Actions (альтернатива):

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🎨 Кастомный домен

### На Vercel:

1. Project Settings → Domains
2. Add Domain → введите `kamhub.ru`
3. Настройте DNS у регистратора:
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```
4. Готово! SSL настроится автоматически

### На Netlify:

1. Site settings → Domain management
2. Add custom domain → введите домен
3. Настройте DNS:
   ```
   A     @     75.2.60.5
   CNAME www   ваш-сайт.netlify.app
   ```

---

## 📊 Мониторинг и аналитика

### Vercel Analytics (бесплатно):

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Google Analytics:

```typescript
// app/layout.tsx
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

---

## ❗ Troubleshooting

### Build fails:

```bash
# Локально проверить сборку
npm run build

# Очистить кэш
rm -rf .next node_modules
npm install
npm run build
```

### API не работает:

- Проверьте переменные окружения в настройках хостинга
- Убедитесь что `NEXT_PUBLIC_SITE_URL` правильный
- Проверьте логи: Vercel → Deployments → Logs

### Telegram не отправляет:

- Проверьте токен и Chat ID
- Убедитесь что отправили сообщение боту первым
- Проверьте что бот не заблокирован

---

## 🚀 Быстрый старт (TL;DR)

```bash
# 1. Форкните или клонируйте репо
git clone https://github.com/pospkam/HabKam.git

# 2. Перейдите на vercel.com
# 3. Import Project → выберите репо
# 4. Добавьте 3 переменные окружения
# 5. Deploy
# 6. Готово за 2 минуты! 🎉
```

---

## 📞 Поддержка

Если возникли проблемы:
- Email: info@kamhub.ru
- Telegram: @kamchatka_real
- GitHub Issues: https://github.com/pospkam/HabKam/issues

---

**Успешного деплоя! 🚀🎣🏔️**

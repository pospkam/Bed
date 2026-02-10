# 🚀 Инструкция по деплою HabKam

## Быстрый старт (5 минут)

### 1. Подключитесь к серверу

```bash
ssh root@185.84.163.199
```

### 2. Перейдите в директорию проекта

```bash
cd /var/www/habkam
```

Если директории нет:
```bash
git clone https://github.com/pospkam/HabKam.git /var/www/habkam
cd /var/www/habkam
```

### 3. Настройте .env

```bash
nano .env
```

Вставьте:
```env
# Database (ВАШИ ДАННЫЕ из Timeweb PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST.twc1.net:5432/default_db?sslmode=require&schema=public"

# NextAuth (сгенерируйте свой секрет: openssl rand -base64 32)
NEXTAUTH_SECRET="your_nextauth_secret_here_change_me"
NEXTAUTH_URL="http://185.84.163.199:3000"

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_CHAT_ID=your_chat_id

# Site URL
NEXT_PUBLIC_SITE_URL="http://185.84.163.199:3000"
```

Сохраните: `Ctrl+X`, `Y`, `Enter`

### 4. Запустите автоматический деплой

```bash
chmod +x scripts/deploy-timeweb.sh
bash scripts/deploy-timeweb.sh
```

**Готово!** Сайт доступен на `http://185.84.163.199:3000`

---

## 📋 Проверка после деплоя

### 1. Проверьте PM2

```bash
pm2 status
```

Должно быть:
```
┌─────┬─────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name    │ mode    │ ↺       │ status  │ cpu      │
├─────┼─────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ habkam  │ fork    │ 0       │ online  │ 0%       │
└─────┴─────────┴─────────┴─────────┴─────────┴──────────┘
```

### 2. Посмотрите логи

```bash
pm2 logs habkam --lines 50
```

Должны видеть:
```
✓ Ready in 1.2s
○ Local: http://localhost:3000
```

### 3. Проверьте сайт

Откройте в браузере:
- Главная: `http://185.84.163.199:3000`
- Туры: `http://185.84.163.199:3000/tours`
- Вход: `http://185.84.163.199:3000/login`

### 4. Проверьте вход

```
Email: partner@fishingkam.ru
Пароль: demo123456
```

После входа должны попасть на `/partner/dashboard`

---

## 🔄 Обновление после изменений

### Автоматически (рекомендуется)

```bash
cd /var/www/habkam
bash scripts/deploy-timeweb.sh
```

### Вручную

```bash
cd /var/www/habkam
git pull origin main
npm install
npm run db:generate
npm run db:push
npm run build
pm2 restart habkam
```

---

## 🐛 Troubleshooting

### Ошибка: "MODULE_NOT_FOUND"

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
pm2 restart habkam
```

### Ошибка: "Prisma Client not generated"

```bash
npm run db:generate
pm2 restart habkam
```

### Ошибка: "Database connection failed"

Проверьте DATABASE_URL в `.env`:
```bash
cat .env | grep DATABASE_URL
```

Проверьте подключение:
```bash
npm run db:push
```

### Сайт не открывается

Проверьте PM2:
```bash
pm2 status
pm2 logs habkam
```

Перезапустите:
```bash
pm2 restart habkam
```

Если не помогло:
```bash
pm2 delete habkam
cd /var/www/habkam
pm2 start npm --name "habkam" -- start
pm2 save
```

---

## 🔒 Настройка домена (опционально)

### 1. Настройте Nginx

```bash
nano /etc/nginx/sites-available/habkam.ru
```

Вставьте:
```nginx
server {
    listen 80;
    server_name habkam.ru www.habkam.ru;

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

### 2. Активируйте

```bash
ln -s /etc/nginx/sites-available/habkam.ru /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 3. Настройте SSL (Let's Encrypt)

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d habkam.ru -d www.habkam.ru
```

### 4. Обновите .env

```bash
nano .env
```

Измените:
```env
NEXTAUTH_URL="https://habkam.ru"
NEXT_PUBLIC_SITE_URL="https://habkam.ru"
```

Перезапустите:
```bash
pm2 restart habkam
```

---

## ✅ Готово!

Сайт задеплоен и работает! 🎉

**Адреса:**
- Сайт: http://185.84.163.199:3000
- Админ: http://185.84.163.199:3000/partner
- API: http://185.84.163.199:3000/api

**Учётные данные:**
```
Партнёр: partner@fishingkam.ru / demo123456
Админ: admin@habkam.ru / admin123456
```

**Документация:**
- `docs/USER_GUIDE.md` - Полное руководство
- `docs/ADMIN_PANEL.md` - API и админ-панель
- `docs/NEXTAUTH_SETUP.md` - Аутентификация

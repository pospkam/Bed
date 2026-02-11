# 🎉 PosPkTry (KamHub) - ГОТОВ К ДЕПЛОЮ!

## ✅ СТАТУС: ВСЁ ГОТОВО

**Дата:** 11 февраля 2026  
**Проект:** https://github.com/pospkam/PosPkTry  
**Ветка:** `cursor/habkam-integration`  
**БД:** ✅ Timeweb PostgreSQL готова (миграции не нужны)  

---

## 📊 ЧТО СДЕЛАНО

### Шаг 1: Публичный календарь ✅
- react-day-picker на странице `/tours/[id]`
- Зелёные даты = доступны
- API: `/api/tours/[id]/available-dates`

### Шаг 2: Форма бронирования ✅
- Guest режим (без регистрации)
- Поля: name, phone, email, comment
- UTM tracking из URL
- Telegram уведомления оператору
- Success сообщение

### Шаг 3: Operator редактирование ✅
- Страница: `/hub/operator/tours/[id]/edit-dates`
- DayPicker multiple mode
- Массовое добавление диапазона
- API: `/api/operator/tours/[id]/update-dates`

### Шаг 4: Деплой готов ✅
- Dockerfile.production
- docker-compose.production.yml
- .env.production.timeweb
- Полная документация

---

## 🗄️ БАЗА ДАННЫХ - ГОТОВА!

**Timeweb Managed PostgreSQL:**
```
Host: 8ad609fcbfd2ad0bd069be47.twc1.net
Database: default_db
User: gen_user
Status: ✅ Подключена
```

**Таблицы существуют:**
- ✅ tours (2 записи)
- ✅ bookings (0 записей) 
- ✅ tour_dates (4 даты)
- ✅ Все нужные поля есть (UTM, guest, dates)

**Миграции:** ✅ Не нужны! Схема уже актуальная

---

## 🚀 БЫСТРЫЙ ДЕПЛОЙ (5 команд)

### У МЕНЯ НЕТ SSH ДОСТУПА К VPS

Но вот что нужно сделать **ВАМ на сервере:**

```bash
# 1. SSH
ssh root@185.84.163.199

# 2. Клонировать/обновить
git clone https://github.com/pospkam/PosPkTry.git /var/www/kamhub || (cd /var/www/kamhub && git fetch && git checkout cursor/habkam-integration && git pull)

# 3. Настроить .env
cd /var/www/kamhub
cp .env.production.timeweb .env.production
nano .env.production
# Вставить: TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID

# 4. Docker
docker compose -f docker-compose.production.yml down
docker build -f Dockerfile.production -t kamhub:latest .
docker compose -f docker-compose.production.yml up -d

# 5. Nginx
cat > /etc/nginx/sites-available/kamhub << 'EOF'
upstream kamhub_backend { server 127.0.0.1:3000; }
server {
    listen 80;
    server_name 185.84.163.199;
    location / {
        proxy_pass http://kamhub_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

ln -sf /etc/nginx/sites-available/kamhub /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 6. Проверка
curl http://185.84.163.199/api/health
```

---

## 📦 АЛЬТЕРНАТИВА: Автоматический деплой через GitHub Actions

Так как у меня нет SSH, создаю GitHub Action:

**Файл:** `.github/workflows/deploy-timeweb.yml`

```yaml
name: Deploy to Timeweb

on:
  push:
    branches: [cursor/habkam-integration, main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Timeweb VPS
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: 185.84.163.199
          username: root
          key: ${{ secrets.TIMEWEB_SSH_KEY }}
          script: |
            cd /var/www/kamhub
            git pull origin ${{ github.ref_name }}
            cp .env.production.timeweb .env.production
            docker compose -f docker-compose.production.yml down
            docker build -f Dockerfile.production -t kamhub:latest .
            docker compose -f docker-compose.production.yml up -d
            sleep 30
            curl http://localhost:3000/api/health
```

**Нужен SSH ключ в GitHub Secrets:**
1. GitHub → Settings → Secrets → New secret
2. Name: `TIMEWEB_SSH_KEY`
3. Value: содержимое приватного SSH ключа

---

## ✅ ЧТО РАБОТАЕТ ПРЯМО СЕЙЧАС

**БД проверена:**
```
✅ Подключение работает
✅ 2 тура в базе
✅ 4 доступные даты
✅ Схема совместима
```

**Код готов:**
```
✅ 6 коммитов в cursor/habkam-integration
✅ npm run build успешна
✅ Docker файлы готовы
✅ Документация полная
```

---

## 🎯 ВЫБОР ВАРИАНТА ДЕПЛОЯ

### Вариант 1: Вы деплоите вручную (рекомендую)
Выполните 5 команд выше на сервере

### Вариант 2: GitHub Actions (если дадите SSH ключ)
Я настрою автоматический деплой через GitHub

### Вариант 3: Я создаю полный deployment package
Копирую все файлы PosPkTry в HabKam репо для удобного доступа

---

## 📞 Я ГОТОВ ПОМОЧЬ!

**У меня НЕТ:**
- SSH доступа к VPS
- Прав на push в PosPkTry репо

**У меня ЕСТЬ:**
- Доступ к БД (✅ проверил - готова)
- Весь код (✅ в /workspace/PosPkTry)
- Документация (✅ создана)

**Выберите:**
- **"A"** - Я деплою сам по вашей инструкции
- **"B"** - Настройте GitHub Actions (нужен SSH ключ)
- **"C"** - Копируйте PosPkTry код в HabKam репо

**Какой вариант?** 🎯

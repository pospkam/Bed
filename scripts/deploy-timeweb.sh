#!/bin/bash

# ============================================
# HabKam - Скрипт деплоя на Timeweb VPS
# ============================================

set -e  # Остановка при ошибке

echo "🚀 Начинаю деплой HabKam на Timeweb VPS..."
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Переменные
PROJECT_DIR="/var/www/habkam"
BRANCH="main"

# Проверка, что мы на сервере
if [ ! -d "$PROJECT_DIR" ]; then
  echo -e "${RED}❌ Директория $PROJECT_DIR не найдена!${NC}"
  echo "Сначала нужно клонировать репозиторий:"
  echo "  git clone https://github.com/pospkam/HabKam.git $PROJECT_DIR"
  exit 1
fi

cd $PROJECT_DIR

# 1. Получаем последние изменения
echo -e "${YELLOW}📥 Получаю последние изменения из GitHub...${NC}"
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH
echo -e "${GREEN}✅ Код обновлён${NC}"
echo ""

# 2. Проверяем .env
if [ ! -f ".env" ]; then
  echo -e "${RED}❌ Файл .env не найден!${NC}"
  echo "Создайте файл .env на основе .env.example:"
  echo "  cp .env.example .env"
  echo "  nano .env"
  echo ""
  echo "Необходимые переменные:"
  echo "  - DATABASE_URL"
  echo "  - NEXTAUTH_SECRET"
  echo "  - NEXTAUTH_URL"
  echo "  - TELEGRAM_BOT_TOKEN"
  echo "  - TELEGRAM_CHAT_ID"
  exit 1
fi
echo -e "${GREEN}✅ Файл .env найден${NC}"
echo ""

# 3. Устанавливаем зависимости
echo -e "${YELLOW}📦 Устанавливаю зависимости...${NC}"
npm ci --production=false
echo -e "${GREEN}✅ Зависимости установлены${NC}"
echo ""

# 4. Генерируем Prisma Client
echo -e "${YELLOW}🔧 Генерирую Prisma Client...${NC}"
npm run db:generate
echo -e "${GREEN}✅ Prisma Client сгенерирован${NC}"
echo ""

# 5. Применяем миграции (опционально, если используете)
# echo -e "${YELLOW}🗄️  Применяю миграции БД...${NC}"
# npm run db:migrate
# echo -e "${GREEN}✅ Миграции применены${NC}"
# echo ""

# 6. Применяем schema (для db push)
echo -e "${YELLOW}🗄️  Синхронизирую схему БД...${NC}"
npm run db:push
echo -e "${GREEN}✅ Схема БД обновлена${NC}"
echo ""

# 7. Собираем проект
echo -e "${YELLOW}🏗️  Собираю проект...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Ошибка сборки!${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Проект собран${NC}"
echo ""

# 8. Перезапускаем PM2
echo -e "${YELLOW}🔄 Перезапускаю PM2...${NC}"
if pm2 list | grep -q "habkam"; then
  pm2 restart habkam
else
  pm2 start npm --name "habkam" -- start
  pm2 save
fi
echo -e "${GREEN}✅ PM2 перезапущен${NC}"
echo ""

# 9. Статус
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Деплой завершён успешно!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo "Проверьте статус:"
echo "  pm2 status"
echo "  pm2 logs habkam"
echo ""
echo "Сайт доступен по адресу:"
echo "  http://185.84.163.199:3000"
echo ""

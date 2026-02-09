#!/bin/bash

###############################################################################
# KAMHUB - Скрипт обновления на Timeweb Cloud
# Быстрое обновление проекта с GitHub
###############################################################################

set -e

# Цвета
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║           KAMHUB - Обновление проекта                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Проверка директории
if [ ! -d "/var/www/HabKam" ]; then
    log_error "Проект не найден в /var/www/HabKam"
    exit 1
fi

cd /var/www/HabKam

# Остановка приложения
log_info "Остановка приложения..."
pm2 stop kamhub > /dev/null 2>&1 || true
log_success "Приложение остановлено"

# Сохранение .env.local
log_info "Сохранение конфигурации..."
if [ -f .env.local ]; then
    cp .env.local /tmp/.env.local.backup
fi

# Получение обновлений
log_info "Получение последних изменений..."
git stash > /dev/null 2>&1 || true
git pull origin main
log_success "Код обновлён"

# Восстановление .env.local
if [ -f /tmp/.env.local.backup ]; then
    mv /tmp/.env.local.backup .env.local
fi

# Обновление зависимостей
log_info "Проверка зависимостей..."
npm install --production > /dev/null 2>&1
log_success "Зависимости обновлены"

# Пересборка
log_info "Пересборка проекта..."
npm run build > /dev/null 2>&1
log_success "Проект пересобран"

# Запуск
log_info "Запуск приложения..."
pm2 restart kamhub > /dev/null 2>&1
log_success "Приложение запущено"

echo ""
log_success "✅ Обновление завершено!"
echo ""
echo "Проверьте статус:"
echo "  pm2 status"
echo "  pm2 logs kamhub --lines 20"
echo ""

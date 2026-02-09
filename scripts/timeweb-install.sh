#!/bin/bash

###############################################################################
# KAMHUB - Автоматическая установка на Timeweb Cloud
# Скрипт для быстрого развертывания Next.js приложения на Ubuntu 22.04
###############################################################################

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Логирование
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка root прав
if [ "$EUID" -ne 0 ]; then 
    log_error "Запустите скрипт с правами root: sudo bash install.sh"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║          KAMHUB - Установка на Timeweb Cloud              ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Шаг 1: Обновление системы
log_info "Шаг 1/10: Обновление системы..."
apt update -qq > /dev/null 2>&1
apt upgrade -y -qq > /dev/null 2>&1
log_success "Система обновлена"

# Шаг 2: Установка необходимых пакетов
log_info "Шаг 2/10: Установка базовых пакетов..."
apt install -y -qq curl wget git build-essential > /dev/null 2>&1
log_success "Базовые пакеты установлены"

# Шаг 3: Установка Node.js 18
log_info "Шаг 3/10: Установка Node.js 18..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - > /dev/null 2>&1
    apt install -y nodejs > /dev/null 2>&1
fi
NODE_VERSION=$(node --version)
log_success "Node.js установлен: $NODE_VERSION"

# Шаг 4: Установка PM2
log_info "Шаг 4/10: Установка PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2 > /dev/null 2>&1
fi
log_success "PM2 установлен"

# Шаг 5: Установка Nginx
log_info "Шаг 5/10: Установка Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx > /dev/null 2>&1
fi
systemctl enable nginx > /dev/null 2>&1
systemctl start nginx > /dev/null 2>&1
log_success "Nginx установлен и запущен"

# Шаг 6: Клонирование репозитория
log_info "Шаг 6/10: Клонирование проекта..."
mkdir -p /var/www
cd /var/www

if [ -d "HabKam" ]; then
    log_warning "Директория HabKam уже существует, обновляем..."
    cd HabKam
    git pull origin main > /dev/null 2>&1
else
    git clone https://github.com/pospkam/HabKam.git > /dev/null 2>&1
    cd HabKam
fi
log_success "Проект клонирован/обновлён"

# Шаг 7: Настройка переменных окружения
log_info "Шаг 7/10: Настройка переменных окружения..."
if [ ! -f .env.local ]; then
    echo ""
    log_warning "Необходимо настроить Telegram интеграцию"
    echo ""
    read -p "Введите Telegram Bot Token: " BOT_TOKEN
    read -p "Введите Telegram Chat ID: " CHAT_ID
    read -p "Введите домен или IP (например: http://123.456.78.90): " SITE_URL
    
    cat > .env.local << EOF
# Telegram Bot
TELEGRAM_BOT_TOKEN=$BOT_TOKEN
TELEGRAM_CHAT_ID=$CHAT_ID

# Application URL
NEXT_PUBLIC_SITE_URL=$SITE_URL
EOF
    log_success ".env.local создан"
else
    log_warning ".env.local уже существует, пропускаем"
fi

# Шаг 8: Установка зависимостей и сборка
log_info "Шаг 8/10: Установка зависимостей..."
npm install --production > /dev/null 2>&1
log_success "Зависимости установлены"

log_info "Сборка проекта (может занять 1-3 минуты)..."
npm run build > /dev/null 2>&1
log_success "Проект собран"

# Шаг 9: Запуск с PM2
log_info "Шаг 9/10: Запуск приложения..."
pm2 delete kamhub > /dev/null 2>&1 || true
pm2 start npm --name "kamhub" -- start > /dev/null 2>&1
pm2 startup systemd -u root --hp /root > /dev/null 2>&1 || true
pm2 save > /dev/null 2>&1
log_success "Приложение запущено с PM2"

# Шаг 10: Настройка Nginx
log_info "Шаг 10/10: Настройка Nginx..."

# Получаем IP сервера
SERVER_IP=$(curl -s ifconfig.me)

cat > /etc/nginx/sites-available/kamhub << 'EOF'
server {
    listen 80;
    listen [::]:80;
    
    server_name _;

    access_log /var/log/nginx/kamhub-access.log;
    error_log /var/log/nginx/kamhub-error.log;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        alias /var/www/HabKam/.next/static;
        expires 365d;
        access_log off;
    }

    location /images {
        alias /var/www/HabKam/public/images;
        expires 30d;
        access_log off;
    }
}
EOF

ln -sf /etc/nginx/sites-available/kamhub /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t > /dev/null 2>&1
systemctl reload nginx > /dev/null 2>&1
log_success "Nginx настроен"

# Финальная проверка
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║                  ✅ УСТАНОВКА ЗАВЕРШЕНА!                   ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

log_success "KAMHUB успешно установлен!"
echo ""
echo "📊 Информация о системе:"
echo "   • Node.js: $NODE_VERSION"
echo "   • PM2: $(pm2 --version)"
echo "   • Nginx: $(nginx -v 2>&1 | cut -d'/' -f2)"
echo ""
echo "🌐 Доступ к сайту:"
echo "   • IP адрес: http://$SERVER_IP"
echo "   • Локально: http://localhost"
echo ""
echo "🔧 Полезные команды:"
echo "   • pm2 status          - статус приложения"
echo "   • pm2 logs kamhub     - логи приложения"
echo "   • pm2 restart kamhub  - перезапуск"
echo "   • nginx -t            - проверка конфига Nginx"
echo ""
echo "📚 Документация:"
echo "   • https://github.com/pospkam/HabKam/blob/main/TIMEWEB_DEPLOY.md"
echo ""
echo "🎯 Следующие шаги:"
echo "   1. Откройте http://$SERVER_IP в браузере"
echo "   2. Протестируйте бронирование тура"
echo "   3. Проверьте Telegram уведомление"
echo "   4. Настройте домен (опционально)"
echo "   5. Установите SSL (опционально)"
echo ""

log_info "Для настройки домена и SSL смотрите: TIMEWEB_DEPLOY.md"
echo ""

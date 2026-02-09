#!/bin/bash

###############################################################################
# KAMHUB - Установка SSL сертификата
# Автоматическая настройка Let's Encrypt на Timeweb Cloud
###############################################################################

set -e

# Цвета
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка root
if [ "$EUID" -ne 0 ]; then 
    log_error "Запустите с правами root: sudo bash ssl-setup.sh"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║           KAMHUB - Установка SSL сертификата               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Запрос домена
read -p "Введите ваш домен (например: kamhub.ru): " DOMAIN
read -p "Добавить www поддомен? (y/n): " ADD_WWW

if [ "$ADD_WWW" = "y" ]; then
    DOMAINS="-d $DOMAIN -d www.$DOMAIN"
else
    DOMAINS="-d $DOMAIN"
fi

# Запрос email
read -p "Введите email для уведомлений: " EMAIL

# Установка Certbot
log_info "Установка Certbot..."
apt update -qq > /dev/null 2>&1
apt install -y certbot python3-certbot-nginx > /dev/null 2>&1
log_success "Certbot установлен"

# Обновление Nginx конфига с доменом
log_info "Обновление конфигурации Nginx..."
sed -i "s/server_name _;/server_name $DOMAIN www.$DOMAIN;/" /etc/nginx/sites-available/kamhub
nginx -t > /dev/null 2>&1
systemctl reload nginx > /dev/null 2>&1
log_success "Nginx настроен на домен"

# Получение сертификата
log_info "Получение SSL сертификата..."
certbot --nginx $DOMAINS --email $EMAIL --agree-tos --redirect --non-interactive

if [ $? -eq 0 ]; then
    log_success "SSL сертификат успешно установлен!"
    
    # Настройка автопродления
    echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
    log_success "Автопродление настроено"
    
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                  ✅ SSL НАСТРОЕН!                          ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "🌐 Ваш сайт теперь доступен по HTTPS:"
    echo "   • https://$DOMAIN"
    if [ "$ADD_WWW" = "y" ]; then
        echo "   • https://www.$DOMAIN"
    fi
    echo ""
    echo "🔒 Сертификат действителен 90 дней"
    echo "📅 Автоматическое продление настроено"
    echo ""
    echo "Проверьте работу:"
    echo "  curl -I https://$DOMAIN"
    echo ""
else
    log_error "Ошибка при получении сертификата"
    echo ""
    echo "Возможные причины:"
    echo "  1. Домен не направлен на этот сервер"
    echo "  2. DNS записи ещё не применились (подождите 2-4 часа)"
    echo "  3. Порты 80/443 закрыты файрволом"
    echo ""
    echo "Проверьте DNS:"
    echo "  nslookup $DOMAIN"
    echo ""
    exit 1
fi

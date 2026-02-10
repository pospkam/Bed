# 🔬 ПОДРОБНЕЙШИЙ АНАЛИЗ PosPkTry (KamHub)

## 📋 Метаданные проекта

**Репозиторий:** https://github.com/pospkam/PosPkTry  
**Размер:** 41.4 MB (41,424 KB)  
**Название:** Kamchatour Hub (KamHub)  
**Создан:** 6 февраля 2026  
**Последний push:** 6 февраля 2026  
**Основная ветка:** main  
**Статус:** Production Ready  

---

## 🏗️ АРХИТЕКТУРА СИСТЕМЫ

### Концепция

**KamHub** - это **единая экосистемная платформа** для туризма на Камчатке, объединяющая:
- 👤 Туристов
- 🎣 Туроператоров  
- 🥾 Гидов
- 🚗 Трансферных операторов
- 💼 Агентов/посредников
- 🏨 Поставщиков размещения
- 🎒 Поставщиков снаряжения
- 🎁 Продавцов сувениров
- 🚙 Прокат автомобилей
- 👨‍💼 Администраторов

### Архитектурный подход

```
┌─────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                     │
│  Next.js 15.5 App Router (91 страница)                 │
│  - 15 роль-специфичных dashboards                       │
│  - AI виджеты (Groq, DeepSeek)                          │
│  - Погодные виджеты (Яндекс)                            │
│  - Интерактивные карты (Яндекс)                         │
│  - Responsive UI (Samsung Weather стиль)                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    API LAYER                            │
│  215 API Routes (REST-подобный)                         │
│  - 8 групп по ролям                                     │
│  - AI сервисы (5 endpoints)                             │
│  - Интеграции (Weather, Maps, Payments)                │
│  - Webhooks (CloudPayments, Telegram)                   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                 BUSINESS LOGIC LAYER                    │
│  lib/ (86 файлов TypeScript)                            │
│  - AI (role-assistants, prompts)                        │
│  - Auth (JWT, role-based)                               │
│  - Payments (CloudPayments)                             │
│  - Weather (Yandex API)                                 │
│  - Maps (Yandex Maps)                                   │
│  - Notifications (Email, Telegram)                      │
│  - Loyalty (Eco-points)                                 │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  DATA LAYER                             │
│  PostgreSQL + PostGIS                                   │
│  - 30+ таблиц                                           │
│  - 16 миграций                                          │
│  - Геоданные (coordinates, PostGIS)                     │
│  - JSONB для гибкости                                   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                          │
│  - Groq AI (Llama 3.1) - AI ассистент                  │
│  - DeepSeek AI - Альтернативный AI                     │
│  - Яндекс Weather API - Прогноз погоды                 │
│  - Яндекс Maps API - Карты и геокодинг                 │
│  - CloudPayments - Платёжный шлюз                      │
│  - AWS S3 - Хранение файлов                            │
│  - Nodemailer - Email рассылки                         │
│  - Sentry - Мониторинг ошибок                          │
│  - Telegram Bot API - Уведомления                      │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 ДЕТАЛЬНАЯ СТАТИСТИКА

### Размеры и количество

| Метрика | Значение | Детали |
|---------|----------|--------|
| **Общий размер** | 41.4 MB | GitHub repo size |
| **TypeScript код** | 3.6 MB | 89% от кода |
| **SQL код** | 247 KB | 6% (PLpgSQL) |
| **CSS** | 181 KB | 4% |
| **TypeScript файлов** | 619 | .ts + .tsx |
| **API routes** | 215 | route.ts файлов |
| **Компонентов** | 108 | .tsx в components/ |
| **Страниц** | 91 | Успешно собираются |
| **Документов** | 161 | В docs/ |
| **Миграций БД** | 16 | SQL миграции |
| **Тестов** | 50+ | Unit + Integration + E2E |
| **Строк кода** | ~50,000+ | Оценка |

### Распределение по языкам

```
TypeScript:  3,805,634 bytes  (89.0%)  ████████████████████
PLpgSQL:       252,931 bytes  (5.9%)   ██
CSS:           185,546 bytes  (4.3%)   █
Shell:          39,404 bytes  (0.9%)   
JavaScript:     31,264 bytes  (0.7%)   
HTML:           13,098 bytes  (0.3%)   
Dockerfile:      1,266 bytes  (0.0%)   
```

---

## 🗄️ БАЗА ДАННЫХ (PostgreSQL + PostGIS)

### Расширения PostgreSQL

```sql
CREATE EXTENSION "uuid-ossp";    -- UUID генерация
CREATE EXTENSION "postgis";      -- Геоданные
```

### Основные таблицы (30+)

#### 1. **Пользователи и роли**

```sql
users (8 ролей)
├─ id UUID
├─ email VARCHAR(255) UNIQUE
├─ name VARCHAR(255)
├─ password_hash VARCHAR(255)
├─ role VARCHAR(50) CHECK IN:
│    ('tourist', 'operator', 'guide', 'transfer',
│     'stay', 'gear', 'agent', 'admin')
├─ preferences JSONB
└─ created_at, updated_at

partners (9 категорий)
├─ id UUID
├─ user_id UUID → users
├─ name VARCHAR(255)
├─ category VARCHAR(50) CHECK IN:
│    ('operator', 'guide', 'transfer', 'stay',
│     'gear', 'agent', 'souvenir', 'cars', 'restaurant')
├─ description TEXT
├─ contact JSONB
├─ rating DECIMAL(3,2)
├─ review_count INTEGER
├─ is_verified BOOLEAN
└─ logo_asset_id UUID
```

#### 2. **Туры и активности**

```sql
tours
├─ id UUID
├─ name VARCHAR(255)
├─ description TEXT
├─ short_description TEXT
├─ category VARCHAR(50)
├─ difficulty VARCHAR(20) CHECK ('easy', 'medium', 'hard')
├─ duration INTEGER  -- часы
├─ price DECIMAL(10,2)
├─ currency VARCHAR(3) DEFAULT 'RUB'
├─ season JSONB  -- массив сезонов
├─ coordinates JSONB  -- массив точек GPS
├─ requirements JSONB
├─ included JSONB
├─ not_included JSONB
├─ operator_id UUID → partners
├─ guide_id UUID → partners
├─ max_group_size, min_group_size INTEGER
├─ rating DECIMAL(3,2)
├─ review_count INTEGER
└─ is_active BOOLEAN

activities (старая совместимость)
├─ id UUID
├─ key TEXT UNIQUE
├─ title TEXT
├─ icon_bytes BYTEA  -- бинарные данные иконок
├─ icon_mime TEXT
└─ icon_sha256, icon_url
```

#### 3. **Медиа и ассеты**

```sql
assets
├─ id UUID
├─ url TEXT
├─ mime_type VARCHAR(100)
├─ sha256 VARCHAR(64) UNIQUE  -- дедупликация
├─ size BIGINT
├─ width, height INTEGER
└─ alt TEXT

tour_assets (many-to-many)
├─ tour_id UUID → tours
└─ asset_id UUID → assets

partner_assets
├─ partner_id UUID → partners
└─ asset_id UUID → assets

review_assets
├─ review_id UUID → reviews
└─ asset_id UUID → assets
```

#### 4. **Бронирования**

```sql
bookings
├─ id UUID
├─ user_id UUID → users
├─ tour_id UUID → tours
├─ date DATE
├─ start_date DATE
├─ participants INTEGER
├─ guests_count INTEGER
├─ total_price DECIMAL(10,2)
├─ status CHECK ('pending', 'confirmed', 'cancelled', 'completed')
├─ payment_status CHECK ('pending', 'paid', 'refunded')
├─ special_requests TEXT
└─ created_at, updated_at
```

#### 5. **Отзывы**

```sql
reviews
├─ id UUID
├─ user_id UUID → users
├─ tour_id UUID → tours
├─ rating INTEGER CHECK (1-5)
├─ comment TEXT
├─ is_verified BOOLEAN
├─ operator_reply TEXT
├─ operator_reply_at TIMESTAMPTZ
└─ created_at, updated_at
```

#### 6. **Eco-Points система**

```sql
eco_points (локации)
├─ id UUID
├─ name VARCHAR(255)
├─ description TEXT
├─ coordinates JSONB  -- {lat, lng, address, name}
├─ category CHECK ('recycling', 'cleaning', 'conservation', 'education')
├─ points INTEGER
└─ is_active BOOLEAN

user_eco_points
├─ user_id UUID PRIMARY KEY
├─ total_points INTEGER
├─ level INTEGER
└─ last_activity TIMESTAMPTZ

eco_achievements
├─ id UUID
├─ name, description
└─ points INTEGER

user_achievements
├─ user_id UUID
├─ achievement_id UUID
└─ unlocked_at TIMESTAMPTZ

user_eco_activities (история)
├─ id UUID
├─ user_id UUID
├─ points INTEGER
├─ activity VARCHAR(255)
└─ eco_point_id UUID
```

#### 7. **Гиды**

```sql
guide_schedule
├─ id UUID
├─ guide_id UUID → users
├─ tour_id UUID → tours
├─ tour_date DATE
├─ start_time, end_time TIME
├─ meeting_point VARCHAR(500)
├─ participants_count INTEGER
└─ status, notes

guide_earnings
├─ id UUID
├─ guide_id UUID
├─ booking_id UUID
├─ amount DECIMAL(10,2)
├─ currency VARCHAR(3)
├─ payout_status
└─ payout_date

guide_groups
├─ id UUID
├─ guide_id UUID
├─ schedule_id UUID
├─ group_name VARCHAR(255)
└─ participants JSONB[]
```

#### 8. **Трансферы**

```sql
transfer_vehicles
├─ id UUID
├─ operator_id UUID → partners
├─ vehicle_type CHECK ('car', 'minibus', 'bus', 'helicopter')
├─ brand, model VARCHAR(100)
├─ capacity INTEGER
├─ license_plate VARCHAR(20) UNIQUE
├─ features JSONB
└─ is_active BOOLEAN

transfer_drivers
├─ id UUID
├─ operator_id UUID
├─ full_name VARCHAR(255)
├─ license_number VARCHAR(50)
├─ phone VARCHAR(20)
└─ is_active BOOLEAN

transfer_routes
├─ id UUID
├─ from_point VARCHAR(255)
├─ to_point VARCHAR(255)
├─ distance DECIMAL(10,2)
├─ duration INTEGER
└─ price_per_person DECIMAL(10,2)

transfer_bookings
├─ id UUID
├─ user_id UUID
├─ route_id UUID
├─ vehicle_id UUID
├─ driver_id UUID
├─ pickup_time TIMESTAMPTZ
├─ passengers INTEGER
└─ status, payment_status

transfer_schedules
├─ id UUID
├─ route_id UUID
├─ vehicle_id UUID
├─ driver_id UUID
├─ departure_time TIME
└─ available_seats INTEGER
```

#### 9. **Агенты и комиссии**

```sql
agent_clients
├─ id UUID
├─ agent_id UUID → partners
├─ name VARCHAR(255)
├─ contact JSONB
└─ total_bookings INTEGER

agent_vouchers
├─ id UUID
├─ agent_id UUID
├─ code VARCHAR(20) UNIQUE
├─ discount_percent DECIMAL(5,2)
├─ expires_at DATE
└─ is_active BOOLEAN

agent_commissions
├─ id UUID
├─ agent_id UUID
├─ booking_id UUID
├─ amount DECIMAL(10,2)
├─ status CHECK ('pending', 'approved', 'paid')
└─ paid_at TIMESTAMPTZ

agent_payouts
├─ id UUID
├─ agent_id UUID
├─ amount DECIMAL(10,2)
├─ method VARCHAR(50)
└─ status, created_at
```

#### 10. **Размещение**

```sql
accommodations
├─ id UUID
├─ provider_id UUID → partners
├─ name VARCHAR(255)
├─ type CHECK ('hotel', 'hostel', 'apartment', 'guesthouse')
├─ address TEXT
├─ coordinates JSONB
├─ amenities JSONB
├─ rooms JSONB[]
├─ price_per_night DECIMAL(10,2)
└─ is_active BOOLEAN

accommodation_bookings
├─ id UUID
├─ user_id UUID
├─ accommodation_id UUID
├─ check_in, check_out DATE
├─ guests INTEGER
└─ total_price, status
```

#### 11. **Снаряжение**

```sql
gear_items
├─ id UUID
├─ provider_id UUID → partners
├─ name VARCHAR(255)
├─ category VARCHAR(50)
├─ price_per_day DECIMAL(10,2)
├─ quantity_available INTEGER
└─ condition VARCHAR(20)

gear_rentals
├─ id UUID
├─ user_id UUID
├─ gear_id UUID
├─ rental_date, return_date DATE
├─ total_price DECIMAL(10,2)
└─ status, deposit_amount
```

#### 12. **Автомобили**

```sql
cars
├─ id UUID
├─ provider_id UUID
├─ brand, model VARCHAR(100)
├─ year INTEGER
├─ transmission CHECK ('auto', 'manual')
├─ fuel_type VARCHAR(20)
├─ price_per_day DECIMAL(10,2)
└─ features JSONB

car_rentals
├─ id UUID
├─ user_id UUID
├─ car_id UUID
├─ pickup_date, return_date DATE
└─ total_price, status
```

#### 13. **Сувениры**

```sql
souvenirs
├─ id UUID
├─ shop_id UUID → partners
├─ name VARCHAR(255)
├─ category VARCHAR(50)
├─ price DECIMAL(10,2)
├─ stock INTEGER
└─ is_available BOOLEAN

souvenir_orders
├─ id UUID
├─ user_id UUID
├─ items JSONB[]
├─ total_amount DECIMAL(10,2)
└─ delivery_address, status
```

#### 14. **Поддержка**

```sql
support_tickets
├─ id UUID
├─ user_id UUID
├─ subject VARCHAR(255)
├─ description TEXT
├─ priority CHECK ('low', 'medium', 'high', 'urgent')
├─ status CHECK ('open', 'in_progress', 'resolved', 'closed')
└─ assigned_to UUID

support_messages
├─ id UUID
├─ ticket_id UUID
├─ author_id UUID
├─ message TEXT
└─ created_at
```

#### 15. **Уведомления**

```sql
notifications
├─ id UUID
├─ user_id UUID
├─ type VARCHAR(50)
├─ title VARCHAR(255)
├─ message TEXT
├─ data JSONB
├─ is_read BOOLEAN
└─ created_at
```

#### 16. **Wishlist (избранное)**

```sql
wishlist
├─ id UUID
├─ user_id UUID
└─ created_at

wishlist_items
├─ wishlist_id UUID
├─ tour_id UUID
└─ added_at
```

### Итого таблиц: **30+ основных таблиц**

---

## 🔌 API ENDPOINTS (215 штук!)

### Группировка по функционалу

#### AUTH (7 endpoints)
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/signin
POST   /api/auth/signup
POST   /api/auth/signout
GET    /api/auth/me
POST   /api/auth/demo
```

#### DISCOVERY - Публичный каталог (8)
```
GET    /api/discovery/tours
GET    /api/discovery/tours/[id]
GET    /api/discovery/tours/[id]/stats
POST   /api/discovery/tours/[id]/publish
POST   /api/discovery/search
POST   /api/discovery/search/recommendations
GET    /api/discovery/reviews
GET    /api/discovery/reviews/[id]
```

#### BOOKINGS - Бронирования (10)
```
GET    /api/bookings
POST   /api/bookings
GET    /api/bookings/my
GET    /api/bookings/[id]
PUT    /api/bookings/[id]
DELETE /api/bookings/[id]
POST   /api/bookings/[id]/cancel
GET    /api/bookings/availability
GET    /api/bookings/availability/calendar
POST   /api/bookings/payments
POST   /api/bookings/payments/[id]/refund
```

#### OPERATOR - CRM туроператора (18)
```
GET    /api/operator/dashboard
GET    /api/operator/profile
PUT    /api/operator/profile
GET    /api/operator/profile/settings

GET    /api/operator/tours
POST   /api/operator/tours
GET    /api/operator/tours/[id]
PUT    /api/operator/tours/[id]
DELETE /api/operator/tours/[id]
POST   /api/operator/tours/[id]/publish
POST   /api/operator/tours/[id]/deactivate
GET    /api/operator/tours/schedules

GET    /api/operator/tours/[id]/photos
POST   /api/operator/tours/[id]/photos
DELETE /api/operator/tours/[id]/photos/[photoId]

GET    /api/operator/bookings
GET    /api/operator/bookings/[id]
PUT    /api/operator/bookings/[id]

GET    /api/operator/calendar
POST   /api/operator/calendar/block

GET    /api/operator/reviews
GET    /api/operator/reviews/stats
POST   /api/operator/reviews/[id]/reply

GET    /api/operator/messages

GET    /api/operator/stats
GET    /api/operator/analytics/dashboard
GET    /api/operator/finance
GET    /api/operator/reports/revenue
GET    /api/operator/reports/bookings

GET    /api/operator/templates
```

#### GUIDE - Гид (8)
```
GET    /api/guide/profile
PUT    /api/guide/profile

GET    /api/guide/schedule
POST   /api/guide/schedule
PUT    /api/guide/schedule/[id]

GET    /api/guide/groups
GET    /api/guide/earnings

GET    /api/guide/reviews
POST   /api/guide/reviews/[id]/reply

GET    /api/guide/map
```

#### TRANSFER OPERATOR - Трансферы (20)
```
GET    /api/transfer/profile
PUT    /api/transfer/profile

GET    /api/transfer/vehicles
POST   /api/transfer/vehicles
GET    /api/transfer/vehicles/[id]
PUT    /api/transfer/vehicles/[id]
DELETE /api/transfer/vehicles/[id]
GET    /api/transfer/vehicles/[id]/documents

GET    /api/transfer/drivers
POST   /api/transfer/drivers
GET    /api/transfer/drivers/[id]
PUT    /api/transfer/drivers/[id]
DELETE /api/transfer/drivers/[id]
GET    /api/transfer/drivers/[id]/documents

GET    /api/transfer/bookings
POST   /api/transfer/bookings

GET    /api/transfer/transfers
POST   /api/transfer/transfers
GET    /api/transfer/transfers/[id]
PUT    /api/transfer/transfers/[id]

GET    /api/transfer/routes
POST   /api/transfer/routes

GET    /api/transfer/schedule
GET    /api/transfer/stats
GET    /api/transfer/analytics/dashboard
GET    /api/transfer/reports/revenue

# Дополнительно transfer-operator
GET    /api/transfer-operator/dashboard
GET    /api/transfer-operator/vehicles
GET    /api/transfer-operator/drivers/[id]
GET    /api/transfer-operator/drivers/[id]/documents
GET    /api/transfer-operator/transfers

# Публичные трансферы
GET    /api/transfers
POST   /api/transfers/search
GET    /api/transfers/availability
POST   /api/transfers/book
POST   /api/transfers/confirm
GET    /api/transfers/[routeId]/schedules
POST   /api/transfers/payment/confirm
GET    /api/transfers/operator/dashboard
```

#### AGENT - Агенты (8)
```
GET    /api/agent/dashboard
GET    /api/agent/clients
POST   /api/agent/clients
GET    /api/agent/tours
GET    /api/agent/bookings
POST   /api/agent/bookings
GET    /api/agent/vouchers
POST   /api/agent/vouchers
GET    /api/agent/commissions
GET    /api/agent/commissions/payouts
POST   /api/agent/commissions/request-payout
```

#### ADMIN - Администрирование (18)
```
GET    /api/admin/dashboard
GET    /api/admin/stats

GET    /api/admin/users
POST   /api/admin/users
GET    /api/admin/users/[id]
PUT    /api/admin/users/[id]

GET    /api/admin/tours
GET    /api/admin/bookings

GET    /api/admin/content/tours
GET    /api/admin/content/tours/[id]
PUT    /api/admin/content/tours/[id]

GET    /api/admin/content/partners
PUT    /api/admin/content/partners/[id]/verify

GET    /api/admin/content/reviews
PUT    /api/admin/content/reviews/[id]/moderate

POST   /api/admin/operators/verify

GET    /api/admin/finance
GET    /api/admin/finance/payouts

GET    /api/admin/settings
PUT    /api/admin/settings
GET    /api/admin/settings/email-templates
GET    /api/admin/settings/email-templates/[id]
```

#### TOURIST - Турист (7)
```
GET    /api/tourist/profile
PUT    /api/tourist/profile
GET    /api/tourist/trips
GET    /api/tourist/wishlist
GET    /api/tourist/stats
GET    /api/tourist/achievements
GET    /api/tourist/checklists
GET    /api/tourist/documents
```

#### AI SERVICES (5)
```
POST   /api/ai                  # Общий AI чат
POST   /api/ai/groq             # Groq AI (Llama 3.1)
POST   /api/ai/deepseek         # DeepSeek AI
POST   /api/ai/smart-search     # Умный поиск туров
GET    /api/ai/knowledge-base   # База знаний
```

#### PAYMENTS (6)
```
POST   /api/payments/create
GET    /api/payments/[id]/status
POST   /api/payments/webhook
POST   /api/webhooks/cloudpayments
POST   /api/webhooks/payments
POST   /api/webhook
```

#### ACCOMMODATIONS - Размещение (7)
```
GET    /api/accommodations
POST   /api/accommodations/create
GET    /api/accommodations/[id]
PUT    /api/accommodations/[id]
GET    /api/accommodations/[id]/availability
POST   /api/accommodations/[id]/book
GET    /api/accommodations/[id]/blocked-dates
GET    /api/accommodations/[id]/prices
```

#### GEAR - Снаряжение (5)
```
GET    /api/gear
GET    /api/gear/route
GET    /api/gear/items
GET    /api/gear/rentals
GET    /api/gear/stats
GET    /api/gear/profile
```

#### CARS - Прокат авто (5)
```
GET    /api/cars
GET    /api/cars/items
GET    /api/cars/items/[id]
GET    /api/cars/rentals
GET    /api/cars/stats
GET    /api/cars/profile
```

#### SOUVENIRS - Сувениры (7)
```
GET    /api/souvenirs
GET    /api/souvenirs/[id]
GET    /api/souvenirs/items
GET    /api/souvenirs/items/[id]
GET    /api/souvenirs/orders
GET    /api/souvenirs/stats
GET    /api/souvenirs/profile
```

#### ENGAGEMENT - Вовлечённость (11)
```
GET    /api/engagement/conversations
POST   /api/engagement/conversations

GET    /api/engagement/messages
POST   /api/engagement/messages
GET    /api/engagement/messages/[id]
PUT    /api/engagement/messages/[id]

GET    /api/engagement/notifications
POST   /api/engagement/notifications
GET    /api/engagement/notifications/[id]
GET    /api/engagement/notifications/preferences
POST   /api/engagement/notifications/mark-all-read

GET    /api/engagement/wishlist
GET    /api/engagement/wishlist/[id]
DELETE /api/engagement/wishlist/[id]
GET    /api/engagement/wishlist/[id]/items
POST   /api/engagement/wishlist/[id]/items
```

#### ECO-POINTS (2)
```
GET    /api/eco-points
POST   /api/eco-points
GET    /api/eco-points/user
```

#### LOYALTY - Программа лояльности (3)
```
GET    /api/loyalty/levels
POST   /api/loyalty/promo/apply
GET    /api/loyalty/stats
```

#### SUPPORT - Поддержка (10)
```
GET    /api/support/tickets
POST   /api/support/tickets
GET    /api/support/tickets/[id]
PUT    /api/support/tickets/[id]
GET    /api/support/tickets/[id]/messages

GET    /api/support/knowledge-base
GET    /api/support/agents
POST   /api/support/feedback
GET    /api/support/sla
```

#### ANALYTICS - Аналитика (3)
```
GET    /api/analytics/dashboards
GET    /api/analytics/metrics
GET    /api/analytics/reports
```

#### PARTNERS - Партнёры (9)
```
GET    /api/partners
POST   /api/partners/register

GET    /api/partner/list
GET    /api/partner/[id]
POST   /api/partner/[id]/activate

GET    /api/partner/commissions
GET    /api/partner/payouts
POST   /api/partner/payout/[id]/process

GET    /api/partners/kamchatka-fishing
GET    /api/partners/kamchatka-fishing/tours
GET    /api/partners/kamchatka-fishing/bookings
```

#### NOTIFICATIONS (5)
```
GET    /api/notifications
POST   /api/notifications/send
GET    /api/notifications/[id]
POST   /api/notifications/mark-all-read
POST   /api/notifications/tour-reminders
```

#### REVIEWS (2)
```
GET    /api/reviews
POST   /api/reviews
GET    /api/reviews/tour/[tourId]
```

#### TOURS - Публичные туры (5)
```
GET    /api/tours
POST   /api/tours/create
GET    /api/tours/[id]
GET    /api/tours/[id]/availability
POST   /api/tours/[id]/book
GET    /api/tours/[id]/time-slots
```

#### UTILITY (11)
```
GET    /api/health
GET    /api/health/db
GET    /api/ping
GET    /api/csrf-token
GET    /api/roles
GET    /api/weather
GET    /api/geocode
POST   /api/upload
POST   /api/import/asset
POST   /api/trip/plan
POST   /api/chat
GET    /api/cart
POST   /api/telegram/check
GET    /api/monitoring/logs
```

### Итого: **215 API endpoints**

---

## 🧩 КОМПОНЕНТЫ (108 файлов)

### Структура components/

```
components/
├─ admin/              # Админ компоненты
│  └─ Moderation, Stats, Settings
│
├─ operator/           # CRM оператора
│  └─ TourManager, BookingList, Analytics
│
├─ tourist/            # Компоненты туриста
│  └─ TouristNav, TripHistory, Wishlist
│
├─ guide/              # Компоненты гида
│  └─ Schedule, Groups, Earnings
│
├─ transfer-operator/  # Трансфер оператор
│  └─ VehicleList, DriverManager, Routes
│
├─ agent/              # Агент
│  └─ ClientList, Vouchers, Commissions
│
├─ ai/                 # AI компоненты
│  └─ AIChatWidget.tsx
│  └─ AISmartSearch.tsx
│  └─ RoleAssistantWidget.tsx
│
├─ booking/            # Бронирование
│  └─ BookingForm, Calendar, Confirmation
│
├─ payments/           # Платежи
│  └─ PaymentForm, CloudPayments integration
│
├─ reviews/            # Отзывы
│  └─ ReviewForm, ReviewList, Rating
│
├─ shared/             # Общие компоненты
│  └─ Button, Card, Modal, Input, etc.
│
├─ icons/              # Иконки (Lucide React)
│  └─ ActivityIcon, WeatherIcon, etc.
│
└─ Специализированные:
   ├─ WeatherWidget.tsx
   ├─ YandexMap.tsx
   ├─ TransferMap.tsx
   ├─ TransferSearchWidget.tsx
   ├─ MapPanel.tsx
   ├─ EcoPointsWidget.tsx
   ├─ LoyaltyWidget.tsx
   ├─ SamsungWeatherDynamic.tsx
   ├─ ThemeToggle.tsx
   └─ FloatingNav.tsx
```

### Ключевые компоненты

**AI Integration:**
```typescript
AIChatWidget.tsx          - Чат-бот с Groq/DeepSeek
AISmartSearch.tsx         - Умный поиск туров
RoleAssistantWidget.tsx   - Помощник по ролям
FloatingAIButton.tsx      - Плавающая кнопка AI
```

**Weather:**
```typescript
WeatherWidget.tsx         - Виджет погоды
SamsungWeatherDynamic.tsx - Стиль Samsung Weather
WeatherBackground.tsx     - Анимированный фон
```

**Maps:**
```typescript
YandexMap.tsx             - Яндекс.Карты
TransferMap.tsx           - Карта трансферов
MapPanel.tsx              - Панель карты
```

**Navigation:**
```typescript
FloatingNav.tsx           - Floating навигация
TouristNav.tsx            - Навигация туриста
```

**Cards:**
```typescript
TourCard.tsx              - Карточка тура
PartnerCard.tsx           - Карточка партнёра
AccommodationCard.tsx     - Карточка размещения
```

---

## 📱 СТРАНИЦЫ (91 страница)

### app/ структура

```
app/
├─ page.tsx                      # Главная
├─ layout.tsx                    # Root layout
│
├─ auth/                         # Аутентификация
│  ├─ login/
│  ├─ register/
│  └─ demo/
│
├─ hub/                          # Dashboards (15 ролей!)
│  ├─ tourist/                   # Dashboard туриста
│  ├─ operator/                  # CRM оператора
│  ├─ guide/                     # Dashboard гида
│  ├─ transfer-operator/         # Трансферный оператор
│  ├─ agent/                     # Агент
│  ├─ admin/                     # Администратор
│  ├─ gear/                      # Снаряжение
│  ├─ gear-provider/             # Поставщик снаряжения
│  ├─ cars/                      # Прокат авто
│  ├─ souvenirs/                 # Сувениры
│  ├─ stay/                      # Размещение (турист)
│  ├─ stay-provider/             # Провайдер жилья
│  ├─ transfer/                  # Трансферы (турист)
│  ├─ safety/                    # Безопасность
│  └─ tours/                     # Общий каталог
│
├─ tours/                        # Публичный каталог
│  ├─ page.tsx                   # Список туров
│  ├─ [id]/                      # Страница тура
│  ├─ search/                    # Поиск
│  └─ create/                    # Создание (operator)
│
├─ search/                       # Умный поиск
├─ map/                          # Интерактивная карта
├─ profile/                      # Профиль пользователя
├─ accommodations/               # Размещение
├─ gear/                         # Снаряжение
├─ cars/                         # Прокат авто
├─ shop/                         # Сувениры
│
├─ admin/                        # Админка
│  ├─ dashboard/
│  ├─ users/
│  ├─ partners/
│  ├─ moderation/
│  └─ settings/
│
├─ partner/                      # Партнёрская панель (устаревшее?)
├─ legal/                        # Юридические страницы
├─ demo/                         # Демо страницы
├─ test/                         # Тестовые страницы
└─ ui-demo/                      # UI демонстрация
```

### Hub Dashboards детально

**1. Tourist Dashboard:**
- Личная информация
- История поездок
- Избранные туры (wishlist)
- Достижения (achievements)
- Eco-points баланс
- AI-помощник
- Погода на маршруте
- Бронирования
- Чеклисты

**2. Operator Dashboard:**
- Обзор бизнеса
- Список туров
- Календарь бронирований
- Финансовая аналитика
- Отзывы и рейтинг
- Управление гидами
- Шаблоны туров
- Сообщения от клиентов
- Отчёты (revenue, bookings)

**3. Guide Dashboard:**
- Расписание туров
- Текущие группы
- Заработок
- Отзывы
- Карта маршрутов
- Профиль

**4. Transfer Operator Dashboard:**
- Автопарк (vehicles)
- Водители (drivers)
- Маршруты (routes)
- Расписание
- Бронирования
- Аналитика
- Отчёты по выручке
- Документы (на авто и водителей)

**5. Agent Dashboard:**
- База клиентов
- Ваучеры
- Бронирования
- Комиссионные
- Запросы на выплату
- Туры для продажи

**6. Admin Dashboard:**
- Глобальная статистика
- Управление пользователями
- Модерация контента (туры, отзывы)
- Верификация партнёров
- Финансовые отчёты
- Настройки платформы
- Email шаблоны

**7-15. Дополнительные dashboards:**
- Gear Provider (поставщик снаряжения)
- Stay Provider (жильё)
- Cars (прокат авто)
- Souvenirs (сувениры)
- Safety (безопасность)
- Tours (общий каталог)
- Transfer (для туристов)

---

## 🤖 AI ИНТЕГРАЦИЯ

### Провайдеры AI

**1. Groq AI (Llama 3.1)**
```typescript
// lib/ai/role-assistants.ts
- Модель: llama-3.1-70b-versatile
- Температура: 0.7
- Максимум токенов: 2048
- Роль-специфичные промпты
```

**2. DeepSeek AI**
```typescript
- Альтернативный провайдер
- Для более сложных запросов
```

### Роль-специфичные ассистенты

**Файл:** `lib/ai/role-prompts.ts`

```typescript
TOURIST: "Вы - AI-помощник для туристов на Камчатке..."
OPERATOR: "Вы - AI-ассистент для туроператоров..."
GUIDE: "Вы - AI-помощник для гидов..."
TRANSFER: "Вы - AI-помощник для трансферных компаний..."
AGENT: "Вы - AI-ассистент для турагентов..."
ADMIN: "Вы - AI-помощник для администраторов..."
```

**Возможности:**
- Персонализированные советы
- Ответы на вопросы
- Помощь в поиске туров
- Рекомендации
- Планирование маршрутов

### Knowledge Base

```typescript
// /api/ai/knowledge-base
- Информация о Камчатке
- FAQ по турам
- Правила безопасности
- Рекомендации
```

### Smart Search

```typescript
// /api/ai/smart-search
- Natural language запросы
- "Найди рыбалку на 3 дня до 50000₽"
- AI интерпретирует и ищет
```

---

## 🌤️ ПОГОДНАЯ ИНТЕГРАЦИЯ

### Яндекс Weather API

**Файл:** `lib/weather/yandex-weather.ts`

**Функции:**
- Текущая погода
- Прогноз на 7 дней
- Почасовой прогноз
- Погодные предупреждения

**Виджеты:**
```typescript
WeatherWidget.tsx           - Главный виджет
SamsungWeatherDynamic.tsx   - Анимированный (как Samsung Weather)
WeatherBackground.tsx       - Динамический фон
```

**API endpoint:**
```
GET /api/weather?lat=53.0375&lng=158.6556&location=Петропавловск-Камчатский
```

**Response:**
```json
{
  "success": true,
  "data": {
    "current": {
      "temp": -5,
      "feels_like": -10,
      "condition": "cloudy",
      "wind_speed": 5,
      "humidity": 80
    },
    "forecast": [...]
  }
}
```

---

## 🗺️ КАРТЫ И ГЕОЛОКАЦИЯ

### Яндекс.Карты

**Компоненты:**
```typescript
YandexMap.tsx              - Основная карта
TransferMap.tsx            - Карта трансферов
MapPanel.tsx               - Панель карты с фильтрами
```

**Функции:**
- Отображение точек туров
- Маршруты трансферов
- Геокодинг адресов
- Интерактивные метки
- Кластеризация

**API:**
```
GET /api/geocode?address=Петропавловск-Камчатский
```

**PostGIS в БД:**
```sql
CREATE EXTENSION "postgis";

-- В таблицах:
coordinates JSONB  -- {lat, lng, address, name}
```

---

## 💳 ПЛАТЁЖНАЯ СИСТЕМА

### CloudPayments Integration

**Файлы:**
```typescript
lib/payments/cloudpayments-webhook.ts
lib/payments/transfer-payments.ts
components/payments/PaymentForm.tsx
```

**Flow:**
```
1. Клиент создаёт бронирование
2. POST /api/payments/create
3. Получает payment widget URL
4. Оплата через CloudPayments
5. Webhook → /api/webhooks/cloudpayments
6. Обновление payment_status
7. Подтверждение бронирования
```

**API Endpoints:**
```
POST   /api/payments/create
GET    /api/payments/[id]/status
POST   /api/webhooks/cloudpayments
POST   /api/bookings/payments/[id]/refund
```

**Статусы:**
- `pending` - Ожидает оплаты
- `paid` - Оплачено
- `refunded` - Возвращено

---

## 🧪 ТЕСТИРОВАНИЕ

### Test Frameworks

**1. Vitest (Unit + Integration):**
```javascript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

**2. Jest (Legacy):**
```javascript
// jest.config.js + jest.setup.js
```

**3. Playwright (E2E):**
```typescript
// playwright.config.ts
- Браузеры: Chromium, Firefox, WebKit
- Страницы: все критичные flows
```

**4. K6 (Load Testing):**
```bash
load-tests/k6/
└─ run-load-test.sh
└─ scenarios/
```

### Команды тестирования

```bash
npm test                  # Запустить все тесты
npm run test:ui           # Vitest UI
npm run test:coverage     # Покрытие кода
npm run test:integration  # Интеграционные
npm run test:unit         # Unit тесты
npm run test:load         # Load testing
```

### Примеры тестов

**Unit test (предположительно):**
```typescript
describe('TourCard', () => {
  it('renders tour information correctly', () => {
    // ...
  });
});
```

**Integration test:**
```typescript
describe('Booking API', () => {
  it('creates booking with payment', async () => {
    const res = await fetch('/api/bookings', {...});
    expect(res.status).toBe(201);
  });
});
```

**E2E test:**
```typescript
// e2e/tourist-booking.spec.ts
test('tourist can book a tour', async ({ page }) => {
  await page.goto('/tours');
  await page.click('[data-testid="tour-card"]');
  // ...
});
```

---

## 🐳 DEVOPS И ИНФРАСТРУКТУРА

### Docker

**Dockerfile (multi-stage):**
```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL
      - NEXTAUTH_SECRET
      # + 20 других переменных
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
```

### Kubernetes

**Структура k8s/:**
```
k8s/
├─ base/                  # Базовые манифесты
│  ├─ deployment.yaml
│  ├─ service.yaml
│  ├─ ingress.yaml
│  ├─ configmap.yaml
│  ├─ secret.yaml
│  └─ kustomization.yaml
│
├─ production/            # Production overlay
│  ├─ hpa.yaml           # Horizontal Pod Autoscaler
│  ├─ resources.yaml     # Limits & Requests
│  └─ kustomization.yaml
│
└─ staging/               # Staging overlay
   └─ kustomization.yaml
```

**Команды:**
```bash
npm run k8s:validate       # Валидация манифестов
npm run k8s:apply          # Деплой в кластер
npm run k8s:apply:prod     # Production деплой
```

### PM2

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'kamhub',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    max_memory_restart: '500M',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
  }],
};
```

### Nginx

**nginx.conf:**
```nginx
upstream kamhub {
    server localhost:3000;
}

server {
    listen 80;
    server_name kamhub.ru www.kamhub.ru;
    
    location / {
        proxy_pass http://kamhub;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        # ... кэширование, gzip, headers
    }
    
    location /_next/static {
        alias /var/www/kamhub/.next/static;
        expires 365d;
    }
}
```

### Мониторинг

**Sentry:**
```typescript
// sentry.client.config.ts
// sentry.server.config.ts
// sentry.edge.config.ts

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

**Monitoring scripts:**
```bash
monitoring/
├─ health-check.sh
├─ metrics.sh
└─ alerts.sh
```

---

## 📚 ДОКУМЕНТАЦИЯ (161 файл!)

### Структура docs/

```
docs/
├─ README.md                     # Индекс документации
│
├─ design/                       # UX & Design (10+ файлов)
│  ├─ UX_RESEARCH_HOMEPAGE_DECISIONS.md
│  ├─ HOMEPAGE_WIREFRAME_PROTOTYPE.md
│  ├─ DESIGN_RATIONALE.md
│  └─ SAMSUNG_WEATHER_ANALYSIS.md
│
├─ architecture/                 # Архитектура (15+ файлов)
│  ├─ ENTITIES_AND_ROLES_ANALYSIS.md
│  ├─ AUTH_MIGRATION_ANALYSIS.md
│  ├─ DATABASE_SCHEMA.md
│  └─ API_DESIGN.md
│
├─ deployment/                   # Деплой (10+ файлов)
│  ├─ TIMEWEB_DEPLOY_NOW.md
│  ├─ DEPLOY_QUICKSTART.md
│  ├─ KUBERNETES_GUIDE.md
│  └─ DOCKER_PRODUCTION.md
│
├─ business-logic/               # Бизнес-логика
│  ├─ COMMISSION_SYSTEM.md
│  ├─ LOYALTY_PROGRAM.md
│  └─ PAYMENT_FLOWS.md
│
├─ archive/                      # История (100+ файлов)
│  ├─ STAGE_1_FOUNDATION.md
│  ├─ STAGE_2_DASHBOARDS.md
│  ├─ STAGE_3_ADVANCED.md
│  ├─ PHASE_*.md
│  └─ SESSION_*.md
│
├─ SESSION_SUMMARY_2026-02-02.md
├─ PAGES_AUDIT_2026-02-02.md
└─ QUICK_START_TESTS.md
```

### Качество документации

**UX Research:**
- Детальные исследования пользователей
- Барьеры и болевые точки
- Wireframes с обоснованием
- Прототипы на Tailwind

**Архитектура:**
- Entity-Relationship диаграммы
- Анализ ролей и прав доступа
- Миграционные стратегии
- API дизайн принципы

**Исторические записи:**
- Документированы все этапы разработки
- STAGE_1, 2, 3... - фазы проекта
- SESSION_SUMMARY - итоги сессий
- Сохранены старые решения

---

## 🎨 UI/UX ДИЗАЙН

### Inspiration: Samsung Weather

**Принципы:**
- Минималистичный
- Информация по запросу (progressive disclosure)
- Снижение тревожности
- Профессиональный, не маркетинговый
- Факты вместо рекламы

**Документация:**
- `docs/design/SAMSUNG_WEATHER_ANALYSIS.md`
- Детальный разбор почему Samsung Weather хорош
- Применение принципов к туристической платформе

### Цветовая палитра

```css
/* Океан - Primary */
--ocean-50: #f0f9ff
--ocean-400: #38bdf8
--ocean-500: #0ea5e9  /* Главный */
--ocean-600: #0284c7
--ocean-700: #0369a1

/* Вулкан - Secondary */
--volcano-500: #64748b
--volcano-600: #475569

/* Мох - Success/Nature */
--moss-500: #84cc16
--moss-600: #65a30d

/* Серые - Нейтральные (10 оттенков) */
--gray-50 до --gray-900
```

### Типографика

**Шрифт:** Inter

**Размеры:**
```css
text-xs:   0.75rem  (12px)
text-sm:   0.875rem (14px)
text-base: 1rem     (16px)  /* Основной текст */
text-lg:   1.125rem (18px)
text-xl:   1.25rem  (20px)
text-2xl:  1.5rem   (24px)
text-3xl:  1.875rem (30px)
text-4xl:  2.25rem  (36px)
text-5xl:  3rem     (48px)
```

### Компонентная система

**shared/:**
- Button (варианты: primary, secondary, ghost)
- Card (с тенями, borders)
- Input, Textarea
- Modal, Dialog
- Badge, Chip
- Skeleton (loading states)

**Специализированные:**
- FloatingNav - плавающая навигация
- ThemeToggle - переключатель темы
- SearchFilters - фильтры поиска

---

## 🔐 БЕЗОПАСНОСТЬ

### Аутентификация

**Библиотека:** Jose (JWT)

**Файлы:**
```typescript
lib/auth/jwt.ts
lib/auth/session.ts
lib/middleware/auth.ts
```

**Подход:**
- JWT токены (без NextAuth)
- Кастомная реализация
- Роль-based доступ

**Защита роутов:**
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const session = await getSession(request);
  
  // Проверка роли для каждого пути
  if (pathname.startsWith('/hub/admin')) {
    if (session?.role !== 'admin') {
      return redirect('/auth/login');
    }
  }
}
```

### Валидация

**Zod:**
```typescript
import { z } from 'zod';

const tourSchema = z.object({
  name: z.string().min(5),
  price: z.number().positive(),
  // ...
});
```

### Security Scripts

```bash
scripts/security/
├─ audit.sh              # npm audit + анализ
├─ detect-secrets.sh     # Поиск секретов в коде
└─ rate-limit.ts         # Rate limiting
```

---

## 📲 ИНТЕГРАЦИИ

### 1. Groq AI (Llama 3.1)

**API Key:** Требуется в .env
```env
GROQ_API_KEY=gsk_...
```

**Модель:** `llama-3.1-70b-versatile`

**Использование:**
```typescript
const response = await groq.chat.completions.create({
  model: "llama-3.1-70b-versatile",
  messages: [...],
  temperature: 0.7,
  max_tokens: 2048,
});
```

### 2. DeepSeek AI

**Альтернативный провайдер**
```env
DEEPSEEK_API_KEY=...
```

### 3. Яндекс Weather

**API Key:** Требуется
```env
YANDEX_WEATHER_API_KEY=...
```

**Endpoint:**
```
https://api.weather.yandex.ru/v2/forecast
?lat=53.0375&lon=158.6556
```

### 4. Яндекс Maps

**API Key:**
```env
NEXT_PUBLIC_YANDEX_MAPS_API_KEY=...
```

**Функции:**
- Карты
- Геокодинг
- Маршруты

### 5. CloudPayments

**Credentials:**
```env
CLOUDPAYMENTS_PUBLIC_ID=pk_...
CLOUDPAYMENTS_API_SECRET=...
```

**Widget:**
```javascript
const widget = new cp.CloudPayments();
widget.pay('charge', {
  publicId: process.env.CLOUDPAYMENTS_PUBLIC_ID,
  amount: totalPrice,
  currency: 'RUB',
  // ...
});
```

### 6. AWS S3

**Для загрузки изображений:**
```env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=kamhub-assets
AWS_REGION=us-east-1
```

**Библиотека:** `@aws-sdk/client-s3`

### 7. Nodemailer

**Email уведомления:**
```env
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_USER=...
SMTP_PASSWORD=...
```

### 8. Sentry

**Мониторинг:**
```env
SENTRY_DSN=https://...@sentry.io/...
```

### 9. Telegram Bot

**API:**
```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

---

## 🏛️ PILLARS ARCHITECTURE

### Структура pillars/

```
pillars/
├─ core-infrastructure/    # Ядро системы
├─ discovery-pillar/       # Каталог и поиск
├─ booking-pillar/         # Бронирования
├─ engagement/             # Вовлечённость
├─ analytics-pillar/       # Аналитика
├─ analytics/              # Дополнительная аналитика
├─ booking/                # Бронирование (дубликат?)
└─ discovery/              # Discovery (дубликат?)
```

**Концепция "Pillars":**
- Модульная архитектура
- Независимые "столпы" функционала
- Переиспользуемые модули
- Изоляция бизнес-логики

---

## 📱 МОБИЛЬНОЕ ПРИЛОЖЕНИЕ

### Структура mobile-app/

```
mobile-app/
└─ driver-app/            # Приложение для водителей
   ├─ src/
   ├─ package.json
   └─ README.md
```

**Технология:** Предположительно React Native

**Функциональность:**
- Расписание водителя
- Навигация по маршрутам
- Уведомления о бронированиях
- Отметка о выполнении

---

## 🔍 CONTEXTS (State Management)

```
contexts/
├─ AuthContext.tsx        # Глобальная аутентификация
├─ ThemeContext.tsx       # Тема (light/dark)
├─ NotificationContext.tsx # Уведомления
└─ ...
```

**Подход:** React Context API

---

## 🛠️ СКРИПТЫ И УТИЛИТЫ

### scripts/

```bash
scripts/
├─ setup-database.sh              # Настройка БД
├─ apply-new-schemas.sql          # Применение схем
├─ update-knowledge-base.js       # Обновление AI базы
├─ security/
│  ├─ audit.sh
│  └─ detect-secrets.sh
└─ deploy/
   ├─ timeweb-deploy.sh
   └─ kubernetes-deploy.sh
```

---

## 📦 ЗАВИСИМОСТИ

### Production (19 пакетов)

| Пакет | Версия | Назначение |
|-------|--------|------------|
| **next** | 15.5.10 | Framework |
| **react** | 18.3.1 | UI Library |
| **typescript** | 5.4.5 | Типизация |
| **zod** | 3.22.4 | Валидация |
| **pg** | 8.11.3 | PostgreSQL драйвер |
| **bcryptjs** | 3.0.3 | Хеширование паролей |
| **jose** | 5.2.0 | JWT |
| **date-fns** | 4.1.0 | Работа с датами |
| **lucide-react** | 0.555.0 | Иконки (5000+) |
| **react-datepicker** | 8.10.0 | Календарь |
| **react-hot-toast** | 2.6.0 | Уведомления |
| **nodemailer** | 7.0.13 | Email |
| **@aws-sdk/client-s3** | 3.927.0 | S3 загрузка |
| **dotenv** | 16.6.1 | Env переменные |
| **clsx** | 2.1.0 | Утилита классов |

### Dev Dependencies (15 пакетов)

| Пакет | Назначение |
|-------|------------|
| **vitest** | Тестирование |
| **@testing-library/react** | React тесты |
| **@vitejs/plugin-react** | Vite плагин |
| **@vitest/ui** | UI для тестов |
| **jsdom** | DOM для тестов |
| **eslint** | Линтер |
| **tailwindcss** | CSS фреймворк |
| **autoprefixer** | CSS префиксы |
| **postcss** | CSS обработка |

---

## 🎯 КЛЮЧЕВЫЕ ФИЧИ

### 1. AI-Ассистент по ролям

**Каждая роль имеет своего AI:**
```typescript
TOURIST_PROMPT = `
Вы - дружелюбный AI-помощник для туристов.
Помогаете:
- Выбрать подходящий тур
- Спланировать маршрут
- Ответить на вопросы о Камчатке
- Дать советы по безопасности
`;

OPERATOR_PROMPT = `
Вы - профессиональный AI-ассистент для туроператоров.
Помогаете:
- Оптимизировать расписание
- Анализировать спрос
- Управлять ценообразованием
- Улучшить описания туров
`;

GUIDE_PROMPT = `
Вы - AI-помощник для гидов.
Помогаете:
- Планировать маршруты
- Давать информацию о локациях
- Управлять группами
- Отслеживать погоду
`;

// ... и т.д. для каждой роли
```

### 2. Smart Search

**Natural Language запросы:**
```
Вход: "Хочу на рыбалку на 3 дня, бюджет 50000"
  ↓
AI интерпретирует:
  - activity: fishing
  - duration: 3 days
  - max_price: 50000
  ↓
SQL запрос:
  SELECT * FROM tours
  WHERE category = 'fishing'
  AND duration <= 72 hours
  AND price * 3 <= 50000
  ↓
Результаты
```

### 3. Weather Integration

**Виджет погоды:**
- Текущая температура
- Ощущается как
- Влажность, ветер
- Прогноз на 7 дней
- Почасовой прогноз
- Погодные предупреждения

**Использование в турах:**
- Погода на маршруте
- Рекомендации по одежде
- Предупреждения об опасных условиях

### 4. Eco-Points Gamification

**Система мотивации:**
```
Турист участвует в эко-активности
  ↓
Получает баллы (points)
  ↓
Повышает уровень (level)
  ↓
Разблокирует достижения (achievements)
  ↓
Получает скидки на туры
```

**Активности:**
- Уборка мусора (+50 points)
- Сортировка отходов (+30 points)
- Образовательные программы (+20 points)
- Посадка деревьев (+100 points)

### 5. Transfer System

**Полноценная система трансферов:**
```
Турист ищет трансфер
  ↓
Выбирает маршрут (аэропорт → отель)
  ↓
Видит доступные расписания
  ↓
Выбирает время и авто
  ↓
Бронирует с оплатой
  ↓
Оператор получает уведомление
  ↓
Назначает водителя
  ↓
Водитель видит в приложении
  ↓
Выполняет трансфер
```

### 6. CRM для операторов

**Dashboard включает:**
- График бронирований (chart.js?)
- Финансовая аналитика
- Top туры по выручке
- Отзывы и рейтинги
- Календарь занятости
- Управление гидами
- Шаблоны туров
- Email рассылки

### 7. Commission System

**Для агентов:**
```
Агент продаёт тур
  ↓
Создаётся запись в agent_commissions
  ↓
Статус: pending
  ↓
Админ проверяет
  ↓
Статус: approved
  ↓
Агент запрашивает выплату
  ↓
Статус: paid
  ↓
Деньги переведены
```

**Ставки комиссий:**
- Туры: 10-15%
- Трансферы: 5-10%
- Размещение: 10%
- Снаряжение: 5%

---

## 🧬 CONTEXTS VS PROPS

### Глобальное состояние

**Contexts:**
```typescript
AuthContext         - Текущий пользователь, роль
ThemeContext        - Light/Dark тема
NotificationContext - Toast уведомления
CartContext         - Корзина (для сувениров?)
```

**Без Redux/Zustand** - используется React Context

---

## 📈 PRODUCTION READY FEATURES

### 1. Health Checks

```typescript
GET /api/health
GET /api/health/db
GET /api/ping
```

**Проверяют:**
- Доступность сервера
- Подключение к БД
- Время ответа

### 2. Error Handling

**Sentry:**
- Клиентские ошибки
- Серверные ошибки
- Edge функции

**Logging:**
```typescript
console.error() → Sentry → Dashboard
```

### 3. Rate Limiting

**lib/middleware/rate-limit.ts**
- Защита от DDoS
- Лимиты на API endpoints

### 4. CSRF Protection

```typescript
GET /api/csrf-token
```

### 5. Input Sanitization

- Zod валидация
- SQL injection защита (через pg параметры)
- XSS защита (React автоматически)

---

## 🚀 PRODUCTION DEPLOYMENT

### Окружения

**1. Development:**
```bash
npm run dev
# localhost:3000
```

**2. Staging:**
```bash
kubectl apply -k k8s/staging
```

**3. Production:**
```bash
kubectl apply -k k8s/production
# Autoscaling
# Load balancing
# Health checks
```

### Environment Variables (50+!)

```env
# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# AI
GROQ_API_KEY=
DEEPSEEK_API_KEY=

# Weather & Maps
YANDEX_WEATHER_API_KEY=
YANDEX_MAPS_API_KEY=
NEXT_PUBLIC_YANDEX_MAPS_API_KEY=

# Payments
CLOUDPAYMENTS_PUBLIC_ID=
CLOUDPAYMENTS_API_SECRET=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
FROM_EMAIL=

# Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_REGION=

# Monitoring
SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=

# Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# App
NEXT_PUBLIC_SITE_URL=
NODE_ENV=
PORT=
```

---

## 🎓 LESSONS LEARNED (из документов)

### Из SESSION_SUMMARY_2026-02-02.md:

**Что было сделано:**
- Организация документации (302 → 161 файл)
- Аудит всех 91 страниц
- Успешная сборка проекта
- Чистка git веток

**Проблемы решены:**
- Призрачные ветки удалены
- Build errors исправлены
- Документация структурирована

### Design Decisions:

**Почему Samsung Weather стиль:**
1. Минималистичный = меньше тревоги
2. Факты вместо рекламы = доверие
3. Progressive disclosure = не перегружаем
4. Профессиональный = серьёзность

---

## 🎯 СРАВНЕНИЕ С HABKAM

### Что общего

```
✅ Next.js (App Router)
✅ TypeScript
✅ Tailwind CSS
✅ PostgreSQL
✅ Бронирование туров
✅ Партнёрские панели
✅ Роль-based доступ
```

### Что НЕ общего

| Фича | HabKam | PosPkTry |
|------|--------|----------|
| **Размер** | 420 KB | 41 MB |
| **ORM** | Prisma | Raw SQL (pg) |
| **Auth** | NextAuth v5 | Jose (custom) |
| **API** | 12 | 215 |
| **Роли** | 2 | 8+ |
| **AI** | ❌ | ✅ Groq + DeepSeek |
| **Погода** | ❌ | ✅ Яндекс API |
| **Карты** | ❌ | ✅ Яндекс |
| **Платежи** | ❌ | ✅ CloudPayments |
| **Трансферы** | ❌ | ✅ Полная система |
| **Eco-points** | ❌ | ✅ Gamification |
| **Тесты** | ❌ | ✅ Vitest + Playwright |
| **K8s** | ❌ | ✅ |
| **Мобильное** | ❌ | ✅ driver-app |

---

## 💡 АНАЛИЗ КАЧЕСТВА КОДА

### Сильные стороны

✅ **Модульность**
- Чёткое разделение по ролям
- Pillars архитектура
- Переиспользуемые компоненты

✅ **Типобезопасность**
- TypeScript strict mode
- Zod валидация
- Типизированные API ответы

✅ **Документация**
- 161 файл документации
- UX исследования
- Архитектурные решения обоснованы

✅ **Тестирование**
- Unit, Integration, E2E
- Load testing
- Security audits

✅ **Production Ready**
- Health checks
- Error monitoring (Sentry)
- Kubernetes support
- Docker multi-stage

### Потенциальные проблемы

⚠️ **Сложность**
- 215 API endpoints (сложно поддерживать)
- 91 страница (большая кодовая база)
- Много интеграций (зависимости от внешних API)

⚠️ **Дублирование**
- Несколько версий dashboards
- Pillars vs прямая структура
- discovery/ и discovery-pillar/

⚠️ **Размер**
- 41 MB репозиторий
- Медленный git clone
- Большой bundle size (предположительно)

⚠️ **Зависимости**
- 9 внешних API (точки отказа)
- AWS, Yandex, Groq, DeepSeek, CloudPayments
- Высокие расходы на API

⚠️ **База данных**
- Raw SQL вместо ORM (risk SQL injection)
- Ручные миграции (risk ошибок)
- 30+ таблиц (сложность поддержки)

---

## 🏆 ОЦЕНКА ПРОЕКТА

### Технический уровень: **9/10**

**Сильные стороны:**
- Современный стек
- Kubernetes ready
- Полное тестирование
- Мониторинг и логирование
- Отличная документация

**Минусы:**
- Излишняя сложность для MVP
- Много зависимостей
- Raw SQL (риск)

### Бизнес-ценность: **7/10**

**Плюсы:**
- Решает комплексную задачу
- Много ролей = много revenue streams
- Экосистемный подход

**Минусы:**
- Сложно продавать (слишком много функций)
- Высокая стоимость разработки
- Долго до первой прибыли

### UX/UI: **9/10**

**Плюсы:**
- Продуманный дизайн
- UX исследования
- Samsung Weather стиль
- Responsive

**Минусы:**
- Много информации (overwhelming?)
- 15 dashboards (сложно navigate)

### Документация: **10/10**

**Идеально:**
- 161 файл
- Организована по папкам
- Исторические записи
- UX обоснования
- API референс

---

## 🎬 ФИНАЛЬНЫЙ ВЕРДИКТ

### PosPkTry (KamHub) - это:

**✅ Enterprise-уровень платформа**
- Комплексное решение для туристической индустрии
- Готова к масштабированию
- Отличная архитектура
- Production-ready

**⚠️ Overkill для малого бизнеса**
- Слишком сложная для 1-2 операторов
- Высокие расходы на поддержку
- Много зависимостей
- Долгая разработка

**🎯 Идеальна для:**
- Крупные туроператоры (10+ туров)
- Агрегаторы с множеством партнёров
- Компании с техническим отделом
- Проекты с инвестициями

**❌ НЕ подходит для:**
- Стартапов (слишком сложно)
- Малого бизнеса (overkill)
- MVP (избыточно)
- Проектов без разработчиков

---

## 🔮 ЧТО ВЗЯТЬ ИЗ POSPKTRY В HABKAM

### Must Have (срочно)

1. **UI компоненты:**
   - `FloatingNav.tsx` - плавающая навигация
   - `SearchFilters.tsx` - фильтры
   - `WeatherWidget.tsx` - погода

2. **API структура:**
   - Группировка по ролям
   - Валидация Zod на каждом endpoint
   - Health checks

3. **Документация:**
   - UX обоснования
   - API референс
   - Архитектурные диаграммы

### Nice to Have (в будущем)

1. **AI помощник** (Groq)
2. **Платежи** (CloudPayments)
3. **Тесты** (Vitest)
4. **Мониторинг** (Sentry)

### Не брать (избыточно)

1. ❌ 15 dashboards (слишком много)
2. ❌ Raw SQL (Prisma лучше)
3. ❌ Kubernetes (для малого проекта не нужен)
4. ❌ Eco-points (не core функция)
5. ❌ Множество дублирующих систем

---

## 📊 ИТОГОВЫЕ МЕТРИКИ

```
Репозиторий: 41.4 MB (98x больше HabKam)
TypeScript: 619 файлов (6.8x больше)
API: 215 endpoints (17.9x больше)
Страниц: 91 (6.5x больше)
Компонентов: 108 (7.2x больше)
Таблиц БД: 30+ (7.5x больше)
Документов: 161 (20x больше)
Интеграций: 9 (9x больше)
Ролей: 8+ (4x больше)

Время разработки: месяцы
Команда: 3-5 разработчиков (оценка)
Сложность поддержки: Высокая
Стоимость хостинга: Высокая (K8s, AI API, S3)
```

---

## 🎉 ЗАКЛЮЧЕНИЕ

**PosPkTry (KamHub)** - это **амбициозный и технически превосходный проект**:
- ✅ Отличная архитектура
- ✅ Enterprise-функции
- ✅ Полная документация
- ✅ Production-ready

**НО** для малого бизнеса (как fishingkam.ru) это **overkill**.

**Рекомендация:**
- Используйте **HabKam** для старта
- Заимствуйте **лучшие практики** из PosPkTry
- Добавляйте функции **по мере роста**

**HabKam + лучшее из PosPkTry = идеальное решение! 🚀**

---

**Анализ завершён!** 🔬

*Файл сохранён: `docs/POSPKTRY_DEEP_ANALYSIS.md`*

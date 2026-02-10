# 🗂️ PosPkTry (KamHub) - Навигация по raw файлам

## 📋 Общая информация

**Репозиторий:** https://github.com/pospkam/PosPkTry  
**Копия создана:** 10 февраля 2026  
**Всего файлов:** 985  
**Размер:** 41.4 MB (архив: 14 MB)  

---

## 📁 ОСНОВНЫЕ ДИРЕКТОРИИ

### 1. **app/** - Next.js App Router (302 файла)

#### Страницы (91):
```
app/
├─ page.tsx                       # Главная
├─ layout.tsx                     # Root layout
│
├─ auth/                          # Аутентификация
│  ├─ login/page.tsx
│  ├─ register/page.tsx
│  └─ demo/page.tsx
│
├─ hub/                           # Dashboards (15 ролей!)
│  ├─ tourist/page.tsx            # Dashboard туриста
│  ├─ operator/                   # CRM оператора
│  │  ├─ page.tsx
│  │  ├─ tours/
│  │  ├─ bookings/
│  │  ├─ analytics/
│  │  └─ settings/
│  ├─ guide/page.tsx              # Dashboard гида
│  ├─ transfer-operator/page.tsx  # Трансферный оператор
│  ├─ agent/page.tsx              # Агент
│  ├─ admin/                      # Администратор
│  │  ├─ page.tsx
│  │  ├─ users/
│  │  ├─ moderation/
│  │  └─ settings/
│  ├─ gear/page.tsx               # Снаряжение
│  ├─ cars/page.tsx               # Прокат авто
│  ├─ souvenirs/page.tsx          # Сувениры
│  ├─ stay/page.tsx               # Размещение
│  ├─ transfer/page.tsx           # Трансферы
│  └─ safety/page.tsx             # Безопасность
│
├─ tours/                         # Публичный каталог
│  ├─ page.tsx
│  └─ [id]/page.tsx
│
├─ search/page.tsx                # Поиск
├─ map/page.tsx                   # Карта
├─ profile/page.tsx               # Профиль
│
└─ api/                           # 215 API routes
   ├─ auth/
   ├─ discovery/
   ├─ bookings/
   ├─ operator/
   ├─ guide/
   ├─ transfer/
   ├─ agent/
   ├─ admin/
   ├─ ai/
   ├─ payments/
   └─ ... (см. полный список ниже)
```

### 2. **components/** - React компоненты (108 файлов)

```
components/
├─ admin/                         # Админ компоненты
│  ├─ UserManagement.tsx
│  ├─ ModerationQueue.tsx
│  └─ FinanceReports.tsx
│
├─ operator/                      # CRM оператора
│  ├─ TourManager.tsx
│  ├─ BookingCalendar.tsx
│  └─ AnalyticsDashboard.tsx
│
├─ tourist/                       # Компоненты туриста
│  ├─ TouristNav.tsx
│  ├─ TripHistory.tsx
│  └─ WishlistManager.tsx
│
├─ guide/                         # Компоненты гида
│  ├─ ScheduleView.tsx
│  ├─ GroupManager.tsx
│  └─ EarningsTracker.tsx
│
├─ transfer-operator/             # Трансфер
│  ├─ VehicleList.tsx
│  ├─ DriverManager.tsx
│  └─ RouteMap.tsx
│
├─ agent/                         # Агент
│  ├─ ClientDatabase.tsx
│  ├─ VoucherManager.tsx
│  └─ CommissionTracker.tsx
│
├─ ai/                            # AI компоненты
│  ├─ AIChatWidget.tsx
│  ├─ AISmartSearch.tsx
│  └─ RoleAssistantWidget.tsx
│
├─ shared/                        # Общие UI
│  ├─ Button.tsx
│  ├─ Card.tsx
│  ├─ Modal.tsx
│  ├─ Input.tsx
│  └─ ...
│
└─ Специализированные:
   ├─ WeatherWidget.tsx
   ├─ YandexMap.tsx
   ├─ TransferMap.tsx
   ├─ EcoPointsWidget.tsx
   ├─ LoyaltyWidget.tsx
   └─ FloatingNav.tsx
```

### 3. **lib/** - Бизнес-логика (86 файлов)

```
lib/
├─ ai/
│  ├─ role-assistants.ts          # AI по ролям
│  └─ role-prompts.ts             # Промпты
│
├─ auth/
│  ├─ jwt.ts                      # JWT токены
│  └─ session.ts                  # Сессии
│
├─ database/
│  ├─ schema.sql                  # Главная схема (42 KB!)
│  ├─ operators_schema.sql
│  ├─ guide_schema.sql
│  ├─ transfer_schema.sql
│  ├─ agent_schema.sql
│  └─ migrations/                 # 16 миграций
│
├─ payments/
│  ├─ cloudpayments-webhook.ts
│  └─ transfer-payments.ts
│
├─ weather/
│  └─ yandex-weather.ts           # Интеграция Яндекс
│
├─ maps/
│  └─ yandex-maps.ts
│
├─ notifications/
│  └─ email.ts, telegram.ts
│
├─ loyalty/
│  └─ eco-points.ts
│
└─ utils/
   ├─ validation.ts
   ├─ formatting.ts
   └─ helpers.ts
```

### 4. **docs/** - Документация (161 файл)

```
docs/
├─ design/                        # UX & Design
│  ├─ UX_RESEARCH_HOMEPAGE_DECISIONS.md
│  ├─ HOMEPAGE_WIREFRAME_PROTOTYPE.md
│  ├─ DESIGN_RATIONALE.md
│  └─ SAMSUNG_WEATHER_ANALYSIS.md
│
├─ architecture/                  # Архитектура
│  ├─ ENTITIES_AND_ROLES_ANALYSIS.md
│  ├─ AUTH_MIGRATION_ANALYSIS.md
│  └─ DATABASE_SCHEMA.md
│
├─ deployment/                    # Деплой
│  ├─ TIMEWEB_DEPLOY_NOW.md
│  ├─ DEPLOY_QUICKSTART.md
│  └─ KUBERNETES_GUIDE.md
│
├─ business-logic/
│  └─ COMMISSION_SYSTEM.md
│
└─ archive/                       # История (100+ файлов)
   ├─ STAGE_*.md
   ├─ PHASE_*.md
   └─ SESSION_*.md
```

### 5. **k8s/** - Kubernetes

```
k8s/
├─ base/
│  ├─ deployment.yaml
│  ├─ service.yaml
│  ├─ ingress.yaml
│  └─ kustomization.yaml
│
├─ production/
│  ├─ hpa.yaml                    # Auto-scaling
│  └─ kustomization.yaml
│
└─ staging/
   └─ kustomization.yaml
```

### 6. **scripts/** - Утилиты

```
scripts/
├─ setup-database.sh
├─ apply-new-schemas.sql
├─ update-knowledge-base.js
└─ security/
   ├─ audit.sh
   └─ detect-secrets.sh
```

### 7. **tests/** - Тестирование

```
tests/
├─ unit/
├─ integration/
└─ helpers/

e2e/                              # Playwright E2E
load-tests/k6/                    # Load testing
```

---

## 🔍 БЫСТРЫЙ ДОСТУП К КЛЮЧЕВЫМ ФАЙЛАМ

### Конфигурация

| Файл | Описание |
|------|----------|
| `package.json` | Зависимости (19 prod + 15 dev) |
| `next.config.js` | Next.js конфиг |
| `tailwind.config.ts` | Tailwind настройки |
| `tsconfig.json` | TypeScript конфиг |
| `.env.example` | Пример переменных окружения |
| `ecosystem.config.js` | PM2 конфигурация |
| `docker-compose.yml` | Docker compose |
| `Dockerfile` | Docker multi-stage build |

### Основные файлы

| Файл | Строк | Описание |
|------|-------|----------|
| `lib/database/schema.sql` | 1,022 | Полная схема БД |
| `lib/ai/role-assistants.ts` | 487 | AI по ролям |
| `lib/ai/role-prompts.ts` | 412 | Промпты AI |
| `middleware.ts` | 138 | Роут защита |
| `README.md` | 372 | Главное README |

### Dashboards (страницы)

| Путь | Роль |
|------|------|
| `app/hub/tourist/page.tsx` | Турист |
| `app/hub/operator/page.tsx` | Оператор |
| `app/hub/guide/page.tsx` | Гид |
| `app/hub/transfer-operator/page.tsx` | Трансферный оператор |
| `app/hub/agent/page.tsx` | Агент |
| `app/hub/admin/page.tsx` | Администратор |

### API Routes (ключевые)

| Путь | Функция |
|------|---------|
| `app/api/auth/login/route.ts` | Вход |
| `app/api/discovery/tours/route.ts` | Каталог туров |
| `app/api/bookings/route.ts` | Бронирования |
| `app/api/operator/dashboard/route.ts` | Dashboard оператора |
| `app/api/ai/groq/route.ts` | Groq AI |
| `app/api/payments/create/route.ts` | Создание платежа |
| `app/api/transfer/bookings/route.ts` | Бронирование трансфера |

---

## 📊 СТАТИСТИКА ПО ТИПАМ ФАЙЛОВ

```bash
TypeScript (.ts):       327 файлов
React (.tsx):           292 файла
SQL (.sql):             20 файлов
Markdown (.md):         161 файл
JSON (.json):           12 файлов
YAML (.yaml, .yml):     15 файлов
JavaScript (.js):       8 файлов
Shell (.sh):            7 файлов
CSS (.css):             3 файла
```

---

## 🗺️ КАРТА ЗАВИСИМОСТЕЙ

### Внешние API

```
Groq AI ────────────┐
DeepSeek AI ────────┤
Yandex Weather ─────┤
Yandex Maps ────────┤──→ KamHub App
CloudPayments ──────┤
AWS S3 ─────────────┤
Nodemailer (SMTP) ──┤
Sentry ─────────────┤
Telegram Bot ───────┘
```

### Внутренние зависимости

```
Components
    ↓
Contexts (State)
    ↓
lib/ (Business Logic)
    ↓
API Routes
    ↓
Database (PostgreSQL)
```

---

## 🎯 КАК ИЗУЧАТЬ

### Рекомендованный порядок:

**1. Начните с документации:**
```
docs/README.md                    # Индекс
docs/architecture/                # Архитектура
docs/design/                      # UX дизайн
```

**2. Изучите схему БД:**
```
lib/database/schema.sql           # Главная схема
lib/database/migrations/          # Миграции
```

**3. Посмотрите API:**
```
app/api/auth/                     # Аутентификация
app/api/discovery/                # Публичное API
app/api/operator/                 # CRM
```

**4. Изучите компоненты:**
```
components/shared/                # Базовые UI
components/ai/                    # AI виджеты
components/operator/              # Оператор
```

**5. Запустите локально:**
```bash
cd PosPkTry-raw
npm install
cp .env.local.example .env.local
# Заполните .env.local
npm run dev
```

---

## 📖 КЛЮЧЕВЫЕ ФАЙЛЫ ДЛЯ ИЗУЧЕНИЯ

### Архитектура

1. `docs/architecture/ENTITIES_AND_ROLES_ANALYSIS.md`
2. `lib/database/schema.sql` (1,022 строки!)
3. `middleware.ts` (роут защита)

### UI/UX

1. `docs/design/HOMEPAGE_WIREFRAME_PROTOTYPE.md`
2. `components/shared/` (базовые компоненты)
3. `app/page.tsx` (главная страница)

### API

1. `app/api/operator/tours/route.ts` (CRUD туров)
2. `app/api/bookings/route.ts` (бронирования)
3. `app/api/ai/groq/route.ts` (AI интеграция)

### Интеграции

1. `lib/ai/role-assistants.ts` (487 строк AI логики)
2. `lib/weather/yandex-weather.ts` (погода)
3. `lib/payments/cloudpayments-webhook.ts` (платежи)

---

## 🔐 ENVIRONMENT VARIABLES

### Обязательные (.env.local):

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

### Для AI:

```env
GROQ_API_KEY=gsk_...
DEEPSEEK_API_KEY=...
```

### Для карт и погоды:

```env
YANDEX_WEATHER_API_KEY=...
YANDEX_MAPS_API_KEY=...
NEXT_PUBLIC_YANDEX_MAPS_API_KEY=...
```

### Для платежей:

```env
CLOUDPAYMENTS_PUBLIC_ID=pk_...
CLOUDPAYMENTS_API_SECRET=...
```

### Полный список:

См. `.env.production.example` (50+ переменных)

---

## 🚀 БЫСТРЫЙ СТАРТ

### Установка:

```bash
cd PosPkTry-raw
npm install
```

### Настройка БД:

```bash
# Создайте PostgreSQL базу
createdb kamhub

# Примените схему
psql kamhub < lib/database/schema.sql

# Примените миграции
for file in lib/database/migrations/*.sql; do
  psql kamhub < "$file"
done
```

### Запуск:

```bash
npm run dev
# Откройте http://localhost:3000
```

---

## 📚 ПОЛЕЗНЫЕ КОМАНДЫ

### Разработка:

```bash
npm run dev                       # Dev сервер
npm run build                     # Production build
npm run start                     # Production сервер
npm run lint                      # Линтинг
npm run type-check                # TypeScript check
```

### Тестирование:

```bash
npm test                          # Все тесты
npm run test:ui                   # Vitest UI
npm run test:coverage             # Покрытие
npm run test:integration          # Integration
npm run test:unit                 # Unit
npm run test:load                 # Load testing
```

### База данных:

```bash
npm run db:setup                  # Настройка
npm run db:migrate                # Миграции
```

### DevOps:

```bash
npm run docker:build              # Docker build
npm run docker:run                # Docker run
npm run k8s:apply                 # Deploy to K8s
npm run k8s:validate              # Validate manifests
```

### AI:

```bash
npm run ai:update-knowledge       # Обновить базу знаний
npm run ai:update-knowledge:file  # Обновить файл
```

### Security:

```bash
npm run security:audit            # Security audit
npm run security:detect-secrets   # Поиск секретов
```

---

## 🗺️ НАВИГАЦИЯ ПО API (215 endpoints)

### По группам:

**Auth (7):** `app/api/auth/`  
**Discovery (8):** `app/api/discovery/`  
**Bookings (10):** `app/api/bookings/`  
**Operator (18):** `app/api/operator/`  
**Guide (8):** `app/api/guide/`  
**Transfer (20):** `app/api/transfer/`  
**Agent (8):** `app/api/agent/`  
**Admin (18):** `app/api/admin/`  
**AI (5):** `app/api/ai/`  
**Payments (6):** `app/api/payments/`  
**Accommodations (7):** `app/api/accommodations/`  
**... и ещё 100+ endpoints**

### Полный список:

См. `PosPkTry-files-index.txt` (985 файлов)

---

## 🎨 UI COMPONENTS SHOWCASE

### Есть страница демонстрации:

```
app/ui-demo/page.tsx              # UI Showcase
```

Открыть: `http://localhost:3000/ui-demo`

Показывает все компоненты:
- Buttons
- Cards
- Forms
- Modals
- Widgets
- Icons

---

## 🧬 PILLARS (Модульная архитектура)

```
pillars/
├─ core-infrastructure/           # Ядро
├─ discovery-pillar/              # Каталог
├─ booking-pillar/                # Бронирования
├─ engagement/                    # Вовлечённость
└─ analytics-pillar/              # Аналитика
```

**Концепция:** Независимые модули, которые можно переиспользовать

---

## 📦 АРХИВ

**Файл:** `PosPkTry-complete.tar.gz`  
**Размер:** 14 MB (сжато)  
**Распаковка:**
```bash
tar -xzf PosPkTry-complete.tar.gz
cd PosPkTry-raw
```

---

## 🔍 ПОИСК ПО КОДУ

### Найти все API routes:

```bash
find app/api -name "route.ts" | sort
```

### Найти компоненты по названию:

```bash
find components -name "*Weather*.tsx"
find components -name "*AI*.tsx"
find components -name "*Map*.tsx"
```

### Найти документацию:

```bash
find docs -name "*.md" | grep -i "design"
find docs -name "*.md" | grep -i "architecture"
```

### Поиск по содержимому:

```bash
grep -r "CloudPayments" --include="*.ts" --include="*.tsx"
grep -r "Groq" --include="*.ts"
grep -r "Yandex" --include="*.ts"
```

---

## ✅ ГОТОВО!

**Raw файлы доступны в:**
```
/workspace/PosPkTry-raw/          # Полная копия
/workspace/PosPkTry-complete.tar.gz  # Архив (14 MB)
/workspace/PosPkTry-files-index.txt  # Индекс (985 файлов)
```

**Анализ доступен в:**
```
/workspace/docs/POSPKTRY_DEEP_ANALYSIS.md  # 2,571 строка
```

**Можно изучать! 🚀**

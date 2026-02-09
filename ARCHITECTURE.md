# Архитектура проекта KAMHUB

## Структура модулей

Проект организован по принципу **feature-based architecture** с четким разделением ответственности между модулями.

## Структура директорий

```
kamhub/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── bookings/             # Эндпоинты бронирования
│   │   ├── dates/                # Эндпоинты дат
│   │   └── tours/                # Эндпоинты туров
│   ├── booking/                  # Страницы бронирования
│   ├── tours/                    # Страницы туров
│   ├── layout.tsx                # Корневой layout
│   ├── page.tsx                  # Главная страница
│   └── globals.css               # Глобальные стили
│
├── features/                     # Модули по функциональности
│   ├── tours/                    # Модуль туров
│   │   ├── components/           # Компоненты туров
│   │   │   ├── TourCard.tsx      # Карточка тура
│   │   │   └── index.ts          # Экспорты
│   │   └── hooks/                # Хуки туров (будущее)
│   │
│   └── bookings/                 # Модуль бронирований
│       ├── components/           # Компоненты бронирования
│       │   ├── BookingForm.tsx   # Форма бронирования
│       │   └── index.ts          # Экспорты
│       └── hooks/                # Хуки бронирования (будущее)
│
├── components/                   # Общие компоненты
│   ├── layout/                   # Layout компоненты
│   │   ├── Header.tsx            # Шапка сайта
│   │   ├── Footer.tsx            # Подвал сайта
│   │   └── index.ts              # Экспорты
│   └── ui/                       # UI компоненты (будущее)
│       └── (Button, Input, etc.) # Переиспользуемые UI элементы
│
├── lib/                          # Библиотеки и утилиты
│   ├── utils/                    # Утилиты
│   │   ├── cn.ts                 # Утилита для className
│   │   ├── format.ts             # Форматирование (цены и т.д.)
│   │   ├── id.ts                 # Генерация ID
│   │   └── index.ts              # Экспорты
│   └── services/                 # Сервисы
│       ├── telegram.ts           # Telegram интеграция
│       └── validations.ts        # Zod схемы валидации
│
├── types/                        # TypeScript типы
│   ├── operator.ts               # Типы оператора
│   ├── tour.ts                   # Типы тура
│   ├── date.ts                   # Типы дат
│   ├── booking.ts                # Типы бронирования
│   └── index.ts                  # Центральный экспорт типов
│
├── data/                         # JSON данные (временно)
│   ├── bookings.json             # Бронирования
│   ├── dates.json                # Доступные даты
│   └── tours.json                # Туры
│
└── public/                       # Статические файлы
    └── images/                   # Изображения
```

## Принципы организации

### 1. Feature-based модули (`/features`)

Каждая функциональность приложения выделена в отдельный модуль:
- **tours** - всё, что связано с турами
- **bookings** - всё, что связано с бронированием

Каждый модуль содержит:
- `components/` - React компоненты, специфичные для этой функциональности
- `hooks/` - Кастомные хуки (если необходимо)
- `index.ts` - Центральный файл экспортов

### 2. Переиспользуемые компоненты (`/components`)

Общие компоненты, используемые в разных частях приложения:
- `layout/` - Компоненты структуры страницы (Header, Footer)
- `ui/` - Базовые UI элементы (кнопки, инпуты и т.д.)

### 3. Типы (`/types`)

TypeScript типы разделены по доменным сущностям:
- `operator.ts` - Операторы/партнёры
- `tour.ts` - Туры
- `date.ts` - Доступные даты
- `booking.ts` - Бронирования

Центральный `index.ts` экспортирует все типы для удобного импорта:
```typescript
import { Tour, Booking, AvailableDate } from '@/types';
```

### 4. Утилиты и сервисы (`/lib`)

**Утилиты** (`lib/utils/`):
- `cn.ts` - Объединение классов Tailwind
- `format.ts` - Форматирование данных
- `id.ts` - Генерация уникальных ID

**Сервисы** (`lib/services/`):
- `telegram.ts` - Интеграция с Telegram Bot API
- `validations.ts` - Zod схемы валидации

## Соглашения по импортам

### Использование алиаса `@/`

Все импорты используют TypeScript path alias `@/` для абсолютных путей:

```typescript
// ✅ Правильно
import { Tour } from '@/types';
import { TourCard } from '@/features/tours/components';
import { formatPrice } from '@/lib/utils';

// ❌ Неправильно
import { Tour } from '../../../types';
import { TourCard } from '../components/TourCard';
```

### Использование index-файлов

Используйте экспорты через `index.ts` для чистых импортов:

```typescript
// ✅ Правильно
import { TourCard } from '@/features/tours/components';
import { Header, Footer } from '@/components/layout';

// ❌ Неправильно
import { TourCard } from '@/features/tours/components/TourCard';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
```

## Расширение структуры

### Добавление нового feature-модуля

1. Создайте директорию в `/features`
2. Добавьте `components/` и `index.ts`
3. Опционально добавьте `hooks/` если нужны кастомные хуки
4. Создайте типы в `/types` если необходимо

Пример:
```
features/
└── reviews/              # Новый модуль отзывов
    ├── components/
    │   ├── ReviewCard.tsx
    │   ├── ReviewForm.tsx
    │   └── index.ts
    └── hooks/
        └── useReviews.ts
```

### Добавление UI компонента

1. Создайте компонент в `/components/ui`
2. Экспортируйте через `index.ts`

```
components/
└── ui/
    ├── Button.tsx
    ├── Input.tsx
    └── index.ts
```

### Добавление типов

1. Создайте файл типа в `/types`
2. Добавьте экспорт в `/types/index.ts`

```typescript
// types/review.ts
export interface Review {
  id: string;
  rating: number;
  // ...
}

// types/index.ts
export * from './review';
```

## Миграция на базу данных

Текущая структура подготовлена для миграции с JSON на PostgreSQL + Prisma:

1. Типы в `/types` станут основой для Prisma схемы
2. Сервисы в `/lib/services` будут работать с Prisma Client
3. API Routes останутся без изменений

Пример будущей структуры:
```
lib/
├── prisma/
│   ├── client.ts         # Prisma Client
│   └── schema.prisma     # Схема БД
└── services/
    ├── tours.ts          # Сервис работы с турами
    ├── bookings.ts       # Сервис бронирований
    └── telegram.ts       # Сервис уведомлений
```

## Преимущества текущей структуры

1. **Масштабируемость** - легко добавлять новые модули
2. **Читаемость** - понятная организация кода
3. **Переиспользование** - общие компоненты и утилиты
4. **Изоляция** - каждый модуль независим
5. **Типобезопасность** - централизованные типы
6. **Простота импортов** - алиасы и index-файлы

## Дополнительные ресурсы

- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
- [Feature-Sliced Design](https://feature-sliced.design/)

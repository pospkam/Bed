# Админ-панель Партнёра - Руководство

## 📋 Обзор Шага 3

**Что реализовано:**
- ✅ Layout для `/partner` с навигацией
- ✅ Полный CRUD API для туров
- ✅ API для управления датами (массово и индивидуально)
- ✅ Страница списка туров `/partner/tours`
- ✅ Защита доступа (только владелец или ADMIN)

**В разработке (требует завершения):**
- 🔄 Страница создания тура `/partner/tours/create`
- 🔄 Страница редактирования `/partner/tours/[id]/edit`
- 🔄 Страница календаря дат `/partner/tours/[id]/dates`

---

## 🗂️ Структура файлов

```
app/
├─ partner/
│  ├─ layout.tsx                    ✅ Layout с навигацией
│  ├─ dashboard/
│  │  └─ page.tsx                   ✅ Главная панель
│  └─ tours/
│     ├─ page.tsx                   ✅ Список туров
│     ├─ create/
│     │  └─ page.tsx                🔄 Создание тура
│     └─ [id]/
│        ├─ edit/
│        │  └─ page.tsx             🔄 Редактирование
│        └─ dates/
│           └─ page.tsx             🔄 Календарь дат

app/api/partner/
├─ tours/
│  ├─ route.ts                      ✅ GET/POST туров
│  └─ [id]/
│     ├─ route.ts                   ✅ GET/PUT/DELETE тура
│     └─ dates/
│        ├─ route.ts                ✅ GET/POST/DELETE дат (массово)
│        └─ [dateId]/
│           └─ route.ts             ✅ PUT/DELETE конкретной даты
```

---

## 🔌 API Endpoints

### Туры

#### GET `/api/partner/tours`
Получить список своих туров.

**Response:**
```json
{
  "tours": [
    {
      "id": "clx...",
      "title": "Зимняя рыбалка",
      "slug": "winter-fishing",
      "pricePerDay": 18000,
      "partner": {...},
      "dates": [...],
      "_count": {
        "dates": 5,
        "bookings": 12
      }
    }
  ]
}
```

#### POST `/api/partner/tours`
Создать новый тур.

**Request:**
```json
{
  "title": "Зимняя рыбалка на Камчатке",
  "slug": "winter-fishing-kamchatka",
  "description": "Увлекательная рыбалка...",
  "fullDescription": "Полное описание...",
  "locationName": "Река Камчатка",
  "category": "FISHING",
  "difficulty": "MEDIUM",
  "pricePerDay": 18000,
  "minGroupSize": 2,
  "maxGroupSize": 6,
  "minDuration": 3,
  "included": ["Снаряжение", "Транспорт"],
  "notIncluded": ["Питание"],
  "images": []
}
```

**Валидация:**
- title: минимум 5 символов
- slug: уникальный, минимум 3 символа
- description: минимум 20 символов
- pricePerDay: > 0
- maxGroupSize >= minGroupSize

#### GET `/api/partner/tours/[id]`
Получить конкретный тур со всеми деталями.

#### PUT `/api/partner/tours/[id]`
Обновить тур (все поля опциональны).

#### DELETE `/api/partner/tours/[id]`
Удалить тур (если нет активных броней).

---

### Даты

#### GET `/api/partner/tours/[id]/dates`
Получить все даты тура.

#### POST `/api/partner/tours/[id]/dates`
Создать даты (массово).

**Request:**
```json
{
  "dates": [
    {
      "startDate": "2026-02-15",
      "endDate": "2026-02-20",
      "status": "AVAILABLE",
      "spotsTotal": 6,
      "spotsAvailable": 6,
      "priceOverride": 20000,
      "notes": "Праздничный период"
    }
  ]
}
```

**Валидация:**
- endDate > startDate
- startDate >= сегодня
- spotsAvailable <= spotsTotal
- Уникальность (tourId + startDate)

#### PUT `/api/partner/tours/[id]/dates/[dateId]`
Обновить конкретную дату.

#### DELETE `/api/partner/tours/[id]/dates/[dateId]`
Удалить конкретную дату.

#### DELETE `/api/partner/tours/[id]/dates`
Удалить ВСЕ даты тура (осторожно!).

---

## 🎨 Готовые компоненты

### Layout (`/partner/layout.tsx`)

**Возможности:**
- Боковая навигация (desktop)
- Мобильная навигация (bottom bar)
- Информация о пользователе
- Кнопка выхода
- Быстрая статистика

**Навигация:**
- Главная (`/partner/dashboard`)
- Мои туры (`/partner/tours`)
- Бронирования (`/partner/bookings`)
- Статистика (`/partner/stats`)
- Настройки (`/partner/settings`)

### Список туров (`/partner/tours/page.tsx`)

**Возможности:**
- Карточки всех туров
- Статистика (туры, даты, брони)
- Быстрый доступ к:
  - Просмотру тура
  - Редактированию
  - Управлению датами
- Empty state для новых партнёров

---

## 🛠️ Как завершить реализацию

### 1. Создать форму тура

Создайте компонент `TourForm.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TourFormProps {
  initialData?: any;
  tourId?: string;
}

export function TourForm({ initialData, tourId }: TourFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData || {
    title: "",
    slug: "",
    description: "",
    // ... остальные поля
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = tourId 
      ? `/api/partner/tours/${tourId}`
      : `/api/partner/tours`;
    
    const method = tourId ? "PUT" : "POST";
    
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/partner/tours");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Поля формы */}
    </form>
  );
}
```

### 2. Создать календарь дат

Используйте `react-day-picker`:

```typescript
"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState } from "react";

export function DateManager({ tourId }: { tourId: string }) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  
  const handleSave = async () => {
    const dates = selectedDates.map(date => ({
      startDate: date.toISOString(),
      endDate: new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      spotsTotal: 6,
      spotsAvailable: 6,
    }));

    await fetch(`/api/partner/tours/${tourId}/dates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dates }),
    });
  };

  return (
    <div>
      <DayPicker
        mode="multiple"
        selected={selectedDates}
        onSelect={setSelectedDates}
        disabled={{ before: new Date() }}
      />
      <button onClick={handleSave}>Сохранить даты</button>
    </div>
  );
}
```

### 3. Подключить компоненты к страницам

**`/partner/tours/create/page.tsx`:**
```typescript
import { TourForm } from "@/components/TourForm";

export default function CreateTourPage() {
  return (
    <div>
      <h1>Создать тур</h1>
      <TourForm />
    </div>
  );
}
```

**`/partner/tours/[id]/edit/page.tsx`:**
```typescript
import { TourForm } from "@/components/TourForm";

export default async function EditTourPage({ params }: { params: { id: string } }) {
  const res = await fetch(`/api/partner/tours/${params.id}`);
  const { tour } = await res.json();

  return (
    <div>
      <h1>Редактировать тур</h1>
      <TourForm initialData={tour} tourId={params.id} />
    </div>
  );
}
```

**`/partner/tours/[id]/dates/page.tsx`:**
```typescript
import { DateManager } from "@/components/DateManager";

export default function DatesPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Управление датами</h1>
      <DateManager tourId={params.id} />
    </div>
  );
}
```

---

## 🔒 Безопасность

### Проверка доступа

Все API проверяют:
1. Наличие сессии
2. Владение ресурсом (partnerId === session.user.id)
3. Или роль ADMIN

**Пример:**
```typescript
const tour = await prisma.tour.findUnique({ where: { id: params.id } });

if (tour.partnerId !== session.user.id && session.user.role !== "ADMIN") {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

### Middleware

Защищает все роуты `/partner/*`:
```typescript
if (pathname.startsWith("/partner")) {
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
```

---

## 📊 Тестирование

### 1. Создание тура через API

```bash
curl -X POST http://localhost:3000/api/partner/tours \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Тестовый тур",
    "slug": "test-tour",
    "description": "Описание тестового тура минимум 20 символов",
    "locationName": "Камчатка",
    "category": "FISHING",
    "difficulty": "MEDIUM",
    "pricePerDay": 15000,
    "minGroupSize": 2,
    "maxGroupSize": 8,
    "minDuration": 3,
    "included": ["Снаряжение"],
    "notIncluded": ["Питание"]
  }'
```

### 2. Добавление дат

```bash
curl -X POST http://localhost:3000/api/partner/tours/TOUR_ID/dates \
  -H "Content-Type: application/json" \
  -d '{
    "dates": [
      {
        "startDate": "2026-06-01",
        "endDate": "2026-06-05",
        "spotsTotal": 6,
        "spotsAvailable": 6
      }
    ]
  }'
```

---

## ✅ Чеклист готовности

### Готово (Шаг 3 - часть 1):
- [x] Layout с навигацией
- [x] API туров (GET/POST/PUT/DELETE)
- [x] API дат (GET/POST/PUT/DELETE)
- [x] Страница списка туров
- [x] Защита доступа
- [x] Валидация Zod

### Требуется завершить:
- [ ] Страница создания тура с формой
- [ ] Страница редактирования тура
- [ ] Страница календаря дат с react-day-picker
- [ ] Компонент TourForm (переиспользуемый)
- [ ] Компонент DateManager
- [ ] Загрузка изображений (S3/Cloudinary)
- [ ] Batch операции над датами

---

## 🎯 Следующие шаги

1. Создать компонент TourForm
2. Создать компонент DateManager с react-day-picker
3. Подключить компоненты к страницам create/edit/dates
4. Добавить загрузку изображений
5. Протестировать полный flow
6. Задеплоить

**API полностью готово - можно начинать создавать UI!** 🚀

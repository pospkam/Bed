# NextAuth v5 Аутентификация - Руководство

## 📋 Обзор

Система аутентификации построена на **NextAuth.js v5** (App Router) с использованием:
- ✅ Credentials Provider (Email + Password)
- ✅ Prisma Adapter
- ✅ JWT Strategy
- ✅ Role-based Access Control (PARTNER / ADMIN)
- ✅ Middleware защита роутов

---

## 🔧 Установленные пакеты

```bash
npm install next-auth@beta @auth/prisma-adapter
```

**Версии:**
- `next-auth`: 5.x (beta)
- `@auth/prisma-adapter`: latest

---

## 📊 Структура файлов

```
lib/
├─ auth.ts                 # Конфигурация NextAuth
├─ prisma.ts              # Prisma клиент

app/
├─ api/
│  ├─ auth/
│  │  └─ [...nextauth]/
│  │     └─ route.ts      # NextAuth API route
│  └─ register/
│     └─ route.ts         # API регистрации
├─ login/
│  └─ page.tsx            # Страница входа
├─ register/
│  └─ page.tsx            # Страница регистрации
└─ partner/
   └─ dashboard/
      └─ page.tsx         # Защищённая панель партнёра

middleware.ts             # Защита роутов
```

---

## 🗄️ Prisma Schema

### Модели для NextAuth:

```prisma
model Partner {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified DateTime?
  passwordHash  String
  role          Role      @default(PARTNER)
  
  accounts      Account[]
  sessions      Session[]
  tours         Tour[]
  
  @@map("partners")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  
  user Partner @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         Partner  @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
  @@map("verification_tokens")
}

enum Role {
  PARTNER
  ADMIN
}
```

---

## 🔐 Конфигурация NextAuth (`lib/auth.ts`)

### Основные настройки:

```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",        // Используем JWT вместо database sessions
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      // ... проверка email/password через Prisma
    }),
  ],
  callbacks: {
    // Добавляем id и role в JWT
    async jwt({ token, user }) { ... },
    // Добавляем id и role в session
    async session({ session, token }) { ... },
  },
});
```

### Расширение типов:

```typescript
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}
```

---

## 🛡️ Middleware защита роутов

### Файл: `middleware.ts`

```typescript
export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Защита /partner/*
  if (pathname.startsWith("/partner")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.user.role !== "PARTNER" && session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Защита /admin/*
  if (pathname.startsWith("/admin")) {
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}
```

**Matcher:**
```typescript
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
```

---

## 🚀 Использование в компонентах

### Server Components:

```typescript
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }
  
  return <div>Hello {session.user.name}</div>;
}
```

### Client Components:

```typescript
"use client";
import { signIn, signOut } from "next-auth/react";

// Вход
await signIn("credentials", {
  email: "...",
  password: "...",
  redirect: false,
});

// Выход
await signOut({ callbackUrl: "/" });
```

### Server Actions:

```typescript
import { signOut } from "@/lib/auth";

<form action={async () => {
  "use server";
  await signOut();
}}>
  <button>Выйти</button>
</form>
```

---

## 📝 API Endpoints

### POST /api/register

Регистрация нового партнёра.

**Request:**
```json
{
  "name": "FishingKam Tours",
  "email": "partner@fishingkam.ru",
  "password": "demo123456",
  "phone": "+7 999 123-45-67",
  "telegram": "@fishingkam"
}
```

**Response (201):**
```json
{
  "success": true,
  "partner": {
    "id": "clx...",
    "name": "FishingKam Tours",
    "email": "partner@fishingkam.ru",
    "role": "PARTNER"
  }
}
```

**Валидация:**
- Имя: минимум 2 символа
- Email: валидный формат
- Пароль: минимум 6 символов

---

## 🧪 Тестовые учётные данные

После выполнения `npm run db:seed`:

### Партнёр:
```
Email: partner@fishingkam.ru
Пароль: demo123456
Роль: PARTNER
```

### Админ:
```
Email: admin@habkam.ru
Пароль: admin123456
Роль: ADMIN
```

---

## 🔒 Защищённые роуты

### `/partner/*` - Для партнёров и админов
- `/partner/dashboard` - Панель управления
- `/partner/tours` - Управление турами
- `/partner/dates` - Редактирование дат

### `/admin/*` - Только для админов
- `/admin/partners` - Управление партнёрами
- `/admin/bookings` - Все бронирования
- `/admin/settings` - Настройки системы

---

## 📖 Workflow регистрации и входа

### Регистрация:
1. Пользователь заполняет форму `/register`
2. POST запрос на `/api/register`
3. Валидация данных (Zod)
4. Проверка существующего email
5. Хеширование пароля (bcrypt)
6. Создание Partner в БД
7. Автоматический вход через `signIn()`
8. Редирект на `/partner/dashboard`

### Вход:
1. Пользователь заполняет форму `/login`
2. NextAuth проверяет credentials
3. Поиск Partner в БД по email
4. Сравнение паролей (bcrypt)
5. Создание JWT токена
6. Установка session cookie
7. Редирект на callbackUrl или `/partner`

---

## 🐛 Troubleshooting

### Ошибка: "Session is null"
```bash
# Проверьте NEXTAUTH_SECRET в .env
NEXTAUTH_SECRET=your_secret_here

# Перезапустите сервер
npm run dev
```

### Ошибка: "Prisma Client not generated"
```bash
npm run db:generate
```

### Редирект не работает
Проверьте middleware matcher - возможно путь исключён.

### Пароль не совпадает
Убедитесь, что пароль хешируется с помощью bcrypt (10 rounds).

---

## 🎯 Следующие шаги

### Шаг 3: Админ-панель партнёра
- Список своих туров
- CRUD операции над турами
- Визуальный календарь для выбора дат
- Управление доступными датами

### Опционально (будущее):
- Email подтверждение
- Восстановление пароля
- OAuth провайдеры (Google, Telegram)
- Two-Factor Authentication (2FA)

---

## 📚 Дополнительные ресурсы

- [NextAuth.js v5 Docs](https://authjs.dev/)
- [Prisma Adapter](https://authjs.dev/reference/adapter/prisma)
- [Middleware Guide](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

## ✅ Чеклист готовности

- [x] NextAuth v5 установлен
- [x] Prisma schema обновлена
- [x] auth.ts конфигурация создана
- [x] API route настроен
- [x] Middleware защищает роуты
- [x] Страницы /login и /register работают
- [x] Регистрация создаёт партнёра в БД
- [x] Вход проверяет пароль и создаёт session
- [x] Защищённая страница /partner/dashboard доступна
- [x] Выход корректно завершает session

**Система аутентификации готова к использованию!** 🎉

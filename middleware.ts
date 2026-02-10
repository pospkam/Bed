import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Защищённые роуты для партнёров
  if (pathname.startsWith("/partner")) {
    if (!session) {
      // Перенаправляем на login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Проверяем роль (только PARTNER или ADMIN)
    if (session.user.role !== "PARTNER" && session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Защищённые роуты для админов
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Только ADMIN
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/partner", request.url));
    }
  }

  // Если пользователь уже залогинен и пытается зайти на /login или /register
  if (session && (pathname === "/login" || pathname === "/register")) {
    // Перенаправляем в личный кабинет в зависимости от роли
    if (session.user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/partner", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Применяем middleware ко всем путям кроме:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public файлы
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};

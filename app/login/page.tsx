"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/partner";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Неверный email или пароль");
        setIsLoading(false);
        return;
      }

      // Успешный вход
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError("Произошла ошибка при входе");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Логотип */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-blue-600">HabKam</h1>
            <p className="text-sm text-gray-600 mt-1">Туры по Камчатке</p>
          </Link>
        </div>

        {/* Форма входа */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Вход для партнёров
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="partner@fishingkam.ru"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Вход..." : "Войти"}
            </button>
          </form>

          {/* Тестовые данные */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800 font-semibold mb-2">
              🧪 Тестовые учётные данные:
            </p>
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                <strong>Партнёр:</strong> partner@fishingkam.ru / demo123456
              </p>
              <p>
                <strong>Админ:</strong> admin@habkam.ru / admin123456
              </p>
            </div>
          </div>

          {/* Регистрация */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Зарегистрироваться
            </Link>
          </div>

          {/* Назад на главную */}
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <LoginForm />
    </Suspense>
  );
}

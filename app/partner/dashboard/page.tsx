import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PartnerDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HabKam Partner</h1>
            <p className="text-sm text-gray-600">Панель партнёра</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {session.user.email}
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                {session.user.role}
              </span>
            </span>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button type="submit" className="btn-primary">
                Выйти
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Welcome Card */}
          <div className="card">
            <h3 className="mb-2">👋 Добро пожаловать!</h3>
            <p className="text-sm text-gray-600">{session.user.name}</p>
          </div>

          {/* Tours Card */}
          <div className="card">
            <h3 className="mb-2">🎣 Мои туры</h3>
            <p className="text-2xl font-bold">0</p>
            <Link href="/partner/tours" className="text-sm text-blue-600 hover:underline mt-2 block">
              Управление турами →
            </Link>
          </div>

          {/* Bookings Card */}
          <div className="card">
            <h3 className="mb-2">📅 Брони</h3>
            <p className="text-2xl font-bold">0</p>
            <Link href="/partner/bookings" className="text-sm text-blue-600 hover:underline mt-2 block">
              Посмотреть брони →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="mb-4">⚡ Быстрые действия</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/partner/tours/create"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-center"
            >
              <p className="font-medium">➕ Добавить новый тур</p>
              <p className="text-sm text-gray-600 mt-1">Создать новое предложение</p>
            </Link>
            <Link
              href="/partner/dates"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-center"
            >
              <p className="font-medium">📅 Управление датами</p>
              <p className="text-sm text-gray-600 mt-1">Редактировать доступные даты</p>
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ Следующий шаг (Шаг 3):</strong> Здесь будет полноценная админ-панель
            для управления турами и датами с визуальным календарём.
          </p>
        </div>
      </div>
    </main>
  );
}

import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, Package, Calendar, Settings, LogOut, BarChart } from "lucide-react";

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const navigation = [
    { name: "Главная", href: "/partner/dashboard", icon: Home },
    { name: "Мои туры", href: "/partner/tours", icon: Package },
    { name: "Бронирования", href: "/partner/bookings", icon: Calendar },
    { name: "Статистика", href: "/partner/stats", icon: BarChart },
    { name: "Настройки", href: "/partner/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">HabKam</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Партнёр
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-500">{session.user.email}</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {session.user.role}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Выйти"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <nav className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                Быстрая статистика
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Активных туров:</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Броней:</span>
                  <span className="font-bold">0</span>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <ul className="flex justify-around py-2">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:text-blue-600"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

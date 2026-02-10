import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Calendar, Trash2, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function PartnerToursPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Загружаем туры партнёра
  const tours = await prisma.tour.findMany({
    where:
      session.user.role === "ADMIN"
        ? {}
        : { partnerId: session.user.id },
    include: {
      _count: {
        select: {
          dates: true,
          bookings: true,
        },
      },
      dates: {
        where: {
          status: {
            in: ["AVAILABLE", "PARTIAL"],
          },
          startDate: {
            gte: new Date(),
          },
        },
        take: 1,
        orderBy: {
          startDate: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categoryLabels = {
    FISHING: "🎣 Рыбалка",
    HIKING: "🥾 Походы",
    VOLCANO: "🌋 Вулканы",
    SKIING: "⛷️ Горные лыжи",
    OTHER: "🏔️ Приключения",
  };

  const difficultyLabels = {
    EASY: "Легкий",
    MEDIUM: "Средний",
    HARD: "Сложный",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Мои туры</h1>
          <p className="text-gray-600">Управление вашими турами и датами</p>
        </div>
        <Link
          href="/partner/tours/create"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Создать тур
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <p className="text-sm text-gray-600 mb-1">Всего туров</p>
          <p className="text-3xl font-bold">{tours.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <p className="text-sm text-gray-600 mb-1">Доступных дат</p>
          <p className="text-3xl font-bold">
            {tours.reduce((acc, tour) => acc + tour._count.dates, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <p className="text-sm text-gray-600 mb-1">Броней</p>
          <p className="text-3xl font-bold">
            {tours.reduce((acc, tour) => acc + tour._count.bookings, 0)}
          </p>
        </div>
      </div>

      {/* Tours List */}
      {tours.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🎣</div>
            <h2 className="text-2xl font-bold mb-2">Пока нет туров</h2>
            <p className="text-gray-600 mb-6">
              Создайте свой первый тур и начните принимать бронирования
            </p>
            <Link href="/partner/tours/create" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Создать первый тур
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg relative overflow-hidden">
                {tour.images[0] ? (
                  <img
                    src={tour.images[0]}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🏔️
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-medium">
                    {categoryLabels[tour.category]}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{tour.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {tour.description}
                </p>

                {/* Stats */}
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{tour._count.dates} дат</span>
                  </div>
                  <div>
                    <span className="font-medium">{formatPrice(tour.pricePerDay)}₽</span>
                    <span className="text-xs">/сутки</span>
                  </div>
                </div>

                {/* Next Date */}
                {tour.dates[0] && (
                  <div className="bg-green-50 border border-green-200 rounded px-3 py-2 mb-4">
                    <p className="text-xs text-green-700 font-medium">
                      Ближайшая дата:{" "}
                      {new Date(tour.dates[0].startDate).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/tours/${tour.slug}`}
                    className="flex-1 btn-secondary text-sm flex items-center justify-center gap-1"
                    title="Посмотреть"
                  >
                    <Eye className="w-4 h-4" />
                    Смотреть
                  </Link>
                  <Link
                    href={`/partner/tours/${tour.id}/edit`}
                    className="flex-1 btn-secondary text-sm flex items-center justify-center gap-1"
                    title="Редактировать"
                  >
                    <Edit className="w-4 h-4" />
                    Изменить
                  </Link>
                  <Link
                    href={`/partner/tours/${tour.id}/dates`}
                    className="flex-1 btn-primary text-sm flex items-center justify-center gap-1"
                    title="Управление датами"
                  >
                    <Calendar className="w-4 h-4" />
                    Даты
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

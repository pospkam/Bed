import { Tour, AvailableDate } from "@/types";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

async function getTour(slug: string): Promise<Tour> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/tours/${slug}`,
    { cache: 'no-store' }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch tour');
  }
  
  return res.json();
}

async function getAvailableDates(tourId: string): Promise<AvailableDate[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/dates/${tourId}`,
    { cache: 'no-store' }
  );
  
  if (!res.ok) {
    return [];
  }
  
  return res.json();
}

export default async function TourPage({ params }: { params: { slug: string } }) {
  const tour = await getTour(params.slug);
  const availableDates = await getAvailableDates(tour.id);

  const categoryLabels = {
    fishing: '🎣 Рыбалка',
    hiking: '🥾 Походы',
    volcano: '🌋 Вулканы',
    skiing: '⛷️ Горные лыжи',
    other: '🏔️ Приключения',
  };

  const difficultyLabels = {
    easy: 'Легкий',
    medium: 'Средний',
    hard: 'Сложный',
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Хлебные крошки */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Главная</Link>
          {' '}/{' '}
          <Link href="/tours" className="hover:text-blue-600">Туры</Link>
          {' '}/{' '}
          <span className="text-gray-900">{tour.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Основная информация */}
          <div className="lg:col-span-2">
            {/* Галерея */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {tour.images.map((image, index) => (
                <div key={index} className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${tour.title} - фото ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3C/svg%3E';
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Заголовок */}
            <div className="mb-6">
              <div className="flex gap-2 mb-3">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm">
                  {categoryLabels[tour.category]}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                  Сложность: {difficultyLabels[tour.difficulty]}
                </span>
              </div>
              <h1 className="mb-2">{tour.title}</h1>
              <p className="text-gray-600">{tour.description}</p>
            </div>

            {/* Описание */}
            <div className="card mb-6">
              <h2 className="mb-4">Описание</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {tour.fullDescription}
              </div>
            </div>

            {/* Что входит */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="card">
                <h3 className="mb-4 text-green-600">✅ Что входит в стоимость</h3>
                <ul className="space-y-2">
                  {tour.included.map((item, index) => (
                    <li key={index} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-green-500">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <h3 className="mb-4 text-orange-600">❌ Что НЕ входит в стоимость</h3>
                <ul className="space-y-2">
                  {tour.notIncluded.map((item, index) => (
                    <li key={index} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-orange-500">−</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Оператор */}
            <div className="card">
              <h3 className="mb-4">Организатор тура</h3>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg mb-2">{tour.operatorName}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📍 {tour.locationName}</p>
                    <p>📞 {tour.operatorPhone}</p>
                    <p>📱 {tour.operatorTelegram}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Сайдбар - бронирование */}
          <div>
            <div className="card sticky top-20">
              <h3 className="mb-4">Забронировать</h3>
              
              {/* Цена */}
              <div className="mb-6">
                {tour.priceOriginal && (
                  <span className="text-lg text-gray-400 line-through block">
                    {formatPrice(tour.priceOriginal)}₽
                  </span>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatPrice(tour.pricePerDay)}₽
                  </span>
                  <span className="text-gray-500">/сутки</span>
                </div>
              </div>

              {/* Детали */}
              <div className="space-y-3 mb-6 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Минимум дней:</span>
                  <span className="font-medium">{tour.minDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Группа:</span>
                  <span className="font-medium">{tour.minGroupSize}-{tour.maxGroupSize} чел</span>
                </div>
                <div className="flex justify-between">
                  <span>Сложность:</span>
                  <span className="font-medium">{difficultyLabels[tour.difficulty]}</span>
                </div>
              </div>

              {/* Доступные даты */}
              {availableDates.length > 0 ? (
                <div className="mb-6">
                  <h4 className="text-sm font-bold mb-3">Доступные даты:</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableDates.map((date) => (
                      <div 
                        key={date.id}
                        className="p-3 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-sm">
                            <p className="font-medium">
                              {new Date(date.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} - {new Date(date.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            date.status === 'available' ? 'bg-green-100 text-green-700' :
                            date.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {date.spotsAvailable} мест
                          </span>
                        </div>
                        {date.notes && (
                          <p className="text-xs text-gray-500">{date.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    На данный момент нет доступных дат. Свяжитесь с оператором для уточнения.
                  </p>
                </div>
              )}

              {/* Кнопка бронирования */}
              <Link 
                href={`/booking/${tour.id}`}
                className="btn-primary w-full text-center block"
              >
                Забронировать
              </Link>

              <p className="text-xs text-gray-500 text-center mt-3">
                Минимальная группа: {tour.minGroupSize} человек
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

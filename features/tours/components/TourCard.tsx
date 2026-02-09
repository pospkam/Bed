import Link from "next/link";
import { Tour } from "@/types";
import { formatPrice } from "@/lib/utils";

interface TourCardProps {
  tour: Tour;
}

export function TourCard({ tour }: TourCardProps) {
  const categoryLabels = {
    fishing: '🎣 Рыбалка',
    hiking: '🥾 Походы',
    volcano: '🌋 Вулканы',
    skiing: '⛷️ Горные лыжи',
    other: '🏔️ Приключения',
  };

  const seasonLabels = {
    winter: '❄️ Зима',
    summer: '☀️ Лето',
    'all-year': '🔄 Круглый год',
  };

  const difficultyLabels = {
    easy: 'Легкий',
    medium: 'Средний',
    hard: 'Сложный',
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Изображение */}
      <div className="relative h-48 bg-gray-200">
        <img 
          src={tour.images[0]} 
          alt={tour.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E' + encodeURIComponent(tour.title) + '%3C/text%3E%3C/svg%3E';
          }}
        />
        {tour.priceOriginal && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{Math.round((1 - tour.pricePerDay / tour.priceOriginal) * 100)}%
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="p-6">
        {/* Категория и сезон */}
        <div className="flex gap-2 mb-3 text-xs">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {categoryLabels[tour.category]}
          </span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
            {seasonLabels[tour.season]}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-2 line-clamp-2">{tour.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>

        {/* Детали */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <span>👥 {tour.minGroupSize}-{tour.maxGroupSize} чел</span>
          <span>⏱️ от {tour.minDuration} дн</span>
          <span>🏔️ {difficultyLabels[tour.difficulty]}</span>
        </div>

        {/* Цена и кнопка */}
        <div className="flex justify-between items-center">
          <div>
            {tour.priceOriginal && (
              <span className="text-sm text-gray-400 line-through block">
                {formatPrice(tour.priceOriginal)}₽
              </span>
            )}
            <div>
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(tour.pricePerDay)}₽
              </span>
              <span className="text-sm text-gray-500 ml-1">/сутки</span>
            </div>
          </div>
          
          <Link 
            href={`/tours/${tour.slug}`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
}

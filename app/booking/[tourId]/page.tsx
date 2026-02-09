import { Tour, AvailableDate } from "@/lib/types";
import { BookingForm } from "@/components/BookingForm";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

async function getTour(tourId: string): Promise<Tour> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/tours/${tourId}`,
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

export default async function BookingPage({ params }: { params: { tourId: string } }) {
  const tour = await getTour(params.tourId);
  const availableDates = await getAvailableDates(tour.id);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Хлебные крошки */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Главная</Link>
          {' '}/{' '}
          <Link href="/tours" className="hover:text-blue-600">Туры</Link>
          {' '}/{' '}
          <Link href={`/tours/${tour.slug}`} className="hover:text-blue-600">{tour.title}</Link>
          {' '}/{' '}
          <span className="text-gray-900">Бронирование</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Форма */}
          <div className="lg:col-span-2">
            <div className="card">
              <h1 className="mb-6">Забронировать тур</h1>
              <BookingForm tour={tour} availableDates={availableDates} />
            </div>
          </div>

          {/* Сайдбар с информацией о туре */}
          <div>
            <div className="card sticky top-20">
              <h3 className="mb-4">Детали тура</h3>
              
              <div className="mb-4">
                <p className="font-bold text-lg mb-1">{tour.title}</p>
                <p className="text-sm text-gray-600">{tour.description}</p>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Цена за сутки:</span>
                  <span className="font-bold">{formatPrice(tour.pricePerDay)}₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Группа:</span>
                  <span>{tour.minGroupSize}-{tour.maxGroupSize} чел</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Минимум дней:</span>
                  <span>{tour.minDuration}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-3">
                  <strong>Организатор:</strong><br />
                  {tour.operatorName}<br />
                  {tour.operatorPhone}<br />
                  {tour.operatorTelegram}
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg mt-4">
                <p className="text-xs text-blue-800">
                  💡 Это предварительная заявка. Оператор свяжется с вами для подтверждения и уточнения деталей.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

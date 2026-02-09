import { Tour } from "@/lib/types";
import { TourCard } from "@/components/TourCard";

async function getTours(): Promise<Tour[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/tours`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch tours');
  }
  
  return res.json();
}

export default async function ToursPage() {
  const tours = await getTours();

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-4">Туры на Камчатку</h1>
          <p className="text-lg text-gray-600">
            Выберите тур и забронируйте даты прямо сейчас
          </p>
        </div>

        {tours.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Туры не найдены</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

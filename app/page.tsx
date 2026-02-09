import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            KAMHUB
          </h1>
          <p className="text-xl mb-8">
            Агрегатор туров на Камчатку
          </p>
          <Link 
            href="/tours"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Выбрать тур
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">Почему KAMHUB?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🎣</div>
              <h3 className="text-xl font-bold mb-2">Рыбалка</h3>
              <p className="text-gray-600">
                Лучшие места для зимней и летней рыбалки на Камчатке
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🏔️</div>
              <h3 className="text-xl font-bold mb-2">Вулканы</h3>
              <p className="text-gray-600">
                Походы к действующим вулканам с опытными гидами
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Лучшие цены</h3>
              <p className="text-gray-600">
                Прямые договоры с операторами без наценок
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Готовы к приключению?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Выберите тур и забронируйте места прямо сейчас
          </p>
          <Link 
            href="/tours"
            className="btn-primary inline-block"
          >
            Смотреть туры
          </Link>
        </div>
      </section>
    </main>
  );
}

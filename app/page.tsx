import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HERO - Провокация */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-volcanic-900 via-ocean-900 to-volcanic-800 text-white overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Провокационный заголовок */}
            <h1 className="font-display font-black text-6xl md:text-7xl lg:text-8xl mb-6 leading-tight">
              Камчатка<br />не для туристов
            </h1>
            
            {/* Подзаголовок-объяснение */}
            <p className="text-xl md:text-2xl text-ash-100 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
              Камчатка не прощает дилетантов.<br />
              Поэтому мы здесь.
            </p>
            
            {/* Две CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/tours"
                className="bg-fire-500 hover:bg-fire-600 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Смотреть туры
              </Link>
              <a 
                href="https://t.me/kamhub_support"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 px-10 py-4 rounded-lg font-semibold text-lg transition-all"
              >
                Написать Кузьмичу
              </a>
            </div>
            
            {/* Scroll hint */}
            <div className="mt-20 animate-bounce">
              <svg className="w-6 h-6 mx-auto text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* СОЦИАЛЬНОЕ ДОКАЗАТЕЛЬСТВО - Партнёры */}
      <section className="py-12 bg-ash-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-ash-600 text-sm uppercase tracking-wider mb-8 font-semibold">
            Работаем с
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="bg-white px-8 py-4 rounded-lg shadow-sm">
              <a 
                href="https://fishingkam.ru" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-volcanic-800 font-semibold text-lg hover:text-ocean-600 transition-colors"
              >
                Камчатская рыбалка
              </a>
            </div>
            <div className="text-ash-400 text-sm">
              + новые партнёры скоро
            </div>
          </div>
        </div>
      </section>

      {/* КУЗЬМИЧ - Авторитет через личность */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Фото Кузьмича (placeholder) */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-ocean-200 to-ice-200 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="w-full h-full flex items-center justify-center text-volcanic-400 text-6xl">
                    👤
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-fire-500 text-white px-6 py-3 rounded-lg shadow-lg font-semibold">
                  Всю жизнь здесь
                </div>
              </div>
              
              {/* Текст от Кузьмича */}
              <div>
                <p className="text-ash-600 text-sm uppercase tracking-wider mb-4 font-semibold">
                  О нас
                </p>
                <h2 className="font-display font-bold text-4xl md:text-5xl text-volcanic-900 mb-6 leading-tight">
                  Меня зовут<br />Кузьмич
                </h2>
                <div className="space-y-4 text-lg text-ash-700 leading-relaxed">
                  <p>
                    Всю жизнь на Камчатке.
                  </p>
                  <p>
                    Не турагент. Не гид из учебника.<br />
                    Просто знаю эти места.
                  </p>
                  <p>
                    Люди просят показать — показываю.<br />
                    Тем, кто готов.
                  </p>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://t.me/kamhub_support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-ocean-600 hover:bg-ocean-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                    </svg>
                    Написать в Telegram
                  </a>
                  <Link 
                    href="/tours"
                    className="border-2 border-volcanic-300 hover:border-volcanic-500 text-volcanic-800 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
                  >
                    Посмотреть туры
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ТУРЫ - 3 топовых */}
      <section className="py-24 bg-gradient-to-b from-ash-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl md:text-5xl text-volcanic-900 mb-4">
                Туры
              </h2>
              <p className="text-xl text-ash-600">
                Не обещаем комфорт. Обещаем настоящее.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Тур 1: Зимняя рыбалка */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group">
                <div className="aspect-[4/3] bg-gradient-to-br from-ice-300 to-ocean-400 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                    🎣
                  </div>
                  <div className="absolute top-4 right-4 bg-fire-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    -10% Февраль
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3 text-xs">
                    <span className="bg-ice-100 text-ice-800 px-3 py-1 rounded-full">❄️ Зима</span>
                    <span className="bg-ocean-100 text-ocean-800 px-3 py-1 rounded-full">🎣 Рыбалка</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-volcanic-900">
                    Зимняя рыбалка
                  </h3>
                  <p className="text-ash-600 text-sm mb-4 line-clamp-2">
                    Февраль. -12°C. Микижа клюёт каждые 5 минут.
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-2xl font-bold text-volcanic-900">18,000₽</span>
                      <span className="text-sm text-ash-500">/сутки</span>
                    </div>
                  </div>
                  <Link 
                    href="/tours/winter-fishing-kamchatka"
                    className="block w-full bg-ocean-600 hover:bg-ocean-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>

              {/* Тур 2: Летняя рыбалка */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group">
                <div className="aspect-[4/3] bg-gradient-to-br from-ocean-300 to-fire-300 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                    🌊
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3 text-xs">
                    <span className="bg-fire-100 text-fire-800 px-3 py-1 rounded-full">☀️ Лето</span>
                    <span className="bg-ocean-100 text-ocean-800 px-3 py-1 rounded-full">🎣 Рыбалка</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-volcanic-900">
                    Летняя рыбалка
                  </h3>
                  <p className="text-ash-600 text-sm mb-4 line-clamp-2">
                    Чавыча, нерка, кижуч. Сезон с июня по октябрь.
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-2xl font-bold text-volcanic-900">28,000₽</span>
                      <span className="text-sm text-ash-500">/сутки</span>
                    </div>
                  </div>
                  <Link 
                    href="/tours/summer-fishing-kamchatka"
                    className="block w-full bg-ocean-600 hover:bg-ocean-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>

              {/* Карточка "Скоро" */}
              <div className="bg-gradient-to-br from-ash-100 to-ash-200 rounded-2xl overflow-hidden shadow-lg p-6 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="text-6xl mb-4">🏔️</div>
                <h3 className="font-bold text-xl mb-2 text-volcanic-900">
                  Вулканы и походы
                </h3>
                <p className="text-ash-600 text-sm mb-4">
                  Новые операторы и туры добавляются каждую неделю
                </p>
                <p className="text-ash-500 text-xs">
                  Скоро
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link 
                href="/tours"
                className="inline-block border-2 border-volcanic-300 hover:border-volcanic-500 text-volcanic-800 px-10 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Смотреть все туры
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* КАК ЭТО РАБОТАЕТ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl md:text-5xl text-volcanic-900 mb-4">
                Как это работает
              </h2>
              <p className="text-lg text-ash-600">
                Никаких сложностей. Прозрачно и понятно.
              </p>
            </div>

            <div className="space-y-8">
              {/* Шаг 1 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center font-bold text-ocean-700 text-lg">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-volcanic-900">Выбираешь тур</h3>
                  <p className="text-ash-600">
                    Смотришь календарь, выбираешь даты
                  </p>
                </div>
              </div>

              <div className="ml-6 border-l-2 border-ash-200 h-8"></div>

              {/* Шаг 2 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center font-bold text-ocean-700 text-lg">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-volcanic-900">Оставляешь контакты</h3>
                  <p className="text-ash-600">
                    Мы передаём заявку оператору
                  </p>
                </div>
              </div>

              <div className="ml-6 border-l-2 border-ash-200 h-8"></div>

              {/* Шаг 3 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center font-bold text-ocean-700 text-lg">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-volcanic-900">Оператор звонит</h3>
                  <p className="text-ash-600">
                    Обсуждаете детали, бронируете
                  </p>
                </div>
              </div>

              <div className="ml-6 border-l-2 border-ash-200 h-8"></div>

              {/* Шаг 4 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-fire-100 rounded-full flex items-center justify-center font-bold text-fire-700 text-lg">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-volcanic-900">Едешь на Камчатку</h3>
                  <p className="text-ash-600">
                    Оператор встречает, всё организовано
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-ocean-50 rounded-lg border-l-4 border-ocean-500">
              <p className="text-volcanic-800 font-semibold mb-2">
                Мы не посредники. Мы агрегатор.
              </p>
              <p className="text-ash-600">
                Цена та же, что напрямую у оператора. Никаких накруток.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ПОЧЕМУ МЫ */}
      <section className="py-24 bg-gradient-to-b from-ash-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl md:text-5xl text-volcanic-900 mb-4">
                Почему HABKAM
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Пункт 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="font-bold text-xl mb-3 text-volcanic-900">
                  Проверяем операторов
                </h3>
                <p className="text-ash-600">
                  Работаем только с теми, кто реально здесь живёт
                </p>
              </div>

              {/* Пункт 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="font-bold text-xl mb-3 text-volcanic-900">
                  Честные цены
                </h3>
                <p className="text-ash-600">
                  Та же цена, что напрямую. Никаких накруток.
                </p>
              </div>

              {/* Пункт 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="font-bold text-xl mb-3 text-volcanic-900">
                  Кузьмич на связи
                </h3>
                <p className="text-ash-600">
                  Вопрос по туру? Спроси напрямую. Telegram 24/7.
                </p>
              </div>

              {/* Пункт 4 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="text-4xl mb-4">🏔️</div>
                <h3 className="font-bold text-xl mb-3 text-volcanic-900">
                  Без туристического bullshit
                </h3>
                <p className="text-ash-600">
                  Показываем как есть. Холодно — говорим холодно.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl md:text-5xl text-volcanic-900 mb-4">
                Частые вопросы
              </h2>
            </div>

            <div className="space-y-6">
              {/* FAQ 1 */}
              <details className="bg-ash-50 rounded-lg p-6 group">
                <summary className="font-semibold text-lg text-volcanic-900 cursor-pointer list-none flex justify-between items-center">
                  Я не рыбак/не турист. Получится?
                  <span className="text-ocean-600">+</span>
                </summary>
                <p className="mt-4 text-ash-600">
                  Научим. У нас даже девушки ловят по 10кг микижи.
                </p>
              </details>

              {/* FAQ 2 */}
              <details className="bg-ash-50 rounded-lg p-6 group">
                <summary className="font-semibold text-lg text-volcanic-900 cursor-pointer list-none flex justify-between items-center">
                  Опасно? Медведи же есть.
                  <span className="text-ocean-600">+</span>
                </summary>
                <p className="mt-4 text-ash-600">
                  С инструктором — безопасно. Он знает где медведи, обходим.
                </p>
              </details>

              {/* FAQ 3 */}
              <details className="bg-ash-50 rounded-lg p-6 group">
                <summary className="font-semibold text-lg text-volcanic-900 cursor-pointer list-none flex justify-between items-center">
                  Почему через вас, а не напрямую?
                  <span className="text-ocean-600">+</span>
                </summary>
                <p className="mt-4 text-ash-600">
                  Можно и напрямую. Мы просто собрали всех операторов в одном месте. Цена та же. Выбор больше.
                </p>
              </details>

              {/* FAQ 4 */}
              <details className="bg-ash-50 rounded-lg p-6 group">
                <summary className="font-semibold text-lg text-volcanic-900 cursor-pointer list-none flex justify-between items-center">
                  Что если погода испортится?
                  <span className="text-ocean-600">+</span>
                </summary>
                <p className="mt-4 text-ash-600">
                  Это Камчатка. Погода меняется быстро. Оператор адаптирует маршрут. Рыбалка идёт в любую погоду (если не шторм).
                </p>
              </details>

              {/* FAQ 5 */}
              <details className="bg-ash-50 rounded-lg p-6 group">
                <summary className="font-semibold text-lg text-volcanic-900 cursor-pointer list-none flex justify-between items-center">
                  Дорого. Есть дешевле?
                  <span className="text-ocean-600">+</span>
                </summary>
                <p className="mt-4 text-ash-600">
                  18,000₽/день — это с базой, снаряжением, баней, инструктором. Дешевле можно только палатка + сам. Но это совсем другое.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* ФИНАЛЬНЫЙ CTA */}
      <section className="py-24 bg-gradient-to-br from-volcanic-900 via-ocean-900 to-volcanic-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Готов увидеть<br />Камчатку настоящую?
            </h2>
            <p className="text-xl text-ash-100 mb-8 leading-relaxed">
              Не обещаем комфорт.<br />
              Обещаем то, что запомнишь навсегда.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link 
                href="/tours"
                className="bg-fire-500 hover:bg-fire-600 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
              >
                Посмотреть туры
              </Link>
              <a 
                href="https://t.me/kamhub_support"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 px-10 py-4 rounded-lg font-semibold text-lg transition-all"
              >
                Написать Кузьмичу
              </a>
            </div>
            
            <p className="text-sm text-ash-300">
              Свободных мест мало. Группы небольшие.<br />
              Кто готов — бронирует сейчас.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

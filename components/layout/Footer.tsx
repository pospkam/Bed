import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* О компании */}
          <div>
            <h4 className="font-bold mb-4">KAMHUB</h4>
            <p className="text-gray-400 text-sm">
              Агрегатор туров на Камчатку. Лучшие предложения от проверенных операторов.
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h4 className="font-bold mb-4">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tours" className="text-gray-400 hover:text-white transition-colors">
                  Туры
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-400 hover:text-white transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/#contacts" className="text-gray-400 hover:text-white transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Туры */}
          <div>
            <h4 className="font-bold mb-4">Популярные туры</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tours/winter-fishing-kamchatka" className="text-gray-400 hover:text-white transition-colors">
                  Зимняя рыбалка
                </Link>
              </li>
              <li>
                <Link href="/tours/summer-fishing-kamchatka" className="text-gray-400 hover:text-white transition-colors">
                  Летняя рыбалка
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="font-bold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: info@kamhub.ru</li>
              <li>
                Бот: <a href="https://t.me/KamchatourHub_bot" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@KamchatourHub_bot</a>
              </li>
              <li>
                Канал: <a href="https://t.me/kamchatka_real" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@kamchatka_real</a>
              </li>
              <li>Камчатский край, Елизово</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} KAMHUB. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

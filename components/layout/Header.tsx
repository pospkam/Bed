import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">
              HABKAM
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/tours" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Туры
            </Link>
            <Link 
              href="/#about" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              О нас
            </Link>
            <Link 
              href="/#contacts" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Контакты
            </Link>
          </nav>

          <Link 
            href="/tours"
            className="btn-primary text-sm py-2"
          >
            Выбрать тур
          </Link>
        </div>
      </div>
    </header>
  );
}

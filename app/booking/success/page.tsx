import Link from "next/link";

export default function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const bookingId = searchParams.id;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="card text-center">
          {/* Иконка успеха */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg 
                className="w-10 h-10 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>

          <h1 className="mb-4">Заявка успешно отправлена!</h1>
          
          {bookingId && (
            <p className="text-gray-600 mb-6">
              Номер вашей заявки: <span className="font-mono font-bold">#{bookingId.slice(-6)}</span>
            </p>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-bold mb-3">Что дальше?</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">1.</span>
                <span>Оператор получил вашу заявку и свяжется с вами в течение <strong>2 часов</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">2.</span>
                <span>Вы обсудите детали тура, трансфер и дополнительные услуги</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">3.</span>
                <span>После подтверждения вы получите инструкции по предоплате</span>
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <Link 
              href="/tours"
              className="btn-primary inline-block"
            >
              Смотреть другие туры
            </Link>
            
            <div>
              <Link 
                href="/"
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Вернуться на главную
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-xs text-gray-500">
            <p>
              Если у вас возникли вопросы, свяжитесь с нами:<br />
              Email: info@kamhub.ru | Бот: <a href="https://t.me/KamchatourHub_bot" className="hover:text-blue-600 underline">@KamchatourHub_bot</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

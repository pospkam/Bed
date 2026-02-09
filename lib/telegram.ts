import { Booking } from "./types";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

export async function sendTelegramNotification(booking: Booking): Promise<boolean> {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram credentials missing');
    return false;
  }
  
  const message = `
🎣 НОВАЯ ЗАЯВКА #${booking.id.slice(-6)}

Тур: ${booking.tourTitle}
Даты: ${format(parseISO(booking.details.startDate), 'd MMM', {locale: ru})} - ${format(parseISO(booking.details.endDate), 'd MMM yyyy', {locale: ru})}
Дней: ${booking.details.days}

👤 Клиент:
Имя: ${booking.customer.name}
Телефон: ${booking.customer.phone}
${booking.customer.email ? `Email: ${booking.customer.email}` : ''}
${booking.customer.telegram ? `Telegram: ${booking.customer.telegram}` : ''}

👥 Человек: ${booking.details.persons}
💰 Сумма: ${booking.details.totalPrice.toLocaleString('ru-RU')}₽
💵 Ваша доля: ${(booking.details.totalPrice - booking.details.commission).toLocaleString('ru-RU')}₽ (90%)
📊 Комиссия kamhub: ${booking.details.commission.toLocaleString('ru-RU')}₽ (10%)

${booking.comment ? `💬 Комментарий: ${booking.comment}` : ''}

ID заявки: ${booking.id}
Источник: ${booking.source}
  `.trim();
  
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        })
      }
    );
    
    return response.ok;
  } catch (error) {
    console.error('Telegram notification failed:', error);
    return false;
  }
}

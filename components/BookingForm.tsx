"use client";

import { useState } from "react";
import { Tour, AvailableDate } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { format, parseISO, differenceInDays } from "date-fns";
import { ru } from "date-fns/locale";

interface BookingFormProps {
  tour: Tour;
  availableDates: AvailableDate[];
}

export function BookingForm({ tour, availableDates }: BookingFormProps) {
  const [selectedDateId, setSelectedDateId] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    telegram: "",
    persons: tour.minGroupSize,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedDate = availableDates.find((d) => d.id === selectedDateId);
  
  const days = selectedDate 
    ? differenceInDays(parseISO(selectedDate.endDate), parseISO(selectedDate.startDate)) || 1
    : 0;
  
  const totalPrice = selectedDate
    ? (selectedDate.priceOverride || tour.pricePerDay) * days * formData.persons
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      setError("Пожалуйста, выберите дату");
      return;
    }

    if (formData.persons > selectedDate.spotsAvailable) {
      setError(`Доступно только ${selectedDate.spotsAvailable} мест`);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourId: tour.id,
          customer: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email || undefined,
            telegram: formData.telegram || undefined,
          },
          details: {
            startDate: selectedDate.startDate,
            endDate: selectedDate.endDate,
            days,
            persons: formData.persons,
          },
          comment: formData.comment || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при создании заявки");
      }

      // Перенаправляем на страницу успеха
      window.location.href = `/booking/success?id=${data.booking.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Выбор даты */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Выберите даты *
        </label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {availableDates.length === 0 ? (
            <p className="text-sm text-gray-500">Нет доступных дат</p>
          ) : (
            availableDates.map((date) => (
              <label
                key={date.id}
                className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedDateId === date.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-300"
                } ${date.status === 'booked' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="date"
                  value={date.id}
                  checked={selectedDateId === date.id}
                  onChange={(e) => setSelectedDateId(e.target.value)}
                  disabled={date.status === 'booked'}
                  className="sr-only"
                />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {format(parseISO(date.startDate), "d MMMM", { locale: ru })} -{" "}
                      {format(parseISO(date.endDate), "d MMMM yyyy", { locale: ru })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {differenceInDays(parseISO(date.endDate), parseISO(date.startDate)) || 1} дней
                    </p>
                    {date.notes && (
                      <p className="text-xs text-gray-500 mt-1">{date.notes}</p>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      date.status === "available"
                        ? "bg-green-100 text-green-700"
                        : date.status === "partial"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {date.spotsAvailable} мест
                  </span>
                </div>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Количество человек */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Количество человек *
        </label>
        <input
          type="number"
          required
          min={tour.minGroupSize}
          max={selectedDate?.spotsAvailable || tour.maxGroupSize}
          value={formData.persons}
          onChange={(e) =>
            setFormData({ ...formData, persons: parseInt(e.target.value) })
          }
          className="input"
        />
        <p className="text-xs text-gray-500 mt-1">
          Минимум {tour.minGroupSize} человек
          {selectedDate && `, доступно ${selectedDate.spotsAvailable} мест`}
        </p>
      </div>

      {/* Имя */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Ваше имя *
        </label>
        <input
          type="text"
          required
          minLength={2}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input"
          placeholder="Иван Иванов"
        />
      </div>

      {/* Телефон */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Телефон *
        </label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="input"
          placeholder="+7 999 123-45-67"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input"
          placeholder="ivan@mail.ru"
        />
      </div>

      {/* Telegram */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Telegram (опционально)
        </label>
        <input
          type="text"
          value={formData.telegram}
          onChange={(e) =>
            setFormData({ ...formData, telegram: e.target.value })
          }
          className="input"
          placeholder="@username"
        />
      </div>

      {/* Комментарий */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Комментарий или вопросы
        </label>
        <textarea
          rows={3}
          value={formData.comment}
          onChange={(e) =>
            setFormData({ ...formData, comment: e.target.value })
          }
          className="input"
          placeholder="Дополнительные пожелания..."
        />
      </div>

      {/* Итого */}
      {selectedDate && (
        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Стоимость тура:</span>
            <span className="font-bold text-lg">
              {formatPrice(totalPrice)}₽
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {formatPrice(tour.pricePerDay)}₽/сутки × {days} дней × {formData.persons} чел.
          </p>
        </div>
      )}

      {/* Кнопка */}
      <button
        type="submit"
        disabled={isSubmitting || !selectedDate || availableDates.length === 0}
        className="btn-primary w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Отправка..." : "Отправить заявку"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        После отправки заявки мы свяжемся с вами в течение 2 часов
      </p>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Tour, AvailableDate } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { BookingForm } from "@/features/bookings/components";

interface TourBookingSectionProps {
  tour: Tour;
  availableDates: AvailableDate[];
}

export function TourBookingSection({ tour, availableDates }: TourBookingSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateId, setSelectedDateId] = useState<string>("");

  const difficultyLabels = {
    easy: 'Легкий',
    medium: 'Средний',
    hard: 'Сложный',
  };

  const handleDateClick = (dateId: string) => {
    setSelectedDateId(dateId);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="card sticky top-20">
        <h3 className="mb-4">Забронировать</h3>
        
        {/* Цена */}
        <div className="mb-6">
          {tour.priceOriginal && (
            <span className="text-lg text-gray-400 line-through block">
              {formatPrice(tour.priceOriginal)}₽
            </span>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">
              {formatPrice(tour.pricePerDay)}₽
            </span>
            <span className="text-gray-500">/сутки</span>
          </div>
        </div>

        {/* Детали */}
        <div className="space-y-3 mb-6 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Минимум дней:</span>
            <span className="font-medium">{tour.minDuration}</span>
          </div>
          <div className="flex justify-between">
            <span>Группа:</span>
            <span className="font-medium">{tour.minGroupSize}-{tour.maxGroupSize} чел</span>
          </div>
          <div className="flex justify-between">
            <span>Сложность:</span>
            <span className="font-medium">{difficultyLabels[tour.difficulty]}</span>
          </div>
        </div>

        {/* Доступные даты */}
        {availableDates.length > 0 ? (
          <div className="mb-6">
            <h4 className="text-sm font-bold mb-3">Доступные даты:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableDates.map((date) => (
                <button
                  key={date.id}
                  onClick={() => handleDateClick(date.id)}
                  disabled={date.status === 'booked'}
                  className={`w-full p-3 border rounded-lg transition-all text-left ${
                    date.status === 'booked'
                      ? 'opacity-50 cursor-not-allowed bg-gray-50'
                      : 'hover:border-blue-500 hover:shadow-md cursor-pointer'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-sm">
                      <p className="font-medium">
                        {new Date(date.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} - {new Date(date.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      date.status === 'available' ? 'bg-green-100 text-green-700' :
                      date.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {date.spotsAvailable} мест
                    </span>
                  </div>
                  {date.notes && (
                    <p className="text-xs text-gray-500">{date.notes}</p>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              👆 Нажмите на дату для бронирования
            </p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              На данный момент нет доступных дат. Свяжитесь с оператором для уточнения.
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center">
          Минимальная группа: {tour.minGroupSize} человек
        </p>
      </div>

      {/* Modal с формой бронирования */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Забронировать: ${tour.title}`}
      >
        <BookingForm
          tour={tour}
          availableDates={availableDates}
          preselectedDateId={selectedDateId}
        />
      </Modal>
    </>
  );
}

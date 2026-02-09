import { NextResponse } from "next/server";
import { Booking, Tour } from "@/lib/types";
import { bookingSchema } from "@/lib/validations";
import { generateId } from "@/lib/utils";
import { sendTelegramNotification } from "@/lib/telegram";
import fs from "fs/promises";
import path from "path";
import toursData from "@/data/tours.json";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Валидация данных
    const validationResult = bookingSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Проверяем существование тура
    const tour = (toursData as Tour[]).find((t) => t.id === data.tourId);
    if (!tour) {
      return NextResponse.json(
        { error: "Tour not found" },
        { status: 404 }
      );
    }

    // Рассчитываем стоимость
    const pricePerDay = tour.pricePerDay;
    const totalPrice = pricePerDay * data.details.days * data.details.persons;
    const commission = Math.round(totalPrice * 0.1);

    // Создаём бронирование
    const booking: Booking = {
      id: generateId('booking-'),
      tourId: data.tourId,
      tourTitle: tour.title,
      status: 'pending',
      customer: {
        name: data.customer.name,
        phone: data.customer.phone,
        email: data.customer.email || undefined,
        telegram: data.customer.telegram || undefined,
      },
      details: {
        startDate: data.details.startDate,
        endDate: data.details.endDate,
        days: data.details.days,
        persons: data.details.persons,
        pricePerDay,
        totalPrice,
        commission,
      },
      comment: data.comment,
      source: 'website',
      createdAt: new Date().toISOString(),
    };

    // Сохраняем в JSON (временно, позже будет БД)
    const bookingsPath = path.join(process.cwd(), 'data', 'bookings.json');
    const bookingsContent = await fs.readFile(bookingsPath, 'utf-8');
    const bookings = JSON.parse(bookingsContent);
    bookings.push(booking);
    await fs.writeFile(bookingsPath, JSON.stringify(bookings, null, 2));

    // Отправляем уведомление в Telegram
    await sendTelegramNotification(booking);

    return NextResponse.json(
      {
        success: true,
        booking: {
          id: booking.id,
          status: booking.status,
          totalPrice: booking.details.totalPrice,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Схема валидации для создания тура
const tourSchema = z.object({
  title: z.string().min(5, "Название должно быть минимум 5 символов"),
  slug: z.string().min(3, "Slug должен быть минимум 3 символа"),
  description: z.string().min(20, "Описание должно быть минимум 20 символов"),
  fullDescription: z.string().optional(),
  locationName: z.string().min(2, "Укажите локацию"),
  category: z.enum(["FISHING", "HIKING", "VOLCANO", "SKIING", "OTHER"]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  pricePerDay: z.number().min(0, "Цена должна быть положительной"),
  priceOriginal: z.number().optional(),
  minGroupSize: z.number().min(1, "Минимум 1 человек"),
  maxGroupSize: z.number().min(1, "Максимум должен быть больше 0"),
  minDuration: z.number().min(1, "Минимум 1 день"),
  included: z.array(z.string()),
  notIncluded: z.array(z.string()),
  images: z.array(z.string()).optional().default([]),
});

// GET - получить все туры партнёра
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Для ADMIN показываем все туры, для PARTNER только свои
    const where =
      session.user.role === "ADMIN"
        ? {}
        : { partnerId: session.user.id };

    const tours = await prisma.tour.findMany({
      where,
      include: {
        partner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        dates: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
            spotsAvailable: true,
          },
          orderBy: {
            startDate: "asc",
          },
        },
        _count: {
          select: {
            dates: true,
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ tours }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}

// POST - создать новый тур
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Валидация
    const validationResult = tourSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Проверка уникальности slug
    const existingTour = await prisma.tour.findUnique({
      where: { slug: data.slug },
    });

    if (existingTour) {
      return NextResponse.json(
        { error: "Тур с таким slug уже существует" },
        { status: 400 }
      );
    }

    // Валидация размера группы
    if (data.maxGroupSize < data.minGroupSize) {
      return NextResponse.json(
        { error: "Максимальный размер группы должен быть >= минимального" },
        { status: 400 }
      );
    }

    // Создание тура
    const tour = await prisma.tour.create({
      data: {
        ...data,
        partnerId: session.user.id,
      },
      include: {
        partner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        tour,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tour:", error);
    return NextResponse.json(
      { error: "Failed to create tour" },
      { status: 500 }
    );
  }
}

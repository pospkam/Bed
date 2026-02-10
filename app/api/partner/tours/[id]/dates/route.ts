import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Схема для создания/обновления дат
const tourDateSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Неверный формат даты startDate",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Неверный формат даты endDate",
  }),
  status: z.enum(["AVAILABLE", "PARTIAL", "BOOKED", "BLOCKED"]).optional().default("AVAILABLE"),
  spotsTotal: z.number().min(1, "Минимум 1 место").optional().default(6),
  spotsAvailable: z.number().min(0, "Не может быть отрицательным").optional(),
  priceOverride: z.number().min(0).optional(),
  notes: z.string().optional(),
});

const bulkDatesSchema = z.object({
  dates: z.array(tourDateSchema),
});

// GET - получить все даты тура
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Проверка доступа к туру
    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
      select: { partnerId: true },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    if (tour.partnerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Получение всех дат
    const dates = await prisma.tourDate.findMany({
      where: { tourId: params.id },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json({ dates }, { status: 200 });
  } catch (error) {
    console.error("Error fetching dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch dates" },
      { status: 500 }
    );
  }
}

// POST - создать новые даты (массово)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Проверка доступа к туру
    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
      select: { partnerId: true, maxGroupSize: true },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    if (tour.partnerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Валидация
    const validationResult = bulkDatesSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { dates } = validationResult.data;

    // Валидация каждой даты
    const errors: string[] = [];
    for (const date of dates) {
      const start = new Date(date.startDate);
      const end = new Date(date.endDate);

      if (end <= start) {
        errors.push(
          `Дата окончания (${date.endDate}) должна быть позже даты начала (${date.startDate})`
        );
      }

      if (start < new Date()) {
        errors.push(
          `Дата начала (${date.startDate}) не может быть в прошлом`
        );
      }

      const spotsAvail = date.spotsAvailable ?? date.spotsTotal ?? 6;
      const spotsTotal = date.spotsTotal ?? 6;

      if (spotsAvail > spotsTotal) {
        errors.push(
          `Доступных мест (${spotsAvail}) не может быть больше общего количества (${spotsTotal})`
        );
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Validation errors", details: errors },
        { status: 400 }
      );
    }

    // Создание дат
    const createdDates = await Promise.all(
      dates.map((date) =>
        prisma.tourDate.create({
          data: {
            tourId: params.id,
            startDate: new Date(date.startDate),
            endDate: new Date(date.endDate),
            status: date.status || "AVAILABLE",
            spotsTotal: date.spotsTotal || 6,
            spotsAvailable: date.spotsAvailable ?? date.spotsTotal ?? 6,
            priceOverride: date.priceOverride,
            notes: date.notes,
          },
        })
      )
    );

    return NextResponse.json(
      {
        success: true,
        dates: createdDates,
        count: createdDates.length,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating dates:", error);

    // Обработка ошибки уникальности
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Дата с таким началом уже существует для этого тура" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create dates" },
      { status: 500 }
    );
  }
}

// DELETE - удалить все даты тура (осторожно!)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Проверка доступа
    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
      select: { partnerId: true },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    if (tour.partnerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Удаление всех дат
    const result = await prisma.tourDate.deleteMany({
      where: { tourId: params.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Удалено дат: ${result.count}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting dates:", error);
    return NextResponse.json(
      { error: "Failed to delete dates" },
      { status: 500 }
    );
  }
}

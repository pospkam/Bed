import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const tourDateUpdateSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date))).optional(),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date))).optional(),
  status: z.enum(["AVAILABLE", "PARTIAL", "BOOKED", "BLOCKED"]).optional(),
  spotsTotal: z.number().min(1).optional(),
  spotsAvailable: z.number().min(0).optional(),
  priceOverride: z.number().min(0).optional().nullable(),
  notes: z.string().optional().nullable(),
});

// PUT - обновить конкретную дату
export async function PUT(
  request: Request,
  { params }: { params: { id: string; dateId: string } }
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

    // Проверка существования даты
    const existingDate = await prisma.tourDate.findUnique({
      where: { id: params.dateId },
    });

    if (!existingDate || existingDate.tourId !== params.id) {
      return NextResponse.json({ error: "Date not found" }, { status: 404 });
    }

    const body = await request.json();

    // Валидация
    const validationResult = tourDateUpdateSchema.safeParse(body);
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

    // Валидация дат
    const startDate = data.startDate
      ? new Date(data.startDate)
      : existingDate.startDate;
    const endDate = data.endDate
      ? new Date(data.endDate)
      : existingDate.endDate;

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: "Дата окончания должна быть позже даты начала" },
        { status: 400 }
      );
    }

    // Валидация мест
    const spotsTotal = data.spotsTotal ?? existingDate.spotsTotal;
    const spotsAvailable = data.spotsAvailable ?? existingDate.spotsAvailable;

    if (spotsAvailable > spotsTotal) {
      return NextResponse.json(
        {
          error: "Доступных мест не может быть больше общего количества",
        },
        { status: 400 }
      );
    }

    // Обновление даты
    const updatedDate = await prisma.tourDate.update({
      where: { id: params.dateId },
      data: {
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.status && { status: data.status }),
        ...(data.spotsTotal !== undefined && { spotsTotal: data.spotsTotal }),
        ...(data.spotsAvailable !== undefined && {
          spotsAvailable: data.spotsAvailable,
        }),
        ...(data.priceOverride !== undefined && {
          priceOverride: data.priceOverride,
        }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        date: updatedDate,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating date:", error);

    // Обработка ошибки уникальности
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Дата с таким началом уже существует для этого тура" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update date" },
      { status: 500 }
    );
  }
}

// DELETE - удалить конкретную дату
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; dateId: string } }
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

    // Проверка существования даты
    const existingDate = await prisma.tourDate.findUnique({
      where: { id: params.dateId },
    });

    if (!existingDate || existingDate.tourId !== params.id) {
      return NextResponse.json({ error: "Date not found" }, { status: 404 });
    }

    // Удаление даты
    await prisma.tourDate.delete({
      where: { id: params.dateId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Дата успешно удалена",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting date:", error);
    return NextResponse.json(
      { error: "Failed to delete date" },
      { status: 500 }
    );
  }
}

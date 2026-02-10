import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const tourUpdateSchema = z.object({
  title: z.string().min(5).optional(),
  slug: z.string().min(3).optional(),
  description: z.string().min(20).optional(),
  fullDescription: z.string().optional(),
  locationName: z.string().min(2).optional(),
  category: z.enum(["FISHING", "HIKING", "VOLCANO", "SKIING", "OTHER"]).optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  pricePerDay: z.number().min(0).optional(),
  priceOriginal: z.number().optional(),
  minGroupSize: z.number().min(1).optional(),
  maxGroupSize: z.number().min(1).optional(),
  minDuration: z.number().min(1).optional(),
  included: z.array(z.string()).optional(),
  notIncluded: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

// GET - получить конкретный тур
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
      include: {
        partner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            telegram: true,
          },
        },
        dates: {
          orderBy: {
            startDate: "asc",
          },
        },
        bookings: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
        _count: {
          select: {
            dates: true,
            bookings: true,
          },
        },
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Проверка доступа: только владелец или админ
    if (tour.partnerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ tour }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json(
      { error: "Failed to fetch tour" },
      { status: 500 }
    );
  }
}

// PUT - обновить тур
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Проверка существования и доступа
    const existingTour = await prisma.tour.findUnique({
      where: { id: params.id },
    });

    if (!existingTour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    if (
      existingTour.partnerId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Валидация
    const validationResult = tourUpdateSchema.safeParse(body);
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

    // Проверка уникальности slug если он изменяется
    if (data.slug && data.slug !== existingTour.slug) {
      const slugExists = await prisma.tour.findUnique({
        where: { slug: data.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Тур с таким slug уже существует" },
          { status: 400 }
        );
      }
    }

    // Валидация размера группы
    const minSize = data.minGroupSize ?? existingTour.minGroupSize;
    const maxSize = data.maxGroupSize ?? existingTour.maxGroupSize;
    
    if (maxSize < minSize) {
      return NextResponse.json(
        { error: "Максимальный размер группы должен быть >= минимального" },
        { status: 400 }
      );
    }

    // Обновление тура
    const tour = await prisma.tour.update({
      where: { id: params.id },
      data,
      include: {
        partner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            dates: true,
            bookings: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        tour,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating tour:", error);
    return NextResponse.json(
      { error: "Failed to update tour" },
      { status: 500 }
    );
  }
}

// DELETE - удалить тур
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Проверка существования и доступа
    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            bookings: true,
            dates: true,
          },
        },
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    if (tour.partnerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Предупреждение если есть активные брони
    if (tour._count.bookings > 0) {
      return NextResponse.json(
        {
          error: `Невозможно удалить тур с активными бронированиями (${tour._count.bookings} броней)`,
        },
        { status: 400 }
      );
    }

    // Удаление (даты удалятся автоматически благодаря onDelete: Cascade)
    await prisma.tour.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Тур успешно удалён",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tour:", error);
    return NextResponse.json(
      { error: "Failed to delete tour" },
      { status: 500 }
    );
  }
}

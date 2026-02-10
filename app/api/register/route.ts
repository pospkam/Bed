import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Схема валидации
const registerSchema = z.object({
  name: z.string().min(2, "Имя должно быть минимум 2 символа"),
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Пароль должен быть минимум 6 символов"),
  phone: z.string().optional(),
  telegram: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Валидация
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Ошибка валидации",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, email, password, phone, telegram } = validationResult.data;

    // Проверка существующего пользователя
    const existingPartner = await prisma.partner.findUnique({
      where: { email },
    });

    if (existingPartner) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      );
    }

    // Хеширование пароля
    const passwordHash = await bcrypt.hash(password, 10);

    // Создание партнёра
    const partner = await prisma.partner.create({
      data: {
        name,
        email,
        passwordHash,
        phone,
        telegram,
        role: "PARTNER", // По умолчанию роль PARTNER
      },
    });

    // Возвращаем данные без пароля
    return NextResponse.json(
      {
        success: true,
        partner: {
          id: partner.id,
          name: partner.name,
          email: partner.email,
          role: partner.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: "Ошибка при создании аккаунта" },
      { status: 500 }
    );
  }
}

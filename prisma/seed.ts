import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import toursData from '../data/tours.json';
import datesData from '../data/dates.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаю seed базы данных...');

  // 1. Создаём партнёра по умолчанию
  console.log('📦 Создаю партнёра...');
  const defaultPartner = await prisma.partner.upsert({
    where: { email: 'partner@fishingkam.ru' },
    update: {},
    create: {
      name: 'FishingKam - Рыболовные туры',
      email: 'partner@fishingkam.ru',
      passwordHash: await bcrypt.hash('demo123456', 10),
      role: 'PARTNER',
      phone: '+7 999 123-45-67',
      telegram: '@fishingkam',
    },
  });
  console.log(`✅ Партнёр создан: ${defaultPartner.name} (${defaultPartner.email})`);

  // 2. Создаём админа
  console.log('👤 Создаю админа...');
  const admin = await prisma.partner.upsert({
    where: { email: 'admin@habkam.ru' },
    update: {},
    create: {
      name: 'HabKam Admin',
      email: 'admin@habkam.ru',
      passwordHash: await bcrypt.hash('admin123456', 10),
      role: 'ADMIN',
      phone: '+7 999 000-00-00',
      telegram: '@habkam_admin',
    },
  });
  console.log(`✅ Админ создан: ${admin.name} (${admin.email})`);

  // 3. Миграция туров из JSON
  console.log('🚀 Мигрирую туры из JSON...');
  
  for (const tourJson of toursData as any[]) {
    // Маппинг категорий из старого формата в enum
    const categoryMap: Record<string, any> = {
      'fishing': 'FISHING',
      'hiking': 'HIKING',
      'volcano': 'VOLCANO',
      'skiing': 'SKIING',
      'other': 'OTHER',
    };

    const difficultyMap: Record<string, any> = {
      'easy': 'EASY',
      'medium': 'MEDIUM',
      'hard': 'HARD',
    };

    const tour = await prisma.tour.upsert({
      where: { slug: tourJson.slug },
      update: {
        title: tourJson.title,
        description: tourJson.description,
        fullDescription: tourJson.fullDescription,
        pricePerDay: tourJson.pricePerDay,
        priceOriginal: tourJson.priceOriginal,
      },
      create: {
        id: tourJson.id,
        slug: tourJson.slug,
        title: tourJson.title,
        description: tourJson.description,
        fullDescription: tourJson.fullDescription || '',
        locationName: tourJson.locationName || 'Камчатка',
        category: categoryMap[tourJson.category] || 'OTHER',
        difficulty: difficultyMap[tourJson.difficulty] || 'MEDIUM',
        pricePerDay: tourJson.pricePerDay,
        priceOriginal: tourJson.priceOriginal,
        minGroupSize: tourJson.minGroupSize || 1,
        maxGroupSize: tourJson.maxGroupSize || 10,
        minDuration: tourJson.minDuration || 1,
        included: tourJson.included || [],
        notIncluded: tourJson.notIncluded || [],
        images: tourJson.images || [],
        partnerId: defaultPartner.id,
      },
    });
    console.log(`  ✓ Тур: ${tour.title}`);
  }

  // 4. Миграция дат из JSON
  console.log('📅 Мигрирую доступные даты из JSON...');
  
  for (const dateJson of datesData as any[]) {
    const statusMap: Record<string, any> = {
      'available': 'AVAILABLE',
      'partial': 'PARTIAL',
      'booked': 'BOOKED',
    };

    // Проверяем, существует ли тур
    const tour = await prisma.tour.findUnique({
      where: { id: dateJson.tourId },
    });

    if (!tour) {
      console.log(`  ⚠️  Пропускаю дату для несуществующего тура: ${dateJson.tourId}`);
      continue;
    }

    const tourDate = await prisma.tourDate.upsert({
      where: {
        tourId_startDate: {
          tourId: dateJson.tourId,
          startDate: new Date(dateJson.startDate),
        },
      },
      update: {
        endDate: new Date(dateJson.endDate),
        status: statusMap[dateJson.status] || 'AVAILABLE',
        spotsTotal: dateJson.spotsTotal || 6,
        spotsAvailable: dateJson.spotsAvailable || 6,
        priceOverride: dateJson.priceOverride,
        notes: dateJson.notes,
      },
      create: {
        tourId: dateJson.tourId,
        startDate: new Date(dateJson.startDate),
        endDate: new Date(dateJson.endDate),
        status: statusMap[dateJson.status] || 'AVAILABLE',
        spotsTotal: dateJson.spotsTotal || 6,
        spotsAvailable: dateJson.spotsAvailable || 6,
        priceOverride: dateJson.priceOverride,
        notes: dateJson.notes,
      },
    });
    console.log(`  ✓ Дата: ${tourDate.startDate.toLocaleDateString('ru-RU')} - ${tourDate.endDate.toLocaleDateString('ru-RU')}`);
  }

  console.log('');
  console.log('✨ Seed завершён!');
  console.log('');
  console.log('📝 Учётные данные для входа:');
  console.log('');
  console.log('👤 Партнёр:');
  console.log('   Email: partner@fishingkam.ru');
  console.log('   Пароль: demo123456');
  console.log('');
  console.log('🔑 Админ:');
  console.log('   Email: admin@habkam.ru');
  console.log('   Пароль: admin123456');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

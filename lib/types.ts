// Оператор/партнёр
export interface Operator {
  id: string;
  name: string;
  slug: string;
  description: string;
  website: string;
  telegram: string;
  phone: string;
  email: string;
  logoUrl?: string;
  rating: number;
  totalReviews: number;
}

// Тур
export interface Tour {
  id: string;
  operatorId: string;
  operatorName: string;
  operatorPhone: string;
  operatorTelegram: string;
  title: string;
  slug: string;
  category: 'fishing' | 'hiking' | 'volcano' | 'skiing' | 'other';
  season: 'winter' | 'summer' | 'all-year';
  pricePerDay: number;
  priceOriginal?: number;
  minDuration: number;
  minGroupSize: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  fullDescription: string;
  included: string[];
  notIncluded: string[];
  images: string[];
  locationName: string;
  coordinates?: { lat: number; lng: number };
  isActive: boolean;
}

// Доступная дата
export interface AvailableDate {
  id: string;
  tourId: string;
  startDate: string; // ISO 8601
  endDate: string;   // ISO 8601
  status: 'available' | 'partial' | 'booked';
  spotsTotal: number;
  spotsAvailable: number;
  priceOverride?: number;
  notes?: string;
}

// Бронирование
export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  dateId?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  
  customer: {
    name: string;
    phone: string;
    email?: string;
    telegram?: string;
  };
  
  details: {
    startDate: string;
    endDate: string;
    days: number;
    persons: number;
    pricePerDay: number;
    totalPrice: number;
    commission: number;
  };
  
  comment?: string;
  source: 'website' | 'telegram' | 'phone';
  referralCode?: string;
  createdAt: string;
  updatedAt?: string;
}

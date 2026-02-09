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

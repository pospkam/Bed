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

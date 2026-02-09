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

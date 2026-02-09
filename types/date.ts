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

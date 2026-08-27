export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IRentalBooking {
  id: string;
  carId: string;
  userId: string;
  providerId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  pickupLocation: string;
  returnLocation: string;
  createdAt: string;
}

export interface ISaleOrder {
  id: string;
  carId: string;
  userId: string;
  providerId: string;
  salePrice: number;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: PaymentStatus;
  createdAt: string;
}

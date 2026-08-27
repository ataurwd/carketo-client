import { apiClient } from '@/lib/api-client';

export interface CreateBookingDTO {
  carId: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  returnLocation: string;
  insuranceOption?: 'standard' | 'premium' | 'zero-excess';
  specialRequests?: string;
}

export const bookingService = {
  async createBooking(data: CreateBookingDTO) {
    const res: any = await apiClient.post('/bookings', data);
    return res.data;
  },

  async getUserBookings() {
    try {
      const res: any = await apiClient.get('/bookings/my-bookings');
      return res.data;
    } catch {
      return [];
    }
  },

  async cancelBooking(bookingId: string) {
    const res: any = await apiClient.post(`/bookings/${bookingId}/cancel`);
    return res.data;
  },
};

import { apiClient } from '@/lib/api-client';

export interface CreateOrderDTO {
  carId: string;
  paymentType?: 'full' | 'finance' | 'lease';
  deliveryOption?: 'pickup' | 'doorstep';
  deliveryAddress?: {
    street: string;
    city: string;
    state?: string;
    country: string;
    zipCode: string;
  };
  contactPhone: string;
  notes?: string;
}

export const orderService = {
  async createOrder(data: CreateOrderDTO) {
    const res: any = await apiClient.post('/orders', data);
    return res.data;
  },

  async getUserOrders() {
    try {
      const res: any = await apiClient.get('/orders/my-orders');
      return res.data;
    } catch {
      return [];
    }
  },
};

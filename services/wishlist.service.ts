import { apiClient } from '@/lib/api-client';
import { ICar } from '@/types/car.types';

export const wishlistService = {
  async toggle(carId: string): Promise<{ isWishlisted: boolean; message: string }> {
    const res: any = await apiClient.post(`/wishlist/toggle/${carId}`);
    return res.data;
  },

  async getWishlist(): Promise<ICar[]> {
    try {
      const res: any = await apiClient.get('/wishlist');
      return res.data;
    } catch {
      return [];
    }
  },
};

import { apiClient } from '@/lib/api-client';
import { ICar } from '@/types/car.types';

export const carService = {
  async getCars(params?: Record<string, any>): Promise<ICar[]> {
    try {
      const res: any = await apiClient.get('/cars', { params });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  async getFeaturedCars(): Promise<ICar[]> {
    try {
      const res: any = await apiClient.get('/cars/featured');
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  async getCarBySlug(slug: string): Promise<ICar | null> {
    try {
      const res: any = await apiClient.get(`/cars/${slug}`);
      return res.data || null;
    } catch {
      return null;
    }
  },

  async createCar(data: any): Promise<ICar> {
    const res: any = await apiClient.post('/cars', data);
    return res.data;
  },

  async updateCar(carId: string, data: any): Promise<ICar> {
    const res: any = await apiClient.put(`/cars/${carId}`, data);
    return res.data;
  },

  async deleteCar(carId: string): Promise<{ message: string }> {
    const res: any = await apiClient.delete(`/cars/${carId}`);
    return res.data;
  },

  async getMyFleet(): Promise<ICar[]> {
    try {
      const res: any = await apiClient.get('/cars/provider/my-fleet');
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },
};

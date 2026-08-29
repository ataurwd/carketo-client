import { apiClient } from '@/lib/api-client';
import { ICar } from '@/types/car.types';

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const carService = {
  async getCars(params?: Record<string, any>): Promise<ICar[]> {
    try {
      const res: any = await apiClient.get('/cars', { params });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  async getCarsWithPagination(
    params?: Record<string, any>
  ): Promise<{ cars: ICar[]; pagination: IPagination }> {
    try {
      const res: any = await apiClient.get('/cars', { params });
      const cars = Array.isArray(res.data) ? res.data : [];
      const pagination: IPagination = res.meta || {
        total: cars.length,
        page: Number(params?.page) || 1,
        limit: Number(params?.limit) || 12,
        totalPages: Math.ceil(cars.length / (Number(params?.limit) || 12)) || 1,
      };
      return { cars, pagination };
    } catch {
      return {
        cars: [],
        pagination: { total: 0, page: 1, limit: 12, totalPages: 1 },
      };
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

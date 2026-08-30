import { apiClient } from '@/lib/api-client';

export interface ProviderStatsData {
  stats: {
    totalCars: number;
    activeListings: number;
    totalBookings: number;
    totalOrders: number;
    totalRevenue: number;
    rentalRevenue: number;
    salesRevenue: number;
  };
  recentBookings: any[];
}

export const providerService = {
  async onboard(data: {
    businessName: string;
    providerType: string;
    phone: string;
    email: string;
    registrationNumber?: string;
    taxId?: string;
    address?: { city: string; country: string };
  }) {
    const res: any = await apiClient.post('/providers/onboard', data);
    return res.data;
  },

  async getProfile() {
    const res: any = await apiClient.get('/providers/profile');
    return res.data;
  },

  async updateProfile(data: any) {
    const res: any = await apiClient.put('/providers/profile', data);
    return res.data;
  },

  async getStats(): Promise<ProviderStatsData> {
    try {
      const res: any = await apiClient.get('/providers/stats');
      return res.data;
    } catch {
      return {
        stats: {
          totalCars: 0,
          activeListings: 0,
          totalBookings: 0,
          totalOrders: 0,
          totalRevenue: 0,
          rentalRevenue: 0,
          salesRevenue: 0,
        },
        recentBookings: [],
      };
    }
  },

  async getAllProviders(page: number = 1, limit: number = 12) {
    const res: any = await apiClient.get('/providers', { params: { page, limit } });
    return res.data;
  },
};

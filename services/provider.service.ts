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
      // Mock stats for preview
      return {
        stats: {
          totalCars: 12,
          activeListings: 10,
          totalBookings: 38,
          totalOrders: 4,
          totalRevenue: 28450,
          rentalRevenue: 12450,
          salesRevenue: 16000,
        },
        recentBookings: [
          {
            _id: 'bk-201',
            carId: { title: 'BMW M4 Competition Coupe', model: 'M4 Competition' },
            userId: { name: 'Sarah Jenkins', email: 'sarah@example.com' },
            startDate: '2026-09-10T10:00:00.000Z',
            endDate: '2026-09-14T10:00:00.000Z',
            totalAmount: 1156,
            status: 'confirmed',
          },
        ],
      };
    }
  },

  async getAllProviders(page: number = 1, limit: number = 12) {
    const res: any = await apiClient.get('/providers', { params: { page, limit } });
    return res.data;
  },
};

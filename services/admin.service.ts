import { apiClient } from '@/lib/api-client';

export interface AdminStatsData {
  metrics: {
    totalRevenue: number;
    totalUsers: number;
    totalProviders: number;
    totalCars: number;
    activeFleet: number;
    totalBookings: number;
    totalOrders: number;
    completedPaymentsCount: number;
  };
  recentBookings: any[];
  recentUsers: any[];
}

export const adminService = {
  async getStats(): Promise<AdminStatsData> {
    try {
      const res: any = await apiClient.get('/admin/stats');
      return res.data;
    } catch {
      // Mock stats for preview
      return {
        metrics: {
          totalRevenue: 284950,
          totalUsers: 1420,
          totalProviders: 38,
          totalCars: 184,
          activeFleet: 142,
          totalBookings: 890,
          totalOrders: 64,
          completedPaymentsCount: 954,
        },
        recentBookings: [
          {
            _id: 'bk-adm-1',
            carId: { title: 'Porsche 911 Carrera 4S', brand: 'Porsche' },
            userId: { name: 'David Beckham', email: 'david@example.com' },
            totalAmount: 1680,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'bk-adm-2',
            carId: { title: 'Viper SXT Coupe', brand: 'Dodge' },
            userId: { name: 'Elena Rostova', email: 'elena@example.com' },
            totalAmount: 1316,
            status: 'active',
            createdAt: new Date().toISOString(),
          },
        ],
        recentUsers: [
          {
            _id: 'usr-1',
            name: 'Michael Chen',
            email: 'michael@example.com',
            role: 'provider',
            status: 'active',
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'usr-2',
            name: 'Sophia Loren',
            email: 'sophia@example.com',
            role: 'user',
            status: 'active',
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }
  },

  async getUsers(params?: any) {
    try {
      const res: any = await apiClient.get('/admin/users', { params });
      return res.data;
    } catch {
      return [
        { _id: 'u-1', name: 'Alex Mercer', email: 'alex@example.com', role: 'admin', status: 'active' },
        { _id: 'u-2', name: 'Apex Motors Dealership', email: 'info@apex.com', role: 'provider', status: 'active' },
        { _id: 'u-3', name: 'Sarah Connor', email: 'sarah@example.com', role: 'user', status: 'active' },
      ];
    }
  },

  async updateUserStatus(userId: string, status: string) {
    const res: any = await apiClient.put(`/admin/users/${userId}/status`, { status });
    return res.data;
  },

  async getProviders(params?: any) {
    try {
      const res: any = await apiClient.get('/admin/providers', { params });
      return res.data;
    } catch {
      return [
        {
          _id: 'p-1',
          businessName: 'Apex Luxury Fleet NY',
          providerType: 'both',
          phone: '+1 (555) 0199',
          email: 'fleet@apex.com',
          isVerified: true,
          rating: 4.9,
        },
        {
          _id: 'p-2',
          businessName: 'Miami Supercar Vault',
          providerType: 'rental',
          phone: '+1 (555) 0288',
          email: 'rentals@vault.com',
          isVerified: false,
          rating: 5.0,
        },
      ];
    }
  },

  async verifyProvider(providerId: string, isVerified: boolean) {
    const res: any = await apiClient.put(`/admin/providers/${providerId}/verify`, { isVerified });
    return res.data;
  },

  async getCoupons() {
    try {
      const res: any = await apiClient.get('/admin/coupons');
      return res.data;
    } catch {
      return [
        {
          _id: 'c-1',
          code: 'SUMMER2026',
          discountType: 'percentage',
          discountValue: 15,
          isActive: true,
          usageCount: 42,
          usageLimit: 100,
        },
        {
          _id: 'c-2',
          code: 'VIP100OFF',
          discountType: 'fixed',
          discountValue: 100,
          isActive: true,
          usageCount: 18,
          usageLimit: 50,
        },
      ];
    }
  },

  async createCoupon(data: any) {
    const res: any = await apiClient.post('/admin/coupons', data);
    return res.data;
  },
};

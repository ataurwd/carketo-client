import { apiClient } from '@/lib/api-client';
import { IUser } from '@/types/auth.types';

export interface UserDashboardData {
  stats: {
    totalBookings: number;
    activeRentals: number;
    totalOrders: number;
    wishlistCount: number;
    unreadNotifications: number;
  };
  recentBookings: any[];
}

export const userService = {
  async getProfile(): Promise<IUser> {
    const res: any = await apiClient.get('/users/profile');
    return res.data;
  },

  async updateProfile(data: { name?: string; phone?: string; avatar?: string }): Promise<IUser> {
    const res: any = await apiClient.put('/users/profile', data);
    return res.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const res: any = await apiClient.put('/users/change-password', { currentPassword, newPassword });
    return res.data;
  },

  async getDashboard(): Promise<UserDashboardData> {
    try {
      const res: any = await apiClient.get('/users/dashboard');
      return res.data;
    } catch {
      // Mock stats for immediate interactive dashboard preview
      return {
        stats: {
          totalBookings: 3,
          activeRentals: 1,
          totalOrders: 0,
          wishlistCount: 4,
          unreadNotifications: 2,
        },
        recentBookings: [
          {
            _id: 'bk-101',
            carId: {
              title: 'Viper SXT Coupe Sports',
              brand: 'Dodge',
              model: 'Viper SXT',
              coverImage:
                'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80',
            },
            startDate: '2026-09-01T10:00:00.000Z',
            endDate: '2026-09-05T18:00:00.000Z',
            totalAmount: 1316,
            status: 'confirmed',
          },
        ],
      };
    }
  },
};

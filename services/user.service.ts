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
      return {
        stats: {
          totalBookings: 0,
          activeRentals: 0,
          totalOrders: 0,
          wishlistCount: 0,
          unreadNotifications: 0,
        },
        recentBookings: [],
      };
    }
  },
};

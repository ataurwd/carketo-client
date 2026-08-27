import { apiClient } from '@/lib/api-client';

export interface INotification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export const notificationService = {
  async getNotifications(): Promise<{ notifications: INotification[]; unreadCount: number }> {
    try {
      const res: any = await apiClient.get('/notifications');
      return {
        notifications: res.data || [],
        unreadCount: res.meta?.unreadCount || 0,
      };
    } catch {
      return {
        notifications: [
          {
            _id: 'notif-1',
            title: 'Reservation Confirmed',
            message: 'Your rental reservation for Viper SXT Coupe has been confirmed.',
            type: 'booking',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'notif-2',
            title: 'Welcome to Carketo',
            message: 'Explore our luxury automotive fleet and schedule your next reservation.',
            type: 'general',
            isRead: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
        unreadCount: 1,
      };
    }
  },

  async markAsRead(id: string) {
    const res: any = await apiClient.put(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllAsRead() {
    const res: any = await apiClient.put('/notifications/read-all');
    return res.data;
  },
};

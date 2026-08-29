import { apiClient } from '@/lib/api-client';

export interface INotification {
  _id: string;
  title: string;
  message: string;
  type: 'booking' | 'order' | 'payment' | 'system' | 'review' | 'car_approval' | 'inquiry' | string;
  isRead: boolean;
  link?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface NotificationResponse {
  notifications: INotification[];
  total: number;
  unreadCount: number;
}

export const notificationService = {
  async getNotifications(page: number = 1, limit: number = 20): Promise<NotificationResponse> {
    const res: any = await apiClient.get('/notifications', { params: { page, limit } });
    return {
      notifications: res.data || [],
      total: res.meta?.total || (res.data ? res.data.length : 0),
      unreadCount: res.meta?.unreadCount || 0,
    };
  },

  async markAsRead(id: string): Promise<INotification> {
    const res: any = await apiClient.put(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.put('/notifications/read-all');
  },

  async deleteNotification(id: string): Promise<void> {
    await apiClient.delete(`/notifications/${id}`);
  },
};

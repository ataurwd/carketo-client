import { apiClient } from '@/lib/api-client';

export interface TimeSeriesPoint {
  date?: string;
  month?: string;
  label: string;
  users: number;
  cars: number;
  inquiries: number;
}

export interface BrandBreakdown {
  brand: string;
  count: number;
  percentage: number;
}

export interface AdminStatsData {
  metrics: {
    totalRevenue: number;
    grossFleetValue: number;
    totalUsers: number;
    totalAdmins: number;
    totalCars: number;
    activeFleet: number;
    totalRentals: number;
    totalSales: number;
    totalInquiries: number;
    totalReviews: number;
    completedPaymentsCount: number;
  };
  analytics?: {
    daily: TimeSeriesPoint[];
    monthly: TimeSeriesPoint[];
    topBrands: BrandBreakdown[];
    listingBreakdown: {
      rent: number;
      sale: number;
    };
  };
  recentBookings?: any[];
  recentUsers: any[];
  recentCars: any[];
  recentInquiries: any[];
}

export interface ISettingsData {
  _id?: string;
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  headquartersAddress: string;
  currency: string;
  currencySymbol: string;
  distanceUnit: string;
  maxPhotosPerCar: number;
  maxPhotoSizeMb: number;
  autoApproveListings: boolean;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  topAnnouncement: {
    enabled: boolean;
    text: string;
    link: string;
  };
}

export interface IHealthTelemetry {
  timestamp: string;
  uptimeSeconds: number;
  database: {
    status: string;
    host: string;
    name: string;
  };
  process: {
    nodeVersion: string;
    memoryRssMb: string;
    memoryHeapUsedMb: string;
    memoryHeapTotalMb: string;
  };
  services: {
    api: string;
    cache: string;
    orchestration: string;
  };
}

export const adminService = {
  // ===================== OVERVIEW & TELEMETRY =====================
  async getStats(): Promise<AdminStatsData> {
    const res: any = await apiClient.get('/admin/stats');
    return res.data;
  },

  async getHealthTelemetry(): Promise<IHealthTelemetry> {
    const res: any = await apiClient.get('/admin/health-telemetry');
    return res.data;
  },

  async getAuditLogs(params?: any) {
    const res: any = await apiClient.get('/admin/audit-logs', { params });
    return res.data || [];
  },

  // ===================== USER MANAGEMENT & RBAC =====================
  async getUsers(params?: any) {
    const res: any = await apiClient.get('/admin/users', { params });
    return res.data || [];
  },

  async updateUserStatus(userId: string, status: string, reason?: string) {
    const res: any = await apiClient.put(`/admin/users/${userId}/status`, { status, reason });
    return res.data;
  },

  async updateUserRole(userId: string, role: string) {
    const res: any = await apiClient.put(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  // ===================== MASTER CAR FLEET & MODERATION =====================
  async getCarsAdmin(params?: any) {
    const res: any = await apiClient.get('/admin/cars', { params });
    return res.data || [];
  },

  async updateCarStatus(carId: string, status: string, reason?: string) {
    const res: any = await apiClient.put(`/admin/cars/${carId}/status`, { status, reason });
    return res.data;
  },

  async toggleCarFeatured(carId: string, isFeatured: boolean) {
    const res: any = await apiClient.put(`/admin/cars/${carId}/feature`, { isFeatured });
    return res.data;
  },

  async deleteCarAdmin(carId: string) {
    const res: any = await apiClient.delete(`/admin/cars/${carId}`);
    return res.data;
  },

  // ===================== INQUIRIES & LEADS =====================
  async getInquiriesAdmin(params?: any) {
    const res: any = await apiClient.get('/admin/inquiries', { params });
    return res.data || [];
  },

  async deleteInquiryAdmin(inquiryId: string) {
    const res: any = await apiClient.delete(`/admin/inquiries/${inquiryId}`);
    return res.data;
  },

  // ===================== CONTACT SUBMISSIONS =====================
  async getContactMessages(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    const res: any = await apiClient.get('/admin/contacts', { params });
    return res;
  },

  async getContactStats() {
    const res: any = await apiClient.get('/admin/contacts/stats');
    return res.data;
  },

  async updateContactStatus(id: string, status: string) {
    const res: any = await apiClient.patch(`/admin/contacts/${id}/status`, { status });
    return res.data;
  },

  async deleteContactMessage(id: string) {
    const res: any = await apiClient.delete(`/admin/contacts/${id}`);
    return res.data;
  },

  // ===================== REVIEWS & REPUTATION =====================
  async getReviewsAdmin(params?: any) {
    const res: any = await apiClient.get('/admin/reviews', { params });
    return res.data || [];
  },

  async deleteReviewAdmin(reviewId: string) {
    const res: any = await apiClient.delete(`/admin/reviews/${reviewId}`);
    return res.data;
  },

  // ===================== GLOBAL SETTINGS & CONFIG =====================
  async getSettings(): Promise<ISettingsData> {
    const res: any = await apiClient.get('/admin/settings');
    return res.data;
  },

  async updateSettings(data: Partial<ISettingsData>): Promise<ISettingsData> {
    const res: any = await apiClient.put('/admin/settings', data);
    return res.data;
  },

  // ===================== COUPONS & PROVIDERS =====================
  async getCoupons() {
    const res: any = await apiClient.get('/admin/coupons');
    return res.data || [];
  },

  async createCoupon(data: any) {
    const res: any = await apiClient.post('/admin/coupons', data);
    return res.data;
  },

  async getProviders(params?: any) {
    const res: any = await apiClient.get('/admin/providers', { params });
    return res.data || [];
  },

  async verifyProvider(providerId: string, isVerified: boolean, notes?: string) {
    const res: any = await apiClient.put(`/admin/providers/${providerId}/verify`, {
      isVerified,
      notes,
    });
    return res.data;
  },
};

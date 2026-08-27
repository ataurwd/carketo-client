export * from './car.types';
export * from './auth.types';
export * from './booking.types';

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
}

export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  country?: string;
  isActive: boolean;
}

export interface IReview {
  _id: string;
  userId: string;
  carId: string;
  providerId: string;
  bookingId?: string;
  orderId?: string;
  rating: number;
  comment: string;
  status: 'published' | 'pending' | 'hidden';
  createdAt: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

export interface IWishlistItem {
  _id: string;
  userId: string;
  carId: string;
  createdAt: string;
}

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'order' | 'payment' | 'system' | 'review' | 'car_approval';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ICoupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

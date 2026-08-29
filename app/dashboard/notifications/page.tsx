'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { notificationService, INotification } from '@/services/notification.service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  CalendarCheck,
  ShieldAlert,
  CreditCard,
  MessageSquare,
  Star,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    notificationService
      .getNotifications()
      .then((res) => {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      setNotifications(notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      const target = notifications.find((n) => n._id === id);
      if (target && !target.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch {
      setNotifications(notifications.filter((n) => n._id !== id));
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.isRead;
    return n.type === filterType;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'inquiry':
        return <MessageSquare className="w-5 h-5" />;
      case 'car_approval':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'review':
        return <Star className="w-5 h-5" />;
      case 'payment':
        return <CreditCard className="w-5 h-5" />;
      case 'booking':
        return <CalendarCheck className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-black">Notifications & Alerts</h1>
                {unreadCount > 0 && (
                  <span className="h-6 px-2.5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Real-time lead inquiries, marketplace announcements, and vehicle status updates.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllRead}
                  leftIcon={<CheckCheck className="w-4 h-4" />}
                  className="text-xs font-bold"
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-zinc-200 shadow-sm text-xs font-bold overflow-x-auto">
          {[
            { key: 'all', label: 'All Alerts' },
            { key: 'unread', label: 'Unread' },
            { key: 'inquiry', label: 'Buyer Inquiries' },
            { key: 'car_approval', label: 'Car Approvals' },
            { key: 'system', label: 'System' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilterType(item.key)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                filterType === item.key ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm divide-y divide-zinc-100 overflow-hidden">
          {isLoading ? (
            <div className="p-16 text-center space-y-4">
              <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-zinc-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.isRead && handleMarkRead(n._id)}
                className={`p-5 sm:p-6 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                  n.isRead ? 'bg-white hover:bg-zinc-50/60' : 'bg-zinc-50/90 hover:bg-zinc-100/60'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div
                    className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      n.isRead
                        ? 'bg-zinc-100 text-zinc-500'
                        : n.type === 'inquiry'
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-black text-white shadow-sm'
                    }`}
                  >
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-sm ${
                          n.isRead ? 'font-semibold text-zinc-800' : 'font-black text-black'
                        }`}
                      >
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">{n.message}</p>

                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-bold text-black hover:underline mt-1 pt-1"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!n.isRead && (
                    <span className="h-2.5 w-2.5 rounded-full bg-black shrink-0" />
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, n._id)}
                    className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 p-8 space-y-3">
              <div className="h-12 w-12 mx-auto rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-zinc-800">No notifications found</p>
              <p className="text-xs text-zinc-500">You are all caught up with your platform updates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

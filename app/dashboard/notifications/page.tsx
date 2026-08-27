'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { notificationService, INotification } from '@/services/notification.service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Bell, CheckCheck, CalendarCheck, ShieldAlert, CreditCard } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    notificationService
      .getNotifications()
      .then((res) => {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
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
                <h1 className="text-2xl sm:text-3xl font-black text-black">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="h-6 px-2.5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Real-time booking updates, vehicle delivery logs, and platform alerts.
              </p>
            </div>

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

        {/* Notifications List */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm divide-y divide-zinc-100 overflow-hidden">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.isRead && handleMarkRead(n._id)}
                className={`p-5 sm:p-6 flex items-start gap-4 transition-colors cursor-pointer ${
                  n.isRead ? 'bg-white hover:bg-zinc-50/60' : 'bg-zinc-50/90 hover:bg-zinc-100/60'
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    n.isRead ? 'bg-zinc-100 text-zinc-500' : 'bg-black text-white shadow-sm'
                  }`}
                >
                  {n.type === 'booking' ? (
                    <CalendarCheck className="w-5 h-5" />
                  ) : n.type === 'payment' ? (
                    <CreditCard className="w-5 h-5" />
                  ) : (
                    <Bell className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm ${
                        n.isRead ? 'font-semibold text-zinc-800' : 'font-black text-black'
                      }`}
                    >
                      {n.title}
                    </h4>
                    <span className="text-[11px] text-zinc-400">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">{n.message}</p>
                </div>

                {!n.isRead && (
                  <span className="h-2 w-2 rounded-full bg-black shrink-0 mt-2" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 p-8 space-y-3">
              <div className="h-12 w-12 mx-auto rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-zinc-800">No notifications</p>
              <p className="text-xs text-zinc-500">You're all caught up with your reservations!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

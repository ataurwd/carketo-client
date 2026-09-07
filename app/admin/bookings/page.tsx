'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { adminService, IBookingAdmin } from '@/services/admin.service';
import { confirmDialog, showToast } from '@/lib/alert';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  CalendarCheck2,
  Search,
  SlidersHorizontal,
  Car,
  User,
  Clock,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Phone,
  Mail,
  X,
  ChevronRight,
  Download,
  ChevronDown,
  Check,
} from 'lucide-react';

const BOOKING_STATUS_CONFIG: Record<
  string,
  { label: string; badge: string; dot: string; desc: string }
> = {
  pending: {
    label: 'Pending',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.1)]',
    dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    desc: 'Awaiting host / admin confirmation',
  },
  confirmed: {
    label: 'Confirmed',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.1)]',
    dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    desc: 'Approved & reserved for renter',
  },
  active: {
    label: 'Active (Ongoing)',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.1)]',
    dot: 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]',
    desc: 'Trip in progress on the road',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.1)]',
    dot: 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]',
    desc: 'Vehicle returned & inspected',
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.1)]',
    dot: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]',
    desc: 'Reservation revoked / refunded',
  },
};

function BookingStatusDropdown({
  bookingId,
  currentStatus,
  onStatusChange,
}: {
  bookingId: string;
  currentStatus: string;
  onStatusChange: (bookingId: string, newStatus: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const activeConfig = BOOKING_STATUS_CONFIG[currentStatus] || BOOKING_STATUS_CONFIG.pending;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer select-none ${activeConfig.badge}`}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${activeConfig.dot}`} />
        <span>{activeConfig.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-zinc-900/98 backdrop-blur-2xl border border-zinc-700/80 shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 border-b border-zinc-800/80 mb-1 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
              Update Booking Status
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Live</span>
          </div>
          <div className="space-y-0.5">
            {Object.entries(BOOKING_STATUS_CONFIG).map(([key, config]) => {
              const isSelected = key === currentStatus;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onStatusChange(bookingId, key);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                    isSelected
                      ? 'bg-zinc-800 text-white shadow-inner'
                      : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
                    <div className="text-left truncate">
                      <p className="truncate leading-tight text-white">{config.label}</p>
                      <p className="text-[10px] text-zinc-400 font-normal truncate mt-0.5">
                        {config.desc}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<IBookingAdmin[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<IBookingAdmin | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setIsLoading(true);
    adminService
      .getBookings()
      .then((res) => {
        setBookings(res || []);
      })
      .catch((err) => console.error('Failed to load bookings:', err))
      .finally(() => setIsLoading(false));
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await adminService.updateBookingStatus(bookingId, newStatus);
      setBookings(
        bookings.map((b) => (b._id === bookingId ? { ...b, status: newStatus as any } : b))
      );
      if (selectedBooking?._id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus as any });
      }
      showToast(`Booking marked as ${newStatus}`, 'success');
    } catch {
      showToast('Failed to update booking status', 'error');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchCustomer = b.userId?.name?.toLowerCase().includes(q) || b.userId?.email?.toLowerCase().includes(q);
      const matchCar = b.carId?.title?.toLowerCase().includes(q) || b.carId?.brand?.toLowerCase().includes(q);
      const matchLoc = b.pickupLocation?.toLowerCase().includes(q) || b.returnLocation?.toLowerCase().includes(q);
      const matchId = b._id.toLowerCase().includes(q);
      return matchCustomer || matchCar || matchLoc || matchId;
    }
    return true;
  });

  const totalRentalRevenue = bookings
    .filter((b) => b.paymentStatus === 'paid' || b.status === 'completed')
    .reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const activeCount = bookings.filter((b) => b.status === 'confirmed' || b.status === 'active').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  const exportCSV = () => {
    const headers = ['BookingID', 'Customer', 'Email', 'Vehicle', 'StartDate', 'EndDate', 'Days', 'TotalAmount', 'Status', 'Payment'];
    const rows = filteredBookings.map((b) => [
      `"${b._id}"`,
      `"${b.userId?.name || 'Customer'}"`,
      `"${b.userId?.email || ''}"`,
      `"${b.carId?.title || ''}"`,
      `"${new Date(b.startDate).toLocaleDateString()}"`,
      `"${new Date(b.endDate).toLocaleDateString()}"`,
      b.totalDays,
      b.totalAmount,
      b.status,
      b.paymentStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `karketo_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white">Rental Reservations Management</h1>
            <span className="h-6 px-2.5 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center shadow-sm">
              {bookings.length} Total
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Monitor, approve, verify deposits, and manage customer vehicle rental bookings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={exportCSV}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-zinc-400">Total Bookings</p>
          <p className="text-xl font-black text-white mt-1">{bookings.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-amber-400">Pending Review</p>
          <p className="text-xl font-black text-amber-400 mt-1">{pendingCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-emerald-400">Active / Confirmed</p>
          <p className="text-xl font-black text-emerald-400 mt-1">{activeCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-orange-400">Rental Gross Revenue</p>
          <p className="text-xl font-black text-orange-400 mt-1">{formatPrice(totalRentalRevenue)}</p>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-zinc-900/80 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-zinc-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, booking ID, car title, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500 placeholder:text-zinc-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Booking Statuses</option>
            <option value="pending">Pending Confirmation</option>
            <option value="confirmed">Confirmed</option>
            <option value="active">Active Rental (Ongoing)</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-zinc-400">
            <div className="h-8 w-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading rental reservations...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CalendarCheck2 className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-xs font-bold text-zinc-400">No rental reservations found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/70 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                  <th className="py-3.5 px-4 sm:px-6">Customer</th>
                  <th className="py-3.5 px-4">Reserved Vehicle</th>
                  <th className="py-3.5 px-4">Dates & Duration</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Booking Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs font-medium">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-zinc-800/40 transition-colors">
                    {/* Customer */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        {b.userId?.avatar ? (
                          <img
                            src={b.userId.avatar}
                            alt=""
                            className="w-8 h-8 rounded-xl object-cover bg-zinc-800 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {b.userId?.name ? b.userId.name.charAt(0).toUpperCase() : 'C'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{b.userId?.name || 'Customer'}</p>
                          <p className="text-[11px] text-zinc-400 truncate">{b.userId?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5 min-w-[160px]">
                        {b.carId?.coverImage ? (
                          <img
                            src={b.carId.coverImage}
                            alt=""
                            className="w-12 h-9 rounded-lg object-cover bg-zinc-800 shrink-0 border border-zinc-700/50"
                          />
                        ) : (
                          <div className="w-12 h-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                            <Car className="w-4 h-4 text-zinc-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-200 truncate">{b.carId?.title || 'Vehicle'}</p>
                          <p className="text-[10px] text-zinc-400">{b.carId?.brand} {b.carId?.model}</p>
                        </div>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-zinc-200">
                        {new Date(b.startDate).toLocaleDateString()} &rarr; {new Date(b.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-semibold">{b.totalDays} Days</p>
                    </td>

                    {/* Total Amount */}
                    <td className="py-4 px-4">
                      <p className="font-black text-orange-400">{formatPrice(b.totalAmount || 0)}</p>
                      {b.depositAmount ? (
                        <p className="text-[10px] text-zinc-400">Dep: {formatPrice(b.depositAmount)}</p>
                      ) : null}
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          b.paymentStatus === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : b.paymentStatus === 'refunded'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : b.paymentStatus === 'failed'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>

                    {/* Booking Status Dropdown */}
                    <td className="py-4 px-4">
                      <BookingStatusDropdown
                        bookingId={b._id}
                        currentStatus={b.status}
                        onStatusChange={handleStatusUpdate}
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        title="View Full Booking Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400">
                  <CalendarCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Rental Reservation Dossier</h2>
                  <p className="text-[11px] text-zinc-400 font-mono">ID: {selectedBooking._id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Vehicle & Customer Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <p className="text-[10px] font-extrabold uppercase text-zinc-400">Reserved Vehicle</p>
                  <p className="font-bold text-white text-sm">{selectedBooking.carId?.title}</p>
                  <p className="text-zinc-400">{selectedBooking.carId?.brand} {selectedBooking.carId?.model}</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <p className="text-[10px] font-extrabold uppercase text-zinc-400">Customer</p>
                  <p className="font-bold text-white text-sm">{selectedBooking.userId?.name || 'Customer'}</p>
                  <p className="text-zinc-400">{selectedBooking.userId?.email}</p>
                  {selectedBooking.userId?.phone && (
                    <p className="text-zinc-400">{selectedBooking.userId?.phone}</p>
                  )}
                </div>
              </div>

              {/* Itinerary */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <p className="text-[10px] font-extrabold uppercase text-zinc-400">Trip Itinerary & Location</p>
                <div className="grid grid-cols-2 gap-2 text-zinc-300">
                  <div>
                    <span className="text-zinc-400 text-[11px]">Pickup Date:</span>
                    <p className="font-bold text-white">{new Date(selectedBooking.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[11px]">Return Date:</span>
                    <p className="font-bold text-white">{new Date(selectedBooking.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-zinc-800/60 text-zinc-300">
                  <p className="text-[11px]"><span className="text-zinc-400">Pickup Hub:</span> {selectedBooking.pickupLocation}</p>
                  <p className="text-[11px]"><span className="text-zinc-400">Return Hub:</span> {selectedBooking.returnLocation}</p>
                </div>
              </div>

              {/* Financials */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <p className="text-[10px] font-extrabold uppercase text-zinc-400">Financial Breakdown</p>
                <div className="space-y-1 text-zinc-300">
                  <div className="flex justify-between">
                    <span>Daily Rate ({selectedBooking.totalDays} days):</span>
                    <span>{formatPrice(selectedBooking.dailyRate * selectedBooking.totalDays)}</span>
                  </div>
                  {selectedBooking.depositAmount ? (
                    <div className="flex justify-between">
                      <span>Refundable Security Deposit:</span>
                      <span>{formatPrice(selectedBooking.depositAmount)}</span>
                    </div>
                  ) : null}
                  {selectedBooking.discountAmount ? (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount Applied:</span>
                      <span>-{formatPrice(selectedBooking.discountAmount)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between font-black text-white text-sm pt-2 border-t border-zinc-800">
                    <span>Total Amount:</span>
                    <span className="text-orange-400">{formatPrice(selectedBooking.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                {selectedBooking.status === 'pending' && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedBooking._id, 'confirmed')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                  >
                    Confirm Reservation
                  </Button>
                )}

                {selectedBooking.status === 'confirmed' && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedBooking._id, 'active')}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                  >
                    Mark Vehicle Handed Over (Active)
                  </Button>
                )}

                {selectedBooking.status === 'active' && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedBooking._id, 'completed')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                  >
                    Mark Completed (Returned)
                  </Button>
                )}

                {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedBooking._id, 'cancelled')}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30 rounded-xl text-xs font-bold"
                  >
                    Cancel Reservation
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

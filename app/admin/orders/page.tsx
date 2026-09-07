'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { adminService, IOrderAdmin } from '@/services/admin.service';
import { confirmDialog, showToast } from '@/lib/alert';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  ShoppingBag,
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
  Receipt,
  Truck,
  ChevronDown,
  Check,
} from 'lucide-react';

const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; badge: string; dot: string; desc: string }
> = {
  pending: {
    label: 'Pending',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.1)]',
    dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    desc: 'Purchase order received',
  },
  processing: {
    label: 'Processing',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.1)]',
    dot: 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]',
    desc: 'Contract & title documentation',
  },
  completed: {
    label: 'Completed / Delivered',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.1)]',
    dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    desc: 'Vehicle handed over to buyer',
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.1)]',
    dot: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]',
    desc: 'Order voided / cancelled',
  },
};

function OrderStatusDropdown({
  orderId,
  currentStatus,
  onStatusChange,
}: {
  orderId: string;
  currentStatus: string;
  onStatusChange: (orderId: string, newStatus: string) => void;
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

  const activeConfig = ORDER_STATUS_CONFIG[currentStatus] || ORDER_STATUS_CONFIG.pending;

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
              Update Order Status
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Live</span>
          </div>
          <div className="space-y-0.5">
            {Object.entries(ORDER_STATUS_CONFIG).map(([key, config]) => {
              const isSelected = key === currentStatus;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onStatusChange(orderId, key);
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrderAdmin[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IOrderAdmin | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setIsLoading(true);
    adminService
      .getOrders()
      .then((res) => {
        setOrders(res || []);
      })
      .catch((err) => console.error('Failed to load orders:', err))
      .finally(() => setIsLoading(false));
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, status: newStatus as any } : o))
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch {
      showToast('Failed to update order status', 'error');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchBuyer = o.userId?.name?.toLowerCase().includes(q) || o.userId?.email?.toLowerCase().includes(q);
      const matchCar = o.carId?.title?.toLowerCase().includes(q) || o.carId?.brand?.toLowerCase().includes(q);
      const matchCity = o.deliveryAddress?.city?.toLowerCase().includes(q);
      const matchId = o._id.toLowerCase().includes(q);
      return matchBuyer || matchCar || matchCity || matchId;
    }
    return true;
  });

  const totalSalesVolume = orders
    .filter((o) => o.status === 'completed' || o.paymentStatus === 'paid')
    .reduce((acc, o) => acc + (o.finalPrice || o.salePrice || 0), 0);

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const processingCount = orders.filter((o) => o.status === 'processing').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  const exportCSV = () => {
    const headers = ['OrderID', 'Buyer', 'Email', 'Vehicle', 'SalePrice', 'Discount', 'FinalPrice', 'DeliveryCity', 'Status', 'PaymentStatus'];
    const rows = filteredOrders.map((o) => [
      `"${o._id}"`,
      `"${o.userId?.name || 'Buyer'}"`,
      `"${o.userId?.email || ''}"`,
      `"${o.carId?.title || ''}"`,
      o.salePrice,
      o.discountAmount || 0,
      o.finalPrice,
      `"${o.deliveryAddress?.city || ''}"`,
      o.status,
      o.paymentStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `karketo_orders_${new Date().toISOString().split('T')[0]}.csv`);
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
            <h1 className="text-2xl font-black text-white">Car Sales Orders Ledger</h1>
            <span className="h-6 px-2.5 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center shadow-sm">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage customer vehicle purchase transactions, transfer processing, and delivery status.
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

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-zinc-400">Total Sales Orders</p>
          <p className="text-xl font-black text-white mt-1">{orders.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-amber-400">Pending</p>
          <p className="text-xl font-black text-amber-400 mt-1">{pendingCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-blue-400">Processing Delivery</p>
          <p className="text-xl font-black text-blue-400 mt-1">{processingCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-emerald-400">Gross Sales Volume</p>
          <p className="text-xl font-black text-emerald-400 mt-1">{formatPrice(totalSalesVolume)}</p>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-zinc-900/80 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-zinc-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by buyer, car title, city, or order ID..."
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
            <option value="all">All Order Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing Delivery</option>
            <option value="completed">Completed / Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-zinc-400">
            <div className="h-8 w-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading sales orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingBag className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-xs font-bold text-zinc-400">No vehicle sales orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/70 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                  <th className="py-3.5 px-4 sm:px-6">Buyer Details</th>
                  <th className="py-3.5 px-4">Vehicle Purchased</th>
                  <th className="py-3.5 px-4">Final Price</th>
                  <th className="py-3.5 px-4">Delivery City</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs font-medium">
                {filteredOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-zinc-800/40 transition-colors">
                    {/* Buyer */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        {o.userId?.avatar ? (
                          <img
                            src={o.userId.avatar}
                            alt=""
                            className="w-8 h-8 rounded-xl object-cover bg-zinc-800 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {o.userId?.name ? o.userId.name.charAt(0).toUpperCase() : 'B'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{o.userId?.name || 'Buyer'}</p>
                          <p className="text-[11px] text-zinc-400 truncate">{o.userId?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5 min-w-[160px]">
                        {o.carId?.coverImage ? (
                          <img
                            src={o.carId.coverImage}
                            alt=""
                            className="w-12 h-9 rounded-lg object-cover bg-zinc-800 shrink-0 border border-zinc-700/50"
                          />
                        ) : (
                          <div className="w-12 h-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                            <Car className="w-4 h-4 text-zinc-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-200 truncate">{o.carId?.title || 'Vehicle'}</p>
                          <p className="text-[10px] text-zinc-400">{o.carId?.brand} {o.carId?.model}</p>
                        </div>
                      </div>
                    </td>

                    {/* Final Price */}
                    <td className="py-4 px-4">
                      <p className="font-black text-blue-400">{formatPrice(o.finalPrice || o.salePrice)}</p>
                      {o.discountAmount ? (
                        <p className="text-[10px] text-emerald-400">Saved: -{formatPrice(o.discountAmount)}</p>
                      ) : null}
                    </td>

                    {/* Destination City */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-zinc-200">{o.deliveryAddress?.city || 'Direct Pickup'}</p>
                      <p className="text-[10px] text-zinc-400">{o.deliveryAddress?.country || 'USA'}</p>
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          o.paymentStatus === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : o.paymentStatus === 'refunded'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : o.paymentStatus === 'failed'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>

                    {/* Order Status Dropdown */}
                    <td className="py-4 px-4">
                      <OrderStatusDropdown
                        orderId={o._id}
                        currentStatus={o.status}
                        onStatusChange={handleStatusUpdate}
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        title="View Full Order Invoice"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INVOICE & ORDER DOSSIER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Purchase Order Invoice</h2>
                  <p className="text-[11px] text-zinc-400 font-mono">Order ID: {selectedOrder._id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Vehicle & Buyer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <p className="text-[10px] font-extrabold uppercase text-zinc-400">Purchased Vehicle</p>
                  <p className="font-bold text-white text-sm">{selectedOrder.carId?.title}</p>
                  <p className="text-zinc-400">{selectedOrder.carId?.brand} {selectedOrder.carId?.model}</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <p className="text-[10px] font-extrabold uppercase text-zinc-400">Buyer Information</p>
                  <p className="font-bold text-white text-sm">{selectedOrder.userId?.name || 'Buyer'}</p>
                  <p className="text-zinc-400">{selectedOrder.userId?.email}</p>
                  {selectedOrder.userId?.phone && (
                    <p className="text-zinc-400">{selectedOrder.userId?.phone}</p>
                  )}
                </div>
              </div>

              {/* Delivery Destination */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <p className="text-[10px] font-extrabold uppercase text-zinc-400">Delivery Destination & Logistics</p>
                <p className="text-white font-semibold">{selectedOrder.deliveryAddress?.street}</p>
                <p className="text-zinc-400">
                  {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state || ''} {selectedOrder.deliveryAddress?.zipCode || ''} • {selectedOrder.deliveryAddress?.country}
                </p>
              </div>

              {/* Financial Calculation */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <p className="text-[10px] font-extrabold uppercase text-zinc-400">Order Financial Summary</p>
                <div className="space-y-1 text-zinc-300">
                  <div className="flex justify-between">
                    <span>Base Vehicle Sale Price:</span>
                    <span>{formatPrice(selectedOrder.salePrice)}</span>
                  </div>
                  {selectedOrder.discountAmount ? (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo Discount ({selectedOrder.couponCode || 'PROMO'}):</span>
                      <span>-{formatPrice(selectedOrder.discountAmount)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between font-black text-white text-sm pt-2 border-t border-zinc-800">
                    <span>Final Invoiced Price:</span>
                    <span className="text-blue-400">{formatPrice(selectedOrder.finalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Status Flow Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                {selectedOrder.status === 'pending' && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedOrder._id, 'processing')}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                  >
                    Set to Processing & Transit
                  </Button>
                )}

                {selectedOrder.status === 'processing' && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedOrder._id, 'completed')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                  >
                    Mark Delivery Completed
                  </Button>
                )}

                {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedOrder._id, 'cancelled')}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30 rounded-xl text-xs font-bold"
                  >
                    Cancel Order
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

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService, IPaymentAdmin } from '@/services/admin.service';
import { confirmDialog, showToast } from '@/lib/alert';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/common/Pagination';
import {
  CreditCard,
  Search,
  SlidersHorizontal,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Eye,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<IPaymentAdmin[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<IPaymentAdmin | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, pageSize]);

  const fetchPayments = () => {
    setIsLoading(true);
    adminService
      .getPayments()
      .then((res) => {
        setPayments(res || []);
      })
      .catch((err) => console.error('Failed to load payments:', err))
      .finally(() => setIsLoading(false));
  };

  const handleRefund = async (paymentId: string) => {
    const isConfirmed = await confirmDialog({
      title: 'Process Payment Refund?',
      text: 'Are you sure you want to process a refund for this transaction? This will reverse the customer charge.',
      confirmButtonText: 'Yes, Process Refund',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      isDestructive: true,
    });
    if (!isConfirmed) return;

    try {
      await adminService.refundPayment(paymentId, 'Administrator initiated refund');
      setPayments(
        payments.map((p) => (p._id === paymentId ? { ...p, status: 'refunded' } : p))
      );
      showToast('Refund processed successfully', 'success');
    } catch {
      showToast('Failed to process refund', 'error');
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTxn = p.transactionId?.toLowerCase().includes(q);
      const matchUser = p.userId?.name?.toLowerCase().includes(q) || p.userId?.email?.toLowerCase().includes(q);
      const matchGateway = p.gateway?.toLowerCase().includes(q);
      return matchTxn || matchUser || matchGateway;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredPayments.length / pageSize) || 1;
  const paginatedPayments = filteredPayments.slice((page - 1) * pageSize, page * pageSize);

  const totalCollected = payments
    .filter((p) => p.status === 'paid')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const totalRefunded = payments
    .filter((p) => p.status === 'refunded')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const paidCount = payments.filter((p) => p.status === 'paid').length;
  const avgTicket = paidCount > 0 ? totalCollected / paidCount : 0;

  const exportCSV = () => {
    const headers = ['TransactionID', 'Customer', 'Email', 'Amount', 'Currency', 'Gateway', 'Status', 'Date'];
    const rows = filteredPayments.map((p) => [
      `"${p.transactionId}"`,
      `"${p.userId?.name || 'Customer'}"`,
      `"${p.userId?.email || ''}"`,
      p.amount,
      p.currency || 'USD',
      `"${p.gateway}"`,
      p.status,
      `"${new Date(p.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `karketo_financial_ledger_${new Date().toISOString().split('T')[0]}.csv`);
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
            <h1 className="text-2xl font-black text-white">Financial Ledger & Transactions</h1>
            <span className="h-6 px-2.5 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center shadow-sm">
              {payments.length} Records
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Complete audit trail of all checkout sessions, rental charges, purchase payments, and refunds.
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
          <p className="text-[10px] font-extrabold uppercase text-emerald-400">Total Gross Collected</p>
          <p className="text-xl font-black text-white mt-1">{formatPrice(totalCollected)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-rose-400">Total Refunded</p>
          <p className="text-xl font-black text-rose-400 mt-1">{formatPrice(totalRefunded)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-zinc-400">Settled Payments</p>
          <p className="text-xl font-black text-white mt-1">{paidCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-orange-400">Average Transaction</p>
          <p className="text-xl font-black text-orange-400 mt-1">{formatPrice(avgTicket)}</p>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-zinc-900/80 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-zinc-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by transaction ID, customer email, or gateway..."
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
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid & Settled</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-300 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* PAYMENTS TABLE */}
      <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-zinc-400">
            <div className="h-8 w-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading financial ledger...
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CreditCard className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-xs font-bold text-zinc-400">No payment transaction records found.</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/70 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                  <th className="py-3.5 px-4 sm:px-6">Transaction ID</th>
                  <th className="py-3.5 px-4">Payer / Customer</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Gateway</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs font-medium">
                {paginatedPayments.map((p) => (
                  <tr key={p._id} className="hover:bg-zinc-800/40 transition-colors">
                    {/* Transaction ID */}
                    <td className="py-4 px-4 sm:px-6">
                      <p className="font-mono text-white font-bold truncate max-w-[150px]">
                        {p.transactionId}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        {p.bookingId ? 'Rental Booking' : p.orderId ? 'Vehicle Purchase' : 'Direct Payment'}
                      </p>
                    </td>

                    {/* Payer */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-zinc-200">{p.userId?.name || 'Customer'}</p>
                      <p className="text-[11px] text-zinc-400">{p.userId?.email || 'N/A'}</p>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4">
                      <p className="font-black text-white text-sm">
                        {formatPrice(p.amount)} <span className="text-[10px] text-zinc-400">{p.currency || 'USD'}</span>
                      </p>
                    </td>

                    {/* Gateway */}
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {p.gateway || 'Stripe'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          p.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : p.status === 'refunded'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : p.status === 'failed'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-zinc-400 text-[11px]">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPayment(p)}
                          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {p.status === 'paid' && (
                          <button
                            onClick={() => handleRefund(p._id)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Refund Payment"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="px-6 py-2">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredPayments.length}
              limit={pageSize}
              onPageChange={setPage}
              variant="dark"
              itemLabel="transactions"
            />
          </div>
        </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Payment Transaction Voucher</h2>
                  <p className="text-[11px] text-zinc-400 font-mono">Txn: {selectedPayment.transactionId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Amount:</span>
                  <span className="font-black text-white text-base">{formatPrice(selectedPayment.amount)} {selectedPayment.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Gateway:</span>
                  <span className="font-bold text-zinc-200">{selectedPayment.gateway}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status:</span>
                  <span className="font-bold uppercase text-emerald-400">{selectedPayment.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Settled At:</span>
                  <span className="text-zinc-300">{new Date(selectedPayment.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                <p className="text-[10px] font-extrabold uppercase text-zinc-400">Payer Details</p>
                <p className="font-bold text-white">{selectedPayment.userId?.name || 'Customer'}</p>
                <p className="text-zinc-400">{selectedPayment.userId?.email}</p>
              </div>

              {selectedPayment.status === 'paid' && (
                <Button
                  onClick={() => {
                    handleRefund(selectedPayment._id);
                    setSelectedPayment(null);
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
                >
                  Initiate Customer Refund
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

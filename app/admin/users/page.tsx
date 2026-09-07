'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { confirmDialog, showToast } from '@/lib/alert';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/common/Pagination';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  Key,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Calendar,
  Download,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset to first page on search or filter change
  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, statusFilter, pageSize]);

  const fetchUsers = () => {
    setIsLoading(true);
    adminService
      .getUsers()
      .then((res) => setUsers(res || []))
      .catch((err) => console.error('Failed to load users:', err))
      .finally(() => setIsLoading(false));
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await adminService.updateUserStatus(userId, newStatus);
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
      showToast(`User status updated to ${newStatus.toUpperCase()}`, 'success');
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const isConfirmed = await confirmDialog({
      title: 'Change User Role Privileges?',
      text: `Are you sure you want to change this user's role to ${newRole.toUpperCase()}? This grants/revokes administrative capabilities.`,
      confirmButtonText: `Yes, Make ${newRole.toUpperCase()}`,
      cancelButtonText: 'Cancel',
      icon: 'question',
      isDestructive: false,
    });
    if (!isConfirmed) return;

    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      showToast(`User role updated to ${newRole.toUpperCase()}`, 'success');
    } catch {
      showToast('Failed to update user role', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = u.name?.toLowerCase().includes(q);
      const matchEmail = u.email?.toLowerCase().includes(q);
      const matchPhone = u.phone?.toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Status', 'RegisteredDate'];
    const rows = filteredUsers.map((u) => [
      `"${u.name || 'User'}"`,
      `"${u.email}"`,
      `"${u.phone || ''}"`,
      u.role,
      u.status,
      `"${new Date(u.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `karketo_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const activeCount = users.filter((u) => u.status === 'active').length;
  const suspendedCount = users.filter((u) => u.status === 'suspended' || u.status === 'banned').length;

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white">Platform Users & RBAC Control</h1>
            <span className="h-6 px-2.5 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center shadow-sm">
              {users.length} Registered
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage user accounts, assign administrative privileges, and suspend unauthorized actors.
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

      {/* STATS TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-zinc-400">Total Accounts</p>
          <p className="text-xl font-black text-white mt-1">{users.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-orange-400">Administrators</p>
          <p className="text-xl font-black text-orange-400 mt-1">{adminCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-emerald-400">Active Accounts</p>
          <p className="text-xl font-black text-emerald-400 mt-1">{activeCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-rose-400">Suspended / Banned</p>
          <p className="text-xl font-black text-rose-400 mt-1">{suspendedCount}</p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-zinc-900/80 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-zinc-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500 placeholder:text-zinc-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-white focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="user">Standard Users</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-white focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
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

      {/* USERS TABLE */}
      <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-zinc-400">
            <div className="h-8 w-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading registered users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-xs font-bold text-zinc-400">No user accounts found matching your search.</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/70 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                    <th className="py-3.5 px-4 sm:px-6">User Details</th>
                    <th className="py-3.5 px-4">Contact Phone</th>
                    <th className="py-3.5 px-4">Role Privileges</th>
                    <th className="py-3.5 px-4">Account Status</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-xs font-medium">
                  {paginatedUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-zinc-800/40 transition-colors">
                      {/* User */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt=""
                              className="w-9 h-9 rounded-xl object-cover bg-zinc-800 shrink-0 border border-zinc-700"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-700 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-zinc-700">
                              {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">{u.name || 'User'}</p>
                            <p className="text-[11px] text-zinc-400 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 text-zinc-300">
                        {u.phone || <span className="text-zinc-500 italic">Not Provided</span>}
                      </td>

                      {/* Role Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border focus:outline-none transition-all cursor-pointer ${
                            u.role === 'admin'
                              ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                              : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                          }`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={u.status || 'active'}
                          onChange={(e) => handleStatusChange(u._id, e.target.value)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border focus:outline-none transition-all cursor-pointer ${
                            u.status === 'active' || !u.status
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : u.status === 'suspended'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                          <option value="banned">Banned</option>
                        </select>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 text-zinc-400 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
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
                totalItems={filteredUsers.length}
                limit={pageSize}
                onPageChange={setPage}
                variant="dark"
                itemLabel="users"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
